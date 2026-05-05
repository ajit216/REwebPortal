import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPlatformStats() {
    const [projectStats, grievanceStats, buyerStats] = await Promise.all([
      this.prisma.project.groupBy({
        by: ['status'],
        where: { isPublished: true },
        _count: { _all: true },
      }),
      this.prisma.grievance.aggregate({
        _count: { _all: true },
        where: { status: { in: ['SUBMITTED', 'ACKNOWLEDGED', 'ESCALATED'] } },
      }),
      this.prisma.buyerProfile.count({
        where: { verificationStatus: 'VERIFIED_OWNER' },
      }),
    ])

    const byStatus = projectStats.reduce((acc, g) => {
      acc[g.status] = Number(g._count._all)
      return acc
    }, {} as Record<string, number>)

    const totalProjects = projectStats.reduce((a, g) => a + Number(g._count._all), 0)

    const allScores = await this.prisma.project.findMany({
      where: { isPublished: true, transparencyScore: { not: null } },
      select: { transparencyScore: true },
    })
    const avgScore =
      allScores.length > 0
        ? Math.round(
            allScores.reduce((a, p) => a + (p.transparencyScore ?? 0), 0) / allScores.length,
          )
        : 0

    const totalGrievances = await this.prisma.grievance.count()

    return {
      totalProjects,
      byStatus,
      avgTransparencyScore: avgScore,
      totalGrievances,
      activeGrievances: Number(grievanceStats._count._all),
      verifiedBuyers: buyerStats,
    }
  }

  async getDelaysByBuilder() {
    const builders = await this.prisma.builder.findMany({
      include: {
        projects: {
          where: { isPublished: true },
          select: { delayMonths: true, status: true },
        },
      },
    })

    return builders
      .map((b) => {
        const projects = b.projects
        const delayed = projects.filter((p) =>
          ['DELAYED', 'STALLED'].includes(p.status),
        ).length
        const avgDelay =
          projects.length > 0
            ? Math.round(
                projects.reduce((a, p) => a + (p.delayMonths ?? 0), 0) / projects.length,
              )
            : 0
        return {
          builderId: b.id,
          builderName: b.name,
          totalProjects: projects.length,
          delayedProjects: delayed,
          avgDelayMonths: avgDelay,
        }
      })
      .sort((a, b) => b.avgDelayMonths - a.avgDelayMonths)
  }

  async getGrievanceTrends(months = 12) {
    const since = new Date()
    since.setMonth(since.getMonth() - months)

    const grievances = await this.prisma.grievance.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true, category: true, status: true },
      orderBy: { createdAt: 'asc' },
    })

    // Group by month
    const byMonth: Record<string, { total: number; byCategory: Record<string, number> }> = {}
    grievances.forEach((g) => {
      const key = g.createdAt.toISOString().slice(0, 7) // YYYY-MM
      if (!byMonth[key]) byMonth[key] = { total: 0, byCategory: {} }
      byMonth[key].total += 1
      byMonth[key].byCategory[g.category] = (byMonth[key].byCategory[g.category] ?? 0) + 1
    })

    return Object.entries(byMonth).map(([month, data]) => ({ month, ...data }))
  }

  async getScoreDistribution() {
    const projects = await this.prisma.project.findMany({
      where: { isPublished: true, transparencyGrade: { not: null } },
      select: { transparencyGrade: true, city: true },
    })

    const byGrade = projects.reduce((acc, p) => {
      const g = p.transparencyGrade ?? 'UNKNOWN'
      acc[g] = (acc[g] ?? 0) + 1
      return acc
    }, {} as Record<string, number>)

    return { byGrade, total: projects.length }
  }
}
