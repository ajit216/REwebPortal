import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { RedisService } from '../../common/redis/redis.service'

interface ListBuildersOptions {
  city?: string
  transparencyGrade?: string
  q?: string
  page: number
  limit: number
  sortBy?: string
}

@Injectable()
export class BuildersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async findAll({ city, transparencyGrade, q, page, limit, sortBy }: ListBuildersOptions) {
    const cacheKey = `builders:list:${JSON.stringify({ city, transparencyGrade, q, page, limit, sortBy })}`
    const cached = await this.redis.getCachedResponse<any>(cacheKey)
    if (cached) return cached

    const where: any = { isActive: true, isPublished: true }
    if (transparencyGrade) where.transparencyGrade = transparencyGrade
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { legalEntityName: { contains: q, mode: 'insensitive' } },
      ]
    }

    const orderBy: any =
      sortBy === 'projects' ? { totalProjects: 'desc' }
      : sortBy === 'name' ? { name: 'asc' }
      : { transparencyScore: 'desc' }

    const [data, total] = await Promise.all([
      this.prisma.builder.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        select: {
          id: true,
          slug: true,
          name: true,
          logoUrl: true,
          transparencyGrade: true,
          transparencyScore: true,
          totalProjects: true,
          activeProjects: true,
          delayedProjects: true,
          avgDelayMonths: true,
          totalGrievances: true,
          headquartersCity: true,
          establishedYear: true,
        },
      }),
      this.prisma.builder.count({ where }),
    ])

    const result = { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
    await this.redis.cacheResponse(cacheKey, result, 600) // 10 min cache
    return result
  }

  async findBySlug(slug: string) {
    const cacheKey = `builders:slug:${slug}`
    const cached = await this.redis.getCachedResponse<any>(cacheKey)
    if (cached) return cached

    const builder = await this.prisma.builder.findUnique({
      where: { slug, isActive: true },
      include: {
        projects: {
          where: { isPublished: true },
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            slug: true,
            name: true,
            status: true,
            locality: true,
            city: true,
            transparencyScore: true,
            transparencyGrade: true,
            delayMonths: true,
            totalGrievances: true,
          },
        },
        documents: {
          select: { id: true, docType: true, docLabel: true, uploadedAt: true },
        },
      },
    })

    if (!builder) throw new NotFoundException(`Builder '${slug}' not found`)

    await this.redis.cacheResponse(cacheKey, builder, 3600) // 1 hour cache
    return builder
  }

  async getProjects(slug: string, status?: string, page = 1, limit = 20) {
    const builder = await this.prisma.builder.findUnique({
      where: { slug, isActive: true },
      select: { id: true },
    })
    if (!builder) throw new NotFoundException(`Builder '${slug}' not found`)

    const where: any = { builderId: builder.id, isPublished: true }
    if (status) where.status = status

    const [data, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, slug: true, name: true, status: true,
          locality: true, city: true, transparencyScore: true,
          delayMonths: true, totalGrievances: true, coverImageUrl: true,
          reraExpiryDate: true, totalUnits: true,
        },
      }),
      this.prisma.project.count({ where }),
    ])

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  }

  async getScorecard(slug: string) {
    const cacheKey = `builders:scorecard:${slug}`
    const cached = await this.redis.getCachedResponse<any>(cacheKey)
    if (cached) return cached

    const builder = await this.prisma.builder.findUnique({
      where: { slug, isActive: true },
      include: {
        projects: {
          where: { isPublished: true },
          include: {
            reraRecords: {
              include: { approvals: true, violations: true },
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
            grievances: { select: { status: true, upvoteCount: true } },
            redFlags: { where: { isActive: true }, select: { severity: true } },
          },
        },
      },
    })

    if (!builder) throw new NotFoundException(`Builder '${slug}' not found`)

    const scorecard = this.computeScorecard(builder)
    await this.redis.cacheResponse(cacheKey, scorecard, 3600)
    return scorecard
  }

  private computeScorecard(builder: any) {
    const projects = builder.projects as any[]

    if (projects.length === 0) {
      return {
        overallScore: null,
        grade: null,
        breakdown: null,
        lastUpdated: builder.scoreLastComputedAt,
        projectCount: 0,
      }
    }

    // RERA Compliance score (30%)
    const reraScores = projects.map((p) => {
      const record = p.reraRecords[0]
      if (!record) return 50
      let s = 100
      if (record.status === 'LAPSED') s -= 40
      if (record.status === 'CANCELLED') s -= 60
      if (record.violations.length > 0) s -= record.violations.length * 10
      const approvals = record.approvals.filter((a: any) => a.isObtained).length
      s += Math.min(approvals * 5, 15)
      return Math.max(0, Math.min(100, s))
    })
    const reraCompliance = Math.round(reraScores.reduce((a, b) => a + b, 0) / reraScores.length)

    // Delivery Track (25%) — based on delay months
    const avgDelay = builder.avgDelayMonths ?? 0
    const deliveryTrack = Math.max(0, Math.round(100 - Math.min(avgDelay * 4, 80)))

    // Grievance Resolution (20%)
    const allGrievances = projects.flatMap((p) => p.grievances)
    const total = allGrievances.length
    const resolved = allGrievances.filter((g: any) => g.status === 'RESOLVED').length
    const grievanceRate = total === 0 ? 80 : Math.round((resolved / total) * 100)

    // Information Disclosure (15%) — based on profile completeness
    const profileFields = ['logoUrl', 'websiteUrl', 'description', 'cinNumber', 'contactEmail']
    const filled = profileFields.filter((f) => !!builder[f]).length
    const transparency = Math.round((filled / profileFields.length) * 100)

    // Buyer Sentiment (10%) — based on upvotes vs resolved
    const totalUpvotes = allGrievances.reduce((a: number, g: any) => a + (g.upvoteCount ?? 0), 0)
    const buyerSentiment = Math.max(40, Math.min(100, 80 - Math.min(totalUpvotes / 5, 40)))

    const overallScore = Math.round(
      reraCompliance * 0.30 +
      deliveryTrack * 0.25 +
      grievanceRate * 0.20 +
      transparency * 0.15 +
      buyerSentiment * 0.10
    )

    const grade = this.scoreToGrade(overallScore)

    return {
      overallScore,
      grade,
      breakdown: {
        reraCompliance: { score: reraCompliance, weight: 0.30, label: 'RERA Compliance' },
        deliveryTrack: { score: deliveryTrack, weight: 0.25, label: 'On-time Delivery' },
        grievanceRate: { score: grievanceRate, weight: 0.20, label: 'Grievance Resolution' },
        transparency: { score: transparency, weight: 0.15, label: 'Information Disclosure' },
        buyerSentiment: { score: Math.round(buyerSentiment), weight: 0.10, label: 'Buyer Sentiment' },
      },
      lastUpdated: builder.scoreLastComputedAt ?? new Date(),
    }
  }

  private scoreToGrade(score: number): string {
    if (score >= 90) return 'A_PLUS'
    if (score >= 80) return 'A'
    if (score >= 65) return 'B'
    if (score >= 50) return 'C'
    return 'D'
  }
}
