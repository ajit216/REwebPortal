import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Dashboard ─────────────────────────────────────────────────────────────

  async getDashboardStats() {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)

    const [
      totalUsers,
      verifiedBuyers,
      pendingVerifications,
      unacknowledgedGrievances,
      newUsersThisMonth,
      grievancesThisMonth,
      projectStats,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.buyerProfile.count({ where: { verificationStatus: 'VERIFIED_OWNER' } }),
      this.prisma.buyerProfile.count({ where: { verificationStatus: 'PENDING_REVIEW' } }),
      this.prisma.grievance.count({
        where: { status: 'SUBMITTED', createdAt: { lte: twoDaysAgo } },
      }),
      this.prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      this.prisma.grievance.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      this.prisma.project.groupBy({ by: ['status'], _count: { _all: true } }),
    ])

    const byStatus = projectStats.reduce((acc, s) => {
      acc[s.status] = Number(s._count._all)
      return acc
    }, {} as Record<string, number>)

    return {
      immediateActions: {
        unacknowledgedGrievances,
        pendingVerifications,
        moderationReports: 0, // placeholder — needs ModerationReport model
        projectsNeedingSync: 0, // placeholder
      },
      platformStats: {
        totalUsers,
        verifiedBuyers,
        grievancesThisMonth,
        newUsersThisMonth,
      },
      projectsByStatus: byStatus,
    }
  }

  // ─── Projects ──────────────────────────────────────────────────────────────

  async listProjects(page = 1, limit = 20, q?: string) {
    const where: any = {}
    if (q) where.OR = [{ name: { contains: q, mode: 'insensitive' } }]

    const [data, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          builder: { select: { name: true, slug: true } },
          reraRecords: {
            select: { status: true, updatedAt: true },
            orderBy: { updatedAt: 'desc' },
            take: 1,
          },
          _count: { select: { redFlags: { where: { isActive: true } } } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.project.count({ where }),
    ])

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  }

  async toggleProjectPublished(projectId: string, isPublished: boolean) {
    return this.prisma.project.update({
      where: { id: projectId },
      data: { isPublished },
      select: { id: true, name: true, isPublished: true },
    })
  }

  // ─── Buyer Verifications ───────────────────────────────────────────────────

  async listPendingVerifications(page = 1, limit = 20) {
    const [data, total] = await Promise.all([
      this.prisma.buyerProjectLink.findMany({
        where: { isVerified: false },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          buyerProfile: {
            select: {
              displayName: true,
              user: { select: { phone: true, createdAt: true } },
            },
          },
          project: { select: { name: true, slug: true } },
        },
        orderBy: { linkedAt: 'asc' },
      }),
      this.prisma.buyerProjectLink.count({ where: { isVerified: false } }),
    ])
    return { data, meta: { total, page, limit } }
  }

  async reviewVerification(
    linkId: string,
    approved: boolean,
    adminNote: string,
    adminId: string,
  ) {
    const link = await this.prisma.buyerProjectLink.findUnique({
      where: { id: linkId },
      select: { id: true, buyerProfileId: true },
    })
    if (!link) throw new NotFoundException('Verification request not found')

    const verificationStatus = approved ? 'VERIFIED_OWNER' : 'UNVERIFIED'

    await this.prisma.$transaction([
      this.prisma.buyerProjectLink.update({
        where: { id: linkId },
        data: { isVerified: approved },
      }),
      this.prisma.buyerProfile.update({
        where: { id: link.buyerProfileId },
        data: { verificationStatus },
      }),
      this.prisma.adminAction.create({
        data: {
          adminId,
          actionType: 'BUYER_VERIFICATION_REVIEW',
          entityId: linkId,
          entityType: 'BuyerProjectLink',
          notes: adminNote,
        },
      }),
    ])

    return { success: true, approved, verificationStatus }
  }

  // ─── Grievances ────────────────────────────────────────────────────────────

  async listGrievances(status?: string, page = 1, limit = 20) {
    const where: any = {}
    if (status) where.status = status

    const [data, total] = await Promise.all([
      this.prisma.grievance.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          project: { select: { name: true, slug: true } },
          user: { select: { phone: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.grievance.count({ where }),
    ])

    return { data, meta: { total, page, limit } }
  }

  async acknowledgeGrievance(grievanceId: string, adminId: string) {
    await this.prisma.$transaction([
      this.prisma.grievance.update({
        where: { id: grievanceId },
        data: { status: 'ACKNOWLEDGED', updatedAt: new Date() },
      }),
      this.prisma.adminAction.create({
        data: {
          adminId,
          actionType: 'GRIEVANCE_ACKNOWLEDGED',
          entityId: grievanceId,
          entityType: 'Grievance',
        },
      }),
    ])
    return { success: true }
  }

  // ─── Red Flags ─────────────────────────────────────────────────────────────

  async listRedFlags(active = true) {
    return this.prisma.projectRedFlag.findMany({
      where: { isActive: active },
      include: {
        project: { select: { name: true, slug: true, city: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async resolveRedFlag(flagId: string, evidence: string, adminId: string) {
    await this.prisma.$transaction([
      this.prisma.projectRedFlag.update({
        where: { id: flagId },
        data: {
          isActive: false,
          resolvedAt: new Date(),
          resolvedBy: adminId,
          resolutionNote: evidence,
        },
      }),
      this.prisma.adminAction.create({
        data: {
          adminId,
          actionType: 'RED_FLAG_RESOLVED',
          entityId: flagId,
          entityType: 'ProjectRedFlag',
          notes: evidence,
        },
      }),
    ])
    return { success: true }
  }
}
