import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class LegalService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllResources(category?: string, page = 1, limit = 20) {
    const where: any = { isPublished: true }
    if (category) where.category = category

    const [data, total] = await Promise.all([
      this.prisma.legalResource.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        select: {
          id: true, slug: true, title: true, category: true,
          summary: true, tags: true, readTimeMin: true,
          authorName: true, reviewedBy: true, publishedAt: true,
        },
      }),
      this.prisma.legalResource.count({ where }),
    ])

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  }

  async findResourceBySlug(slug: string) {
    const resource = await this.prisma.legalResource.findUnique({
      where: { slug, isPublished: true },
    })
    if (!resource) throw new NotFoundException(`Legal resource '${slug}' not found`)
    return resource
  }

  async findAllExperts(city?: string, offersProBono?: boolean, page = 1, limit = 20) {
    const where: any = { isActive: true }
    if (city) where.city = { contains: city, mode: 'insensitive' }
    if (offersProBono !== undefined) where.offersProBono = offersProBono

    const [data, total] = await Promise.all([
      this.prisma.legalExpert.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: 'asc' },
        select: {
          id: true, name: true, specialization: true, city: true,
          profileSummary: true, offersProBono: true, websiteUrl: true,
          // contactPhone not exposed publicly — buyers contact via platform
        },
      }),
      this.prisma.legalExpert.count({ where }),
    ])

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  }
}
