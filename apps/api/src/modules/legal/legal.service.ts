import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class LegalService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllResources(category?: string) {
    const where: any = {}
    if (category) where.category = category

    return this.prisma.legalResource.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        category: true,
        readingTimeMinutes: true,
        publishedAt: true,
      },
    })
  }

  async findResourceBySlug(slug: string) {
    const resource = await this.prisma.legalResource.findUnique({ where: { slug } })
    if (!resource) throw new NotFoundException(`Legal resource '${slug}' not found`)
    return resource
  }

  async findAllExperts() {
    return this.prisma.legalExpert.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    })
  }
}
