import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { RedisService } from '../../common/redis/redis.service'

interface FindAllOptions {
  city?: string
  locality?: string
  status?: string
  builderId?: string
  minScore?: number
  hasRedFlags?: boolean
  bhkType?: string
  priceMin?: number
  priceMax?: number
  q?: string
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async findAll(opts: FindAllOptions) {
    const { city, locality, status, builderId, minScore, hasRedFlags, bhkType, priceMin, priceMax, q, page, limit, sortBy, sortOrder = 'desc' } = opts

    const where: any = { isPublished: true }

    if (city) where.city = { equals: city, mode: 'insensitive' }
    if (locality) where.locality = { contains: locality, mode: 'insensitive' }
    if (builderId) where.builderId = builderId
    if (minScore !== undefined) where.transparencyScore = { gte: minScore }
    if (hasRedFlags) where.redFlags = { some: { isActive: true } }

    if (status) {
      const statuses = status.split(',').map((s) => s.trim().toUpperCase())
      where.status = { in: statuses }
    }

    if (bhkType) {
      where.unitTypes = { some: { bhkType: { equals: bhkType, mode: 'insensitive' } } }
    }

    if (priceMin !== undefined || priceMax !== undefined) {
      where.priceRangeLow = {}
      if (priceMin !== undefined) where.priceRangeLow.lte = priceMax
      where.priceRangeHigh = {}
      if (priceMax !== undefined) where.priceRangeHigh.gte = priceMin
    }

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { locality: { contains: q, mode: 'insensitive' } },
        { reraNumber: { contains: q, mode: 'insensitive' } },
      ]
    }

    const orderBy: any =
      sortBy === 'delay' ? { delayMonths: sortOrder }
      : sortBy === 'grievances' ? { totalGrievances: sortOrder }
      : sortBy === 'name' ? { name: sortOrder }
      : sortBy === 'reraExpiry' ? { reraExpiryDate: sortOrder }
      : { transparencyScore: sortOrder }

    const [data, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: {
          builder: { select: { name: true, slug: true, logoUrl: true } },
          unitTypes: { select: { bhkType: true, priceFrom: true, priceTo: true } },
          reraRecords: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: { reraNumber: true, status: true, currentExpiryDate: true },
          },
          redFlags: {
            where: { isActive: true },
            select: { id: true, severity: true, title: true },
          },
          _count: { select: { grievances: true, buyerLinks: true } },
        },
      }),
      this.prisma.project.count({ where }),
    ])

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    }
  }

  async findBySlug(slug: string) {
    const cacheKey = `projects:slug:${slug}`
    const cached = await this.redis.getCachedResponse<any>(cacheKey)
    if (cached) return cached

    const project = await this.prisma.project.findUnique({
      where: { slug, isPublished: true },
      include: {
        builder: {
          select: {
            id: true, slug: true, name: true, logoUrl: true,
            transparencyGrade: true, transparencyScore: true,
          },
        },
        unitTypes: true,
        timelines: { orderBy: { plannedDate: 'asc' } },
        reraRecords: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            approvals: { orderBy: { approvalType: 'asc' } },
            violations: { orderBy: { createdAt: 'desc' } },
          },
        },
        redFlags: { where: { isActive: true } },
        _count: { select: { grievances: true, buyerLinks: true } },
      },
    })

    if (!project) throw new NotFoundException(`Project '${slug}' not found`)

    await this.redis.cacheResponse(cacheKey, project, 300) // 5 min cache
    return project
  }

  async getRERA(slug: string) {
    const project = await this.prisma.project.findUnique({
      where: { slug, isPublished: true },
      select: {
        id: true, name: true, reraNumber: true,
        reraRecords: {
          include: {
            approvals: true,
            violations: { orderBy: { violationDate: 'desc' } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!project) throw new NotFoundException(`Project '${slug}' not found`)
    return project
  }

  async getGrievances(slug: string, status?: string, category?: string, page = 1, limit = 20) {
    const project = await this.prisma.project.findUnique({
      where: { slug, isPublished: true },
      select: { id: true },
    })
    if (!project) throw new NotFoundException(`Project '${slug}' not found`)

    const where: any = { projectId: project.id, isPubliclyVisible: true }
    if (status) where.status = status
    if (category) where.category = category

    const [data, total] = await Promise.all([
      this.prisma.grievance.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          referenceId: true,
          category: true,
          severity: true,
          status: true,
          title: true,
          isAnonymous: true,
          isVerifiedBuyer: true,
          upvoteCount: true,
          createdAt: true,
          // Never expose description publicly — only aggregated data
          user: {
            select: {
              buyerProfile: {
                select: {
                  displayName: true,
                  verificationStatus: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.grievance.count({ where }),
    ])

    // Mask identity for anonymous grievances
    const sanitized = data.map((g) => ({
      ...g,
      user: g.isAnonymous
        ? { buyerProfile: { displayName: 'Verified Buyer', verificationStatus: 'VERIFIED_OWNER' } }
        : g.user,
    }))

    return { data: sanitized, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  }

  async getCommunityThreads(slug: string, page = 1, limit = 20, sortBy = 'recent') {
    const project = await this.prisma.project.findUnique({
      where: { slug, isPublished: true },
      select: { communityGroup: { select: { id: true } } },
    })
    if (!project) throw new NotFoundException(`Project '${slug}' not found`)
    if (!project.communityGroup) return { data: [], meta: { total: 0, page, limit, totalPages: 0 } }

    const communityGroupId = project.communityGroup.id
    const orderBy: any = sortBy === 'popular' ? { upvoteCount: 'desc' } : [{ isPinned: 'desc' }, { createdAt: 'desc' }]

    const [data, total] = await Promise.all([
      this.prisma.thread.findMany({
        where: { communityGroupId, isVisible: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: {
          author: {
            select: {
              buyerProfile: { select: { displayName: true, verificationStatus: true } },
            },
          },
          _count: { select: { replies: true } },
        },
      }),
      this.prisma.thread.count({ where: { communityGroupId, isVisible: true } }),
    ])

    const sanitized = data.map((t) => ({
      ...t,
      author: t.isAnonymous
        ? { buyerProfile: { displayName: 'Verified Buyer', verificationStatus: 'VERIFIED_OWNER' } }
        : t.author,
    }))

    return { data: sanitized, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  }

  async getTimeline(slug: string) {
    const project = await this.prisma.project.findUnique({
      where: { slug, isPublished: true },
      select: {
        id: true, name: true, delayMonths: true,
        reraExpiryDate: true, revisedCompletionDate: true,
        timelines: { orderBy: { plannedDate: 'asc' } },
      },
    })
    if (!project) throw new NotFoundException(`Project '${slug}' not found`)
    return {
      milestones: project.timelines,
      delayMonths: project.delayMonths,
      reraExpiryDate: project.reraExpiryDate,
      revisedCompletionDate: project.revisedCompletionDate,
    }
  }

  async getAnalytics(slug: string) {
    const project = await this.prisma.project.findUnique({
      where: { slug, isPublished: true },
      select: { id: true },
    })
    if (!project) throw new NotFoundException(`Project '${slug}' not found`)

    // Grievances by category
    const grievancesByCategory = await this.prisma.grievance.groupBy({
      by: ['category'],
      where: { projectId: project.id },
      _count: { _all: true },
    })

    // Grievances trend — last 12 months
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

    const recentGrievances = await this.prisma.grievance.findMany({
      where: { projectId: project.id, createdAt: { gte: twelveMonthsAgo } },
      select: { createdAt: true },
    })

    const trendByMonth: Record<string, number> = {}
    recentGrievances.forEach((g) => {
      const key = `${g.createdAt.getFullYear()}-${String(g.createdAt.getMonth() + 1).padStart(2, '0')}`
      trendByMonth[key] = (trendByMonth[key] ?? 0) + 1
    })

    return {
      grievancesByCategory: grievancesByCategory.map((g) => ({
        category: g.category,
        count: Number(g._count._all),
      })),
      grievancesTrend: Object.entries(trendByMonth)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, count]) => ({ month, count })),
    }
  }
}
