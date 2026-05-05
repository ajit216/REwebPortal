import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { RedisService } from '../../common/redis/redis.service'

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async getMarketOverview() {
    const cacheKey = 'analytics:market-overview'
    const cached = await this.redis.getCachedResponse<any>(cacheKey)
    if (cached) return cached

    const [
      totalProjects,
      byStatus,
      byCity,
      totalGrievances,
      activeGrievances,
      avgScore,
    ] = await Promise.all([
      this.prisma.project.count({ where: { isPublished: true } }),
      this.prisma.project.groupBy({
        by: ['status'],
        where: { isPublished: true },
        _count: { _all: true },
      }),
      this.prisma.project.groupBy({
        by: ['city'],
        where: { isPublished: true },
        _count: { _all: true },
      }),
      this.prisma.grievance.count(),
      this.prisma.grievance.count({
        where: { status: { in: ['SUBMITTED', 'ACKNOWLEDGED', 'ESCALATED'] } },
      }),
      this.prisma.project.aggregate({
        where: { isPublished: true, transparencyScore: { not: null } },
        _avg: { transparencyScore: true },
      }),
    ])

    const statusMap: Record<string, number> = {}
    byStatus.forEach((s) => { statusMap[s.status] = Number(s._count._all) })

    const cityMap: Record<string, number> = {}
    byCity.forEach((c) => { cityMap[c.city] = Number(c._count._all) })

    const result = {
      totalProjects,
      byStatus: statusMap,
      byCity: cityMap,
      avgTransparencyScore: avgScore._avg.transparencyScore
        ? Math.round(avgScore._avg.transparencyScore * 10) / 10
        : null,
      totalGrievances,
      activeGrievances,
    }

    await this.redis.cacheResponse(cacheKey, result, 600)
    return result
  }

  async getDelayAnalytics(city?: string, builderId?: string, year?: number) {
    const cacheKey = `analytics:delays:${city}:${builderId}:${year}`
    const cached = await this.redis.getCachedResponse<any>(cacheKey)
    if (cached) return cached

    const where: any = { isPublished: true, delayMonths: { gt: 0 } }
    if (city) where.city = city

    const projects = await this.prisma.project.findMany({
      where,
      include: {
        builder: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { delayMonths: 'desc' },
    })

    // Avg delay by builder
    const builderDelays: Record<string, { name: string; slug: string; totalDelay: number; count: number }> = {}
    projects.forEach((p) => {
      const bid = p.builderId
      if (!builderDelays[bid]) {
        builderDelays[bid] = { name: p.builder.name, slug: p.builder.slug, totalDelay: 0, count: 0 }
      }
      builderDelays[bid].totalDelay += p.delayMonths
      builderDelays[bid].count += 1
    })

    const avgDelayByBuilder = Object.entries(builderDelays).map(([builderId, d]) => ({
      builderId,
      builderName: d.name,
      builderSlug: d.slug,
      avgDelayMonths: Math.round(d.totalDelay / d.count * 10) / 10,
    })).sort((a, b) => b.avgDelayMonths - a.avgDelayMonths)

    // Delay distribution
    const ranges = [
      { label: '0 months', min: 0, max: 0 },
      { label: '1-6 months', min: 1, max: 6 },
      { label: '7-12 months', min: 7, max: 12 },
      { label: '13-24 months', min: 13, max: 24 },
      { label: '24+ months', min: 25, max: Infinity },
    ]

    const allProjects = await this.prisma.project.findMany({
      where: { isPublished: true, ...(city ? { city } : {}) },
      select: { delayMonths: true },
    })

    const delayDistribution = ranges.map((r) => ({
      range: r.label,
      count: allProjects.filter((p) =>
        p.delayMonths >= r.min && p.delayMonths <= r.max
      ).length,
    }))

    // Worst delayed projects (top 5)
    const worstDelayed = projects.slice(0, 5).map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      builderName: p.builder.name,
      delayMonths: p.delayMonths,
      city: p.city,
      locality: p.locality,
    }))

    const result = { avgDelayByBuilder, delayDistribution, worstDelayedProjects: worstDelayed }
    await this.redis.cacheResponse(cacheKey, result, 600)
    return result
  }

  async getGrievanceAnalytics(city?: string, category?: string, year?: number) {
    const cacheKey = `analytics:grievances:${city}:${category}:${year}`
    const cached = await this.redis.getCachedResponse<any>(cacheKey)
    if (cached) return cached

    const projectWhere: any = { isPublished: true }
    if (city) projectWhere.city = city

    const publishedProjects = await this.prisma.project.findMany({
      where: projectWhere,
      select: { id: true },
    })
    const projectIds = publishedProjects.map((p) => p.id)

    const grievanceWhere: any = { projectId: { in: projectIds } }
    if (category) grievanceWhere.category = category

    const [byCategory, allGrievances] = await Promise.all([
      this.prisma.grievance.groupBy({
        by: ['category'],
        where: grievanceWhere,
        _count: { _all: true },
        orderBy: { _count: { category: 'desc' } },
      }),
      this.prisma.grievance.findMany({
        where: grievanceWhere,
        select: { createdAt: true },
      }),
    ])

    const total = byCategory.reduce((a, g) => a + Number(g._count._all), 0)
    const topCategories = byCategory.map((g) => ({
      category: g.category,
      count: Number(g._count._all),
      percentage: total > 0 ? Math.round((Number(g._count._all) / total) * 100) : 0,
    }))

    // Trend last 12 months
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

    const trendMap: Record<string, number> = {}
    allGrievances
      .filter((g) => g.createdAt >= twelveMonthsAgo)
      .forEach((g) => {
        const key = `${g.createdAt.getFullYear()}-${String(g.createdAt.getMonth() + 1).padStart(2, '0')}`
        trendMap[key] = (trendMap[key] ?? 0) + 1
      })

    const trendByMonth = Object.entries(trendMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month, count }))

    // Top projects by complaints
    const byProject = await this.prisma.grievance.groupBy({
      by: ['projectId'],
      where: grievanceWhere,
      _count: { _all: true },
      orderBy: { _count: { projectId: 'desc' } },
      take: 5,
    })

    const topProjectIds = byProject.map((g) => g.projectId)
    const topProjectData = await this.prisma.project.findMany({
      where: { id: { in: topProjectIds } },
      select: { id: true, slug: true, name: true, city: true, locality: true, totalGrievances: true },
    })

    const result = { topCategories, trendByMonth, topProjectsByComplaints: topProjectData }
    await this.redis.cacheResponse(cacheKey, result, 600)
    return result
  }

  async compareBuilders(builderIds: string[]) {
    const builders = await this.prisma.builder.findMany({
      where: { id: { in: builderIds }, isActive: true },
      include: {
        projects: {
          where: { isPublished: true },
          include: {
            reraRecords: { include: { approvals: true, violations: true }, take: 1, orderBy: { createdAt: 'desc' } },
            grievances: { select: { status: true } },
          },
        },
      },
    })

    return builders.map((b) => ({
      id: b.id,
      slug: b.slug,
      name: b.name,
      transparencyScore: b.transparencyScore,
      transparencyGrade: b.transparencyGrade,
      avgDelayMonths: b.avgDelayMonths,
      totalProjects: b.totalProjects,
      delayedProjects: b.delayedProjects,
      totalGrievances: b.totalGrievances,
    }))
  }
}
