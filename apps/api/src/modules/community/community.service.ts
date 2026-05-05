import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { NotificationsService, SmsTemplate } from '../notifications/notifications.service'
import { CreateThreadDto, CreateReplyDto } from './dto/community.dto'

@Injectable()
export class CommunityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  async getGroup(projectId: string) {
    const group = await this.prisma.communityGroup.findUnique({
      where: { projectId },
      select: {
        id: true,
        projectId: true,
        name: true,
        status: true,
        memberCount: true,
        description: true,
        hasWhatsAppGroup: true,
        whatsAppAdminNote: true,
        createdAt: true,
      },
    })
    if (!group) throw new NotFoundException('Community group not found for this project')
    return group
  }

  async getThreads(projectId: string, page = 1, limit = 20, sortBy = 'recent') {
    const group = await this.prisma.communityGroup.findUnique({
      where: { projectId },
      select: { id: true },
    })
    if (!group) throw new NotFoundException('Community group not found for this project')

    const orderBy: any =
      sortBy === 'popular'
        ? { upvoteCount: 'desc' }
        : [{ isPinned: 'desc' }, { createdAt: 'desc' }]

    const [data, total] = await Promise.all([
      this.prisma.thread.findMany({
        where: { communityGroupId: group.id, isVisible: true },
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
      this.prisma.thread.count({ where: { communityGroupId: group.id, isVisible: true } }),
    ])

    const sanitized = data.map((t) => ({
      ...t,
      author: t.isAnonymous
        ? { buyerProfile: { displayName: 'Verified Buyer', verificationStatus: 'VERIFIED_OWNER' } }
        : t.author,
    }))

    return { data: sanitized, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  }

  async createThread(userId: string, dto: CreateThreadDto) {
    const group = await this.prisma.communityGroup.findUnique({
      where: { id: dto.communityGroupId },
      select: { id: true, status: true },
    })
    if (!group || group.status !== 'ACTIVE') throw new NotFoundException('Community group not found or inactive')

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        buyerProfile: {
          include: {
            projectLinks: {
              where: { isVerified: true },
              select: { id: true },
            },
          },
        },
      },
    })
    const isVerifiedBuyer = (user?.buyerProfile?.projectLinks?.length ?? 0) > 0

    const thread = await this.prisma.thread.create({
      data: {
        communityGroupId: dto.communityGroupId,
        authorId: userId,
        title: dto.title,
        body: dto.body,
        isAnonymous: dto.isAnonymous ?? false,
        isVerifiedBuyer,
      },
      include: {
        author: {
          select: {
            buyerProfile: { select: { displayName: true, verificationStatus: true } },
          },
        },
      },
    })

    return {
      ...thread,
      author: thread.isAnonymous
        ? { buyerProfile: { displayName: 'Verified Buyer', verificationStatus: 'VERIFIED_OWNER' } }
        : thread.author,
    }
  }

  async getThread(threadId: string, page = 1, limit = 50) {
    const thread = await this.prisma.thread.findUnique({
      where: { id: threadId, isVisible: true },
      include: {
        author: {
          select: {
            buyerProfile: { select: { displayName: true, verificationStatus: true } },
          },
        },
        replies: {
          where: { isVisible: true, parentReplyId: null },
          orderBy: { createdAt: 'asc' },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            author: {
              select: {
                buyerProfile: { select: { displayName: true, verificationStatus: true } },
              },
            },
            nestedReplies: {
              where: { isVisible: true },
              orderBy: { createdAt: 'asc' },
              include: {
                author: {
                  select: {
                    buyerProfile: { select: { displayName: true, verificationStatus: true } },
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!thread) throw new NotFoundException('Thread not found')

    const sanitizeAuthor = (t: any) => ({
      ...t,
      author: t.isAnonymous
        ? { buyerProfile: { displayName: 'Verified Buyer', verificationStatus: 'VERIFIED_OWNER' } }
        : t.author,
    })

    return {
      ...sanitizeAuthor(thread),
      replies: thread.replies.map((r) => ({
        ...sanitizeAuthor(r),
        nestedReplies: r.nestedReplies.map(sanitizeAuthor),
      })),
    }
  }

  async createReply(threadId: string, userId: string, dto: CreateReplyDto) {
    const thread = await this.prisma.thread.findUnique({
      where: { id: threadId, isVisible: true },
      select: { id: true, isLocked: true, communityGroupId: true },
    })
    if (!thread) throw new NotFoundException('Thread not found')
    if (thread.isLocked) throw new ForbiddenException('Thread is locked')

    if (dto.parentReplyId) {
      const parentReply = await this.prisma.reply.findUnique({
        where: { id: dto.parentReplyId },
        select: { threadId: true, parentReplyId: true },
      })
      if (!parentReply || parentReply.threadId !== threadId) {
        throw new NotFoundException('Parent reply not found')
      }
      // Only 1 level of nesting allowed
      if (parentReply.parentReplyId) {
        dto.parentReplyId = parentReply.parentReplyId
      }
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        buyerProfile: {
          include: {
            projectLinks: { where: { isVerified: true }, select: { id: true } },
          },
        },
      },
    })
    const isVerifiedBuyer = (user?.buyerProfile?.projectLinks?.length ?? 0) > 0

    const [reply] = await this.prisma.$transaction([
      this.prisma.reply.create({
        data: {
          threadId,
          authorId: userId,
          body: dto.body,
          parentReplyId: dto.parentReplyId ?? null,
          isAnonymous: dto.isAnonymous ?? false,
          isVerifiedBuyer,
        },
      }),
      this.prisma.thread.update({
        where: { id: threadId },
        data: { replyCount: { increment: 1 } },
      }),
    ])

    return reply
  }

  async upvoteThread(threadId: string, userId: string) {
    const thread = await this.prisma.thread.findUnique({
      where: { id: threadId, isVisible: true },
      select: { authorId: true },
    })
    if (!thread) throw new NotFoundException('Thread not found')

    const updated = await this.prisma.thread.update({
      where: { id: threadId },
      data: { upvoteCount: { increment: 1 } },
      select: { upvoteCount: true },
    })

    return { upvoteCount: updated.upvoteCount }
  }

  async requestWhatsApp(projectId: string, userId: string) {
    // Verify user is a verified buyer of this project
    const link = await this.prisma.buyerProjectLink.findFirst({
      where: {
        projectId,
        buyerProfile: { userId },
        isVerified: true,
      },
    })
    if (!link) throw new ForbiddenException('NOT_VERIFIED_OWNER')

    const group = await this.prisma.communityGroup.findUnique({
      where: { projectId },
      include: {
        project: { select: { name: true } },
      },
    })
    if (!group) throw new NotFoundException('Community group not found')
    if (!group.hasWhatsAppGroup) {
      return {
        message: 'No WhatsApp group exists for this project yet. Check back later.',
        hasWhatsAppGroup: false,
      }
    }

    // Get user phone for notification
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { phone: true },
    })

    // Send confirmation SMS to buyer
    if (user?.phone) {
      await this.notifications.sendSMS({
        to: user.phone,
        templateKey: SmsTemplate.WHATSAPP_JOIN_REQUEST,
        variables: { project: group.project.name },
      })
    }

    return {
      message: 'Your request has been noted. The group admin will contact you on your registered number within 24 hours.',
      hasWhatsAppGroup: true,
    }
  }
}
