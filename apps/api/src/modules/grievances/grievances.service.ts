import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common'
import * as crypto from 'crypto'
import { PrismaService } from '../../prisma/prisma.service'
import { NotificationsService, SmsTemplate } from '../notifications/notifications.service'
import { CreateGrievanceDto, UpdateGrievanceStatusDto } from './dto/grievances.dto'

const DUPLICATE_WINDOW_DAYS = 30

@Injectable()
export class GrievancesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  // ─── Public: Aggregated summary (no private data) ──────────────────────────

  async getProjectSummary(projectId: string) {
    const grievances = await this.prisma.grievance.groupBy({
      by: ['category', 'status'],
      where: { projectId, isPubliclyVisible: true },
      _count: { _all: true },
    })

    const total = grievances.reduce((acc, g) => acc + Number(g._count._all), 0)
    const open = grievances
      .filter((g) => ['SUBMITTED', 'ACKNOWLEDGED', 'ESCALATED'].includes(g.status))
      .reduce((acc, g) => acc + Number(g._count._all), 0)
    const resolved = grievances
      .filter((g) => g.status === 'RESOLVED')
      .reduce((acc, g) => acc + Number(g._count._all), 0)
    const escalated = grievances
      .filter((g) => g.status === 'ESCALATED')
      .reduce((acc, g) => acc + Number(g._count._all), 0)

    const byCategory = grievances.reduce((acc, g) => {
      if (!acc[g.category]) acc[g.category] = 0
      acc[g.category] += Number(g._count._all)
      return acc
    }, {} as Record<string, number>)

    return {
      total,
      open,
      resolved,
      escalated,
      byCategory: Object.entries(byCategory).map(([category, count]) => ({
        category,
        count: Number(count),
        percentage: total > 0 ? Math.round((Number(count) / total) * 100) : 0,
      })),
    }
  }

  // ─── Create grievance (authenticated buyer) ────────────────────────────────

  async create(userId: string, dto: CreateGrievanceDto) {
    // Verify project exists and is published
    const project = await this.prisma.project.findUnique({
      where: { id: dto.projectId, isPublished: true },
      select: { id: true, name: true },
    })
    if (!project) throw new NotFoundException('Project not found')

    // Duplicate check: same user + project + category within 30 days
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - DUPLICATE_WINDOW_DAYS)

    const duplicate = await this.prisma.grievance.findFirst({
      where: {
        userId,
        projectId: dto.projectId,
        category: dto.category,
        createdAt: { gte: cutoff },
        status: { not: 'DRAFT' },
      },
    })
    if (duplicate) throw new ConflictException('DUPLICATE_GRIEVANCE')

    // Check if buyer is verified for this project
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        buyerProfile: {
          include: { projectLinks: { where: { projectId: dto.projectId } } },
        },
      },
    })
    const isVerifiedBuyer = user?.buyerProfile?.projectLinks?.[0]?.isVerified ?? false

    const grievance = await this.prisma.grievance.create({
      data: {
        projectId: dto.projectId,
        userId,
        category: dto.category,
        severity: dto.severity,
        title: dto.title,
        description: dto.description,
        isAnonymous: dto.isAnonymous ?? false,
        isVerifiedBuyer,
        status: 'SUBMITTED',
        isPubliclyVisible: true,
      },
    })

    // Update project grievance count
    await this.prisma.project.update({
      where: { id: dto.projectId },
      data: {
        totalGrievances: { increment: 1 },
        openGrievances: { increment: 1 },
      },
    })

    return { grievanceId: grievance.id, referenceId: grievance.referenceId, status: grievance.status }
  }

  // ─── My grievances ─────────────────────────────────────────────────────────

  async getMyGrievances(userId: string, status?: string, page = 1, limit = 20) {
    const where: any = { userId }
    if (status) where.status = status

    const [data, total] = await Promise.all([
      this.prisma.grievance.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          project: { select: { id: true, slug: true, name: true, city: true } },
          evidenceFiles: { select: { id: true, fileName: true, fileType: true, uploadedAt: true } },
          statusHistory: { orderBy: { changedAt: 'desc' }, take: 5 },
        },
      }),
      this.prisma.grievance.count({ where }),
    ])

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  }

  // ─── Get single grievance (owner or admin) ─────────────────────────────────

  async findOne(id: string, userId: string, userRole: string) {
    const grievance = await this.prisma.grievance.findUnique({
      where: { id },
      include: {
        project: { select: { id: true, slug: true, name: true } },
        evidenceFiles: { select: { id: true, fileName: true, fileType: true, uploadedAt: true } },
        statusHistory: { orderBy: { changedAt: 'asc' } },
      },
    })

    if (!grievance) throw new NotFoundException('Grievance not found')

    if (grievance.userId !== userId && !['ADMIN', 'MODERATOR'].includes(userRole)) {
      throw new ForbiddenException('FORBIDDEN')
    }

    return grievance
  }

  // ─── Upvote (verified buyer of same project only) ─────────────────────────

  async upvote(grievanceId: string, userId: string) {
    const grievance = await this.prisma.grievance.findUnique({
      where: { id: grievanceId, isPubliclyVisible: true },
      select: { projectId: true, userId: true },
    })
    if (!grievance) throw new NotFoundException('Grievance not found')

    // Cannot upvote own grievance
    if (grievance.userId === userId) {
      throw new ForbiddenException('Cannot upvote your own grievance')
    }

    // Only verified buyers of the same project can upvote
    const link = await this.prisma.buyerProjectLink.findFirst({
      where: {
        projectId: grievance.projectId,
        buyerProfile: { userId },
        isVerified: true,
      },
    })
    if (!link) throw new ForbiddenException('NOT_VERIFIED_OWNER')

    const updated = await this.prisma.grievance.update({
      where: { id: grievanceId },
      data: { upvoteCount: { increment: 1 } },
      select: { upvoteCount: true },
    })

    return { upvoteCount: updated.upvoteCount }
  }

  // ─── Admin: Update status ──────────────────────────────────────────────────

  async updateStatus(grievanceId: string, adminId: string, dto: UpdateGrievanceStatusDto) {
    const grievance = await this.prisma.grievance.findUnique({
      where: { id: grievanceId },
      include: { user: { select: { phone: true } } },
    })
    if (!grievance) throw new NotFoundException('Grievance not found')

    const updateData: any = { status: dto.status }
    if (dto.status === 'ESCALATED' && dto.escalatedTo) {
      updateData.escalatedAt = new Date()
      updateData.escalatedTo = dto.escalatedTo
    }
    if (dto.status === 'RESOLVED') {
      updateData.resolvedAt = new Date()
    }
    if (dto.note) {
      updateData.adminNotes = dto.note
    }

    const [updated] = await this.prisma.$transaction([
      this.prisma.grievance.update({
        where: { id: grievanceId },
        data: updateData,
      }),
      this.prisma.grievanceStatusHistory.create({
        data: {
          grievanceId,
          fromStatus: grievance.status,
          toStatus: dto.status,
          changedBy: adminId,
          note: dto.note,
        },
      }),
    ])

    // Update project open grievance count when resolving/closing
    if (['RESOLVED', 'CLOSED_UNRESOLVED'].includes(dto.status) &&
        !['RESOLVED', 'CLOSED_UNRESOLVED'].includes(grievance.status)) {
      await this.prisma.project.update({
        where: { id: grievance.projectId },
        data: { openGrievances: { decrement: 1 } },
      }).catch(() => {/* non-critical */})
    }

    // Send SMS notification to buyer
    const phone = grievance.user.phone
    if (dto.status === 'ACKNOWLEDGED') {
      await this.notifications.notifyGrievanceAcknowledged(phone, grievance.referenceId)
    }

    // Log admin action
    await this.prisma.adminAction.create({
      data: {
        adminId,
        actionType: 'GRIEVANCE_STATUS_UPDATE',
        entityType: 'Grievance',
        entityId: grievanceId,
        notes: dto.note,
        metadata: { fromStatus: grievance.status, toStatus: dto.status },
      },
    })

    return updated
  }

  // ─── Admin: Get all grievances ────────────────────────────────────────────

  async adminListGrievances(filters: {
    status?: string
    severity?: string
    projectId?: string
    page: number
    limit: number
  }) {
    const where: any = {}
    if (filters.status) where.status = filters.status
    if (filters.severity) where.severity = filters.severity
    if (filters.projectId) where.projectId = filters.projectId

    const [data, total] = await Promise.all([
      this.prisma.grievance.findMany({
        where,
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
        orderBy: { createdAt: 'asc' },
        include: {
          project: { select: { id: true, slug: true, name: true } },
          user: {
            select: {
              phone: true,
              buyerProfile: { select: { displayName: true, verificationStatus: true } },
            },
          },
          evidenceFiles: { select: { id: true, fileName: true, fileType: true } },
        },
      }),
      this.prisma.grievance.count({ where }),
    ])

    return { data, meta: { total, page: filters.page, limit: filters.limit, totalPages: Math.ceil(total / filters.limit) } }
  }
}
