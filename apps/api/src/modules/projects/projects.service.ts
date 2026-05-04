import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

interface FindAllOptions {
  city?: string
  status?: string
  q?: string
  builderId?: string
  page: number
  limit: number
}

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({ city, status, q, builderId, page, limit }: FindAllOptions) {
    const where: any = { isPublished: true }

    if (city) where.city = { equals: city, mode: 'insensitive' }
    if (builderId) where.builderId = builderId
    if (status) {
      const statuses = status.split(',').map((s) => s.trim())
      where.status = { in: statuses }
    }
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { locality: { contains: q, mode: 'insensitive' } },
        { reraRecords: { some: { reraNumber: { contains: q } } } },
      ]
    }

    const [data, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          builder: { select: { name: true, slug: true } },
          units: true,
          reraRecords: { select: { reraNumber: true, status: true, currentDeadline: true } },
          redFlags: { where: { isActive: true }, select: { id: true, severity: true, title: true } },
          _count: { select: { grievances: true, buyerLinks: true } },
        },
        orderBy: { transparencyScore: 'asc' },
      }),
      this.prisma.project.count({ where }),
    ])

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    }
  }

  async findBySlug(slug: string) {
    const project = await this.prisma.project.findUnique({
      where: { slug },
      include: {
        builder: true,
        units: true,
        timelines: { orderBy: { plannedDate: 'asc' } },
        reraRecords: { include: { approvals: true, violations: true } },
        communityGroup: {
          include: {
            threads: {
              where: { isDeleted: false },
              orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
              take: 10,
              include: {
                author: { select: { buyerProfile: { select: { displayName: true, verificationStatus: true } } } },
                _count: { select: { replies: true } },
              },
            },
          },
        },
        redFlags: { where: { isActive: true } },
        _count: { select: { grievances: true, buyerLinks: true } },
      },
    })

    if (!project) throw new NotFoundException(`Project '${slug}' not found`)

    return project
  }
}
