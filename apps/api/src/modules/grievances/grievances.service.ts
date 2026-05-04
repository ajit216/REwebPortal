import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class GrievancesService {
  constructor(private readonly prisma: PrismaService) {}

  async getProjectSummary(projectId: string) {
    const grievances = await this.prisma.grievance.groupBy({
      by: ['category', 'status'],
      where: { projectId },
      _count: { _all: true },
    })

    const total = grievances.reduce((acc, g) => acc + Number(g._count._all), 0)
    const open = grievances
      .filter((g) => ['SUBMITTED', 'ACKNOWLEDGED', 'ESCALATED'].includes(g.status))
      .reduce((acc, g) => acc + Number(g._count._all), 0)

    const byCategory = grievances.reduce((acc, g) => {
      if (!acc[g.category]) acc[g.category] = 0
      acc[g.category] += Number(g._count._all)
      return acc
    }, {} as Record<string, number>)

    return {
      total,
      open,
      byCategory: Object.entries(byCategory).map(([category, count]) => ({
        category,
        count: Number(count),
        percentage: total > 0 ? Math.round((Number(count) / total) * 100) : 0,
      })),
    }
  }

  async create(data: any) {
    // In production: validate JWT, get userId, validate ownership, store grievance
    return { message: 'Grievance submission endpoint — authentication required', data }
  }
}
