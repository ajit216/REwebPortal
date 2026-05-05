import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class BuildersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(q?: string) {
    const where: any = {}
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { slug: { contains: q, mode: 'insensitive' } },
      ]
    }

    return this.prisma.builder.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { projects: true } },
      },
    })
  }

  async findBySlug(slug: string) {
    const builder = await this.prisma.builder.findUnique({
      where: { slug },
      include: {
        projects: {
          where: { isPublished: true },
          select: {
            id: true,
            slug: true,
            name: true,
            locality: true,
            city: true,
            status: true,
            transparencyScore: true,
            transparencyGrade: true,
            delayMonths: true,
            openGrievances: true,
            redFlagCount: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: { select: { projects: true } },
      },
    })

    if (!builder) throw new NotFoundException(`Builder '${slug}' not found`)
    return builder
  }

  async getScorecard(slug: string) {
    const builder = await this.prisma.builder.findUnique({
      where: { slug },
      select: { id: true, name: true, transparencyScore: true, transparencyGrade: true },
    })
    if (!builder) throw new NotFoundException(`Builder '${slug}' not found`)

    // Aggregate metrics from projects
    const projects = await this.prisma.project.findMany({
      where: { builderId: builder.id, isPublished: true },
      select: {
        status: true,
        delayMonths: true,
        openGrievances: true,
        totalUnits: true,
        transparencyScore: true,
        reraRecords: { select: { status: true, violations: true } },
      },
    })

    const total = projects.length
    const delayed = projects.filter((p) => ['DELAYED', 'STALLED'].includes(p.status)).length
    const avgDelay =
      total > 0
        ? Math.round(projects.reduce((a, p) => a + (p.delayMonths ?? 0), 0) / total)
        : 0
    const totalGrievances = projects.reduce((a, p) => a + (p.openGrievances ?? 0), 0)
    const reraActive = projects.filter((p) =>
      p.reraRecords.some((r) => ['REGISTERED', 'EXTENDED'].includes(r.status)),
    ).length

    return {
      builderId: builder.id,
      builderName: builder.name,
      overallScore: builder.transparencyScore,
      grade: builder.transparencyGrade,
      stats: {
        totalProjects: total,
        delayedProjects: delayed,
        avgDelayMonths: avgDelay,
        totalGrievances,
        reraActiveCount: reraActive,
        reraCompliancePct: total > 0 ? Math.round((reraActive / total) * 100) : 0,
      },
      lastUpdated: new Date().toISOString(),
    }
  }
}
