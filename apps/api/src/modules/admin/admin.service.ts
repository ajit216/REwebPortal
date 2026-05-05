import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { RedisService } from '../../common/redis/redis.service'
import { NotificationsService, SmsTemplate } from '../notifications/notifications.service'
import {
  CreateProjectDto,
  UpdateProjectDto,
  CreateBuilderDto,
  UpdateBuilderDto,
  CreateRedFlagDto,
} from './dto/admin.dto'

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly notifications: NotificationsService,
  ) {}

  // ─── Dashboard stats ──────────────────────────────────────────────────────

  async getDashboardStats() {
    const [
      totalUsers,
      verifiedBuyers,
      totalGrievances,
      unacknowledgedGrievances,
      pendingVerifications,
      projectsTotal,
      projectsPublished,
      activeRedFlags,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.buyerProfile.count({ where: { verificationStatus: 'VERIFIED_OWNER' } }),
      this.prisma.grievance.count(),
      this.prisma.grievance.count({ where: { status: 'SUBMITTED' } }),
      this.prisma.buyerProjectLink.count({ where: { isVerified: false } }),
      this.prisma.project.count(),
      this.prisma.project.count({ where: { isPublished: true } }),
      this.prisma.projectRedFlag.count({ where: { isActive: true } }),
    ])

    return {
      users: { total: totalUsers, verifiedBuyers },
      grievances: { total: totalGrievances, unacknowledged: unacknowledgedGrievances },
      verification: { pending: pendingVerifications },
      projects: { total: projectsTotal, published: projectsPublished },
      activeRedFlags,
    }
  }

  // ─── Project management ───────────────────────────────────────────────────

  async listProjects(page = 1, limit = 20, filters: {
    city?: string
    builderId?: string
    status?: string
    isPublished?: boolean
    hasRedFlags?: boolean
  } = {}) {
    const where: any = {}
    if (filters.city) where.city = filters.city
    if (filters.builderId) where.builderId = filters.builderId
    if (filters.status) where.status = filters.status
    if (filters.isPublished !== undefined) where.isPublished = filters.isPublished
    if (filters.hasRedFlags) where.redFlags = { some: { isActive: true } }

    const [data, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          builder: { select: { name: true, slug: true } },
          reraRecords: {
            orderBy: { updatedAt: 'desc' },
            take: 1,
            select: { status: true, lastSyncedAt: true },
          },
          _count: { select: { redFlags: true, grievances: true } },
        },
      }),
      this.prisma.project.count({ where }),
    ])

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  }

  async createProject(adminId: string, dto: CreateProjectDto) {
    const project = await this.prisma.project.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        builderId: dto.builderId,
        reraNumber: dto.reraNumber,
        status: dto.status ?? 'UNDER_CONSTRUCTION',
        city: dto.city,
        locality: dto.locality,
        subLocality: dto.subLocality,
        pincode: dto.pincode ?? '',
        latitude: dto.latitude,
        longitude: dto.longitude,
        description: dto.description,
        totalUnits: dto.totalUnits ?? 0,
        amenities: dto.amenities ?? [],
        reraRegistrationDate: dto.reraRegistrationDate ? new Date(dto.reraRegistrationDate) : undefined,
        reraExpiryDate: dto.reraExpiryDate ? new Date(dto.reraExpiryDate) : undefined,
        approxPricePerSqFt: dto.approxPricePerSqFt,
        priceRangeLow: dto.priceRangeLow,
        priceRangeHigh: dto.priceRangeHigh,
        isPublished: false,
      },
    })

    await this.logAdminAction(adminId, 'PROJECT_CREATED', 'Project', project.id)
    return project
  }

  async updateProject(adminId: string, projectId: string, dto: UpdateProjectDto) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } })
    if (!project) throw new NotFoundException('Project not found')

    const updateData: any = {}
    const logs: Array<{ field: string; oldValue: string; newValue: string }> = []

    for (const [key, value] of Object.entries(dto)) {
      if (value !== undefined && (project as any)[key] !== value) {
        logs.push({ field: key, oldValue: String((project as any)[key] ?? ''), newValue: String(value) })
        if (key === 'revisedCompletionDate' || key === 'actualCompletionDate') {
          updateData[key] = new Date(value as string)
        } else {
          updateData[key] = value
        }
      }
    }

    const updated = await this.prisma.project.update({
      where: { id: projectId },
      data: updateData,
    })

    // Create update logs
    await Promise.all(
      logs.map((log) =>
        this.prisma.projectUpdateLog.create({
          data: { projectId, updatedBy: adminId, field: log.field, oldValue: log.oldValue, newValue: log.newValue },
        })
      )
    )

    await this.logAdminAction(adminId, 'PROJECT_UPDATED', 'Project', projectId, { fields: logs.map((l) => l.field) })
    await this.redis.invalidateCache(`projects:slug:${project.slug}`)

    return updated
  }

  async publishProject(adminId: string, projectId: string) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } })
    if (!project) throw new NotFoundException('Project not found')

    const updated = await this.prisma.project.update({
      where: { id: projectId },
      data: { isPublished: true },
    })

    await this.logAdminAction(adminId, 'PROJECT_PUBLISHED', 'Project', projectId)
    await this.redis.invalidateCache(`projects:slug:${project.slug}`)

    return updated
  }

  async deleteProject(adminId: string, projectId: string) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } })
    if (!project) throw new NotFoundException('Project not found')

    // Soft delete — mark as unpublished
    await this.prisma.project.update({
      where: { id: projectId },
      data: { isPublished: false },
    })

    await this.logAdminAction(adminId, 'PROJECT_DELETED', 'Project', projectId)
    await this.redis.invalidateCache(`projects:slug:${project.slug}`)

    return { deleted: true }
  }

  // ─── Builder management ───────────────────────────────────────────────────

  async listBuilders(page = 1, limit = 20) {
    const [data, total] = await Promise.all([
      this.prisma.builder.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.builder.count(),
    ])
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  }

  async createBuilder(adminId: string, dto: CreateBuilderDto) {
    const builder = await this.prisma.builder.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        legalEntityName: dto.legalEntityName,
        cinNumber: dto.cinNumber,
        establishedYear: dto.establishedYear,
        headquartersCity: dto.headquartersCity ?? 'Mumbai',
        websiteUrl: dto.websiteUrl,
        description: dto.description,
        isPublished: false,
      },
    })

    await this.logAdminAction(adminId, 'BUILDER_CREATED', 'Builder', builder.id)
    return builder
  }

  async updateBuilder(adminId: string, builderId: string, dto: UpdateBuilderDto) {
    const builder = await this.prisma.builder.findUnique({ where: { id: builderId } })
    if (!builder) throw new NotFoundException('Builder not found')

    const updated = await this.prisma.builder.update({
      where: { id: builderId },
      data: dto,
    })

    await this.logAdminAction(adminId, 'BUILDER_UPDATED', 'Builder', builderId)
    await this.redis.invalidateCache(`builders:slug:${builder.slug}`)
    await this.redis.invalidateCache(`builders:scorecard:${builder.slug}`)

    return updated
  }

  // ─── Red Flag management ──────────────────────────────────────────────────

  async createRedFlag(adminId: string, projectId: string, dto: CreateRedFlagDto) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } })
    if (!project) throw new NotFoundException('Project not found')

    const flag = await this.prisma.projectRedFlag.create({
      data: {
        projectId,
        flagType: dto.flagType,
        severity: dto.severity,
        title: dto.title,
        description: dto.description,
        isActive: true,
      },
    })

    await this.logAdminAction(adminId, 'RED_FLAG_CREATED', 'Project', projectId, {
      flagType: dto.flagType,
      severity: dto.severity,
    })
    await this.redis.invalidateCache(`projects:slug:${project.slug}`)

    // Notify verified buyers of this project
    await this.notifyProjectBuyers(projectId, project.name)

    return flag
  }

  async resolveRedFlag(adminId: string, projectId: string, flagId: string, resolutionNote: string) {
    const flag = await this.prisma.projectRedFlag.findUnique({
      where: { id: flagId },
      include: { project: { select: { slug: true } } },
    })
    if (!flag || flag.projectId !== projectId) throw new NotFoundException('Red flag not found')

    const updated = await this.prisma.projectRedFlag.update({
      where: { id: flagId },
      data: { isActive: false, resolvedAt: new Date(), resolvedBy: adminId, resolutionNote },
    })

    await this.logAdminAction(adminId, 'RED_FLAG_RESOLVED', 'Project', projectId, { flagId })
    await this.redis.invalidateCache(`projects:slug:${flag.project.slug}`)

    return updated
  }

  // ─── Buyer verification queue ─────────────────────────────────────────────

  async getVerificationQueue(page = 1, limit = 20) {
    const [data, total] = await Promise.all([
      this.prisma.buyerProjectLink.findMany({
        where: { isVerified: false },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { linkedAt: 'asc' },
        include: {
          buyerProfile: {
            include: { user: { select: { phone: true } } },
          },
          project: { select: { id: true, slug: true, name: true, city: true } },
        },
      }),
      this.prisma.buyerProjectLink.count({ where: { isVerified: false } }),
    ])

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  }

  async approveVerification(adminId: string, linkId: string) {
    const link = await this.prisma.buyerProjectLink.findUnique({
      where: { id: linkId },
      include: {
        buyerProfile: {
          include: { user: { select: { id: true, phone: true } } },
          select: { userId: true, user: true },
        },
        project: { select: { name: true } },
      },
    })
    if (!link) throw new NotFoundException('Verification request not found')

    await this.prisma.$transaction([
      this.prisma.buyerProjectLink.update({
        where: { id: linkId },
        data: { isVerified: true },
      }),
      this.prisma.buyerProfile.update({
        where: { id: link.buyerProfileId },
        data: {
          verificationStatus: 'VERIFIED_OWNER',
          verifiedAt: new Date(),
          verifiedByAdminId: adminId,
        },
      }),
      this.prisma.project.update({
        where: { id: link.projectId },
        data: { verifiedBuyerCount: { increment: 1 } },
      }),
    ])

    // Notify buyer
    const phone = link.buyerProfile.user.phone
    await this.notifications.notifyVerificationApproved(phone, link.project.name)

    await this.logAdminAction(adminId, 'VERIFICATION_APPROVED', 'BuyerProjectLink', linkId)

    return { approved: true }
  }

  async rejectVerification(adminId: string, linkId: string, reason: string) {
    const link = await this.prisma.buyerProjectLink.findUnique({
      where: { id: linkId },
      include: {
        buyerProfile: { include: { user: { select: { phone: true } } } },
        project: { select: { name: true } },
      },
    })
    if (!link) throw new NotFoundException('Verification request not found')

    await this.prisma.buyerProfile.update({
      where: { id: link.buyerProfileId },
      data: { verificationStatus: 'UNVERIFIED' },
    })

    await this.logAdminAction(adminId, 'VERIFICATION_REJECTED', 'BuyerProjectLink', linkId, { reason })

    return { rejected: true, reason }
  }

  // ─── Moderation ────────────────────────────────────────────────────────────

  async getModerationQueue(page = 1, limit = 20) {
    // Return threads and replies that are flagged (reported by users)
    // In this implementation, we return recently hidden content for review
    const [threads, replies] = await Promise.all([
      this.prisma.thread.findMany({
        where: { isVisible: false },
        take: limit / 2,
        orderBy: { updatedAt: 'desc' },
        include: {
          author: { select: { buyerProfile: { select: { displayName: true } } } },
          communityGroup: { include: { project: { select: { name: true } } } },
        },
      }),
      this.prisma.reply.findMany({
        where: { isVisible: false },
        take: limit / 2,
        orderBy: { updatedAt: 'desc' },
        include: {
          author: { select: { buyerProfile: { select: { displayName: true } } } },
          thread: { select: { title: true } },
        },
      }),
    ])

    return {
      data: {
        threads: threads.map((t) => ({ ...t, contentType: 'thread' })),
        replies: replies.map((r) => ({ ...r, contentType: 'reply' })),
      },
    }
  }

  async hideThread(adminId: string, threadId: string) {
    await this.prisma.thread.update({ where: { id: threadId }, data: { isVisible: false } })
    await this.logAdminAction(adminId, 'THREAD_HIDDEN', 'Thread', threadId)
    return { hidden: true }
  }

  async hideReply(adminId: string, replyId: string) {
    await this.prisma.reply.update({ where: { id: replyId }, data: { isVisible: false } })
    await this.logAdminAction(adminId, 'REPLY_HIDDEN', 'Reply', replyId)
    return { hidden: true }
  }

  // ─── Audit log ────────────────────────────────────────────────────────────

  async getAuditLog(page = 1, limit = 50, filters: {
    adminId?: string
    actionType?: string
    entityType?: string
  } = {}) {
    const where: any = {}
    if (filters.adminId) where.adminId = filters.adminId
    if (filters.actionType) where.actionType = filters.actionType
    if (filters.entityType) where.entityType = filters.entityType

    const [data, total] = await Promise.all([
      this.prisma.adminAction.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { performedAt: 'desc' },
        include: { admin: { select: { email: true, role: true } } },
      }),
      this.prisma.adminAction.count({ where }),
    ])

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  }

  // ─── Private helpers ───────────────────────────────────────────────────────

  private async logAdminAction(
    adminId: string,
    actionType: string,
    entityType: string,
    entityId: string,
    metadata?: Record<string, any>,
  ) {
    await this.prisma.adminAction.create({
      data: { adminId, actionType, entityType, entityId, metadata: metadata ?? null },
    })
  }

  private async notifyProjectBuyers(projectId: string, projectName: string) {
    const verifiedBuyers = await this.prisma.buyerProjectLink.findMany({
      where: { projectId, isVerified: true },
      include: { buyerProfile: { include: { user: { select: { phone: true } } } } },
    })

    await Promise.allSettled(
      verifiedBuyers.map((link) =>
        this.notifications.notifyRedFlag(link.buyerProfile.user.phone, projectName)
      )
    )
  }
}
