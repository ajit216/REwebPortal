import { Injectable, NotFoundException } from '@nestjs/common'
import * as crypto from 'crypto'
import { PrismaService } from '../../prisma/prisma.service'
import { UpdateProfileDto } from './dto/users.dto'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        buyerProfile: {
          include: {
            projectLinks: {
              include: {
                project: {
                  select: {
                    id: true, slug: true, name: true, city: true, locality: true,
                    status: true, transparencyScore: true, delayMonths: true,
                    openGrievances: true, totalGrievances: true,
                    redFlags: { where: { isActive: true }, select: { id: true, title: true, severity: true } },
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!user) throw new NotFoundException('User not found')

    return {
      id: user.id,
      phone: user.phone,
      phoneVerified: user.phoneVerified,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      buyerProfile: user.buyerProfile,
    }
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { buyerProfile: true },
    })
    if (!user) throw new NotFoundException('User not found')

    if (!user.buyerProfile) {
      // Create profile if it doesn't exist
      return this.prisma.buyerProfile.create({
        data: {
          userId,
          displayName: dto.displayName ?? 'Buyer',
          preferredLocalities: dto.preferredLocalities ?? [],
        },
      })
    }

    return this.prisma.buyerProfile.update({
      where: { userId },
      data: {
        ...(dto.displayName ? { displayName: dto.displayName } : {}),
        ...(dto.preferredLocalities ? { preferredLocalities: dto.preferredLocalities } : {}),
      },
    })
  }

  async submitOwnershipVerification(
    userId: string,
    projectId: string,
    unitNumber: string,
    docKey: string, // R2 object key from file upload
  ) {
    // Hash unit number for privacy — never store plaintext
    const unitNumberHash = crypto
      .createHash('sha256')
      .update(`${projectId}:${unitNumber}`)
      .digest('hex')

    const profile = await this.prisma.buyerProfile.findUnique({ where: { userId } })
    if (!profile) throw new NotFoundException('Buyer profile not found. Please complete your profile first.')

    // Check if link already exists
    const existing = await this.prisma.buyerProjectLink.findUnique({
      where: { buyerProfileId_projectId: { buyerProfileId: profile.id, projectId } },
    })

    if (existing) {
      // Update existing link with new document
      await this.prisma.buyerProjectLink.update({
        where: { id: existing.id },
        data: { unitNumberHash },
      })
    } else {
      await this.prisma.buyerProjectLink.create({
        data: {
          buyerProfileId: profile.id,
          projectId,
          unitNumberHash,
          isVerified: false,
        },
      })
    }

    // Mark buyer profile as pending review
    await this.prisma.buyerProfile.update({
      where: { userId },
      data: {
        verificationStatus: 'PENDING_REVIEW',
        verificationDocKey: docKey,
      },
    })

    return {
      status: 'PENDING_REVIEW',
      message: 'Your document is under review. Expect response in 2-3 business days.',
    }
  }

  async getAlerts(userId: string) {
    // Get buyer's linked projects
    const profile = await this.prisma.buyerProfile.findUnique({
      where: { userId },
      include: { projectLinks: { select: { projectId: true } } },
    })

    if (!profile || profile.projectLinks.length === 0) {
      return { data: [] }
    }

    const projectIds = profile.projectLinks.map((l) => l.projectId)

    // Active red flags on linked projects
    const redFlags = await this.prisma.projectRedFlag.findMany({
      where: { projectId: { in: projectIds }, isActive: true },
      orderBy: { detectedAt: 'desc' },
      include: {
        project: { select: { id: true, slug: true, name: true } },
      },
    })

    // Recent grievance status changes
    const recentGrievanceUpdates = await this.prisma.grievanceStatusHistory.findMany({
      where: {
        grievance: { userId, projectId: { in: projectIds } },
        changedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      orderBy: { changedAt: 'desc' },
      include: {
        grievance: { select: { id: true, referenceId: true, title: true } },
      },
    })

    const alerts = [
      ...redFlags.map((f) => ({
        type: 'RED_FLAG',
        severity: f.severity,
        title: f.title,
        description: f.description,
        projectId: f.projectId,
        projectName: f.project.name,
        projectSlug: f.project.slug,
        detectedAt: f.detectedAt,
      })),
      ...recentGrievanceUpdates.map((h) => ({
        type: 'GRIEVANCE_UPDATE',
        severity: 'INFO',
        title: `Grievance status updated: ${h.toStatus}`,
        description: `Your grievance #${h.grievance.referenceId} status changed to ${h.toStatus}`,
        grievanceId: h.grievanceId,
        changedAt: h.changedAt,
      })),
    ].sort((a, b) => {
      const dateA = (a as any).detectedAt ?? (a as any).changedAt
      const dateB = (b as any).detectedAt ?? (b as any).changedAt
      return new Date(dateB).getTime() - new Date(dateA).getTime()
    })

    return { data: alerts }
  }
}
