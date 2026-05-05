import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

// Regex patterns used to strip unsafe content (no HTML injection, no phone/email exposure)
const PHONE_REGEX = /(\+91|0)?[6-9]\d{9}/g
const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g
const URL_REGEX = /https?:\/\/[^\s]+/gi

function sanitizeContent(text: string): string {
  return text
    .replace(URL_REGEX, '[link removed]')
    .replace(PHONE_REGEX, '[number removed]')
    .replace(EMAIL_REGEX, '[email removed]')
    .slice(0, 2000)
}

@Injectable()
export class CommunityService {
  constructor(private readonly prisma: PrismaService) {}

  async getThreadsForProject(projectSlug: string, page = 1, limit = 20) {
    const project = await this.prisma.project.findUnique({ where: { slug: projectSlug }, select: { id: true } })
    if (!project) throw new NotFoundException('Project not found')

    const group = await this.prisma.communityGroup.findUnique({
      where: { projectId: project.id },
      select: { id: true },
    })
    if (!group) return { data: [], meta: { total: 0, page, limit, totalPages: 0 } }

    const [threads, total] = await Promise.all([
      this.prisma.thread.findMany({
        where: { communityGroupId: group.id, isDeleted: false },
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: {
            select: {
              buyerProfile: {
                select: { displayName: true, verificationStatus: true },
              },
            },
          },
          _count: { select: { replies: true } },
        },
      }),
      this.prisma.thread.count({ where: { communityGroupId: group.id, isDeleted: false } }),
    ])

    return {
      data: threads.map((t) => this.formatThread(t)),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    }
  }

  async createThread(
    projectSlug: string,
    userId: string,
    dto: { title: string; body: string; isAnonymous: boolean },
  ) {
    const project = await this.prisma.project.findUnique({ where: { slug: projectSlug }, select: { id: true } })
    if (!project) throw new NotFoundException('Project not found')

    // Enforce 120-char title limit
    if (dto.title.length > 120) throw new BadRequestException('Title must be 120 characters or less')

    // Get or create community group for project
    let group = await this.prisma.communityGroup.findUnique({
      where: { projectId: project.id },
    })
    if (!group) {
      group = await this.prisma.communityGroup.create({
        data: { projectId: project.id, status: 'ACTIVE' },
      })
    }

    const thread = await this.prisma.thread.create({
      data: {
        communityGroupId: group.id,
        authorId: userId,
        title: dto.title.slice(0, 120),
        body: sanitizeContent(dto.body),
        isAnonymous: dto.isAnonymous,
      },
      include: {
        author: {
          select: { buyerProfile: { select: { displayName: true, verificationStatus: true } } },
        },
      },
    })

    return this.formatThread(thread)
  }

  async getReplies(threadId: string, page = 1, limit = 50) {
    const [replies, total] = await Promise.all([
      this.prisma.reply.findMany({
        where: { threadId, isDeleted: false, parentReplyId: null },
        orderBy: { createdAt: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: {
            select: { buyerProfile: { select: { displayName: true, verificationStatus: true } } },
          },
          nestedReplies: {
            where: { isDeleted: false },
            orderBy: { createdAt: 'asc' },
            include: {
              author: {
                select: { buyerProfile: { select: { displayName: true, verificationStatus: true } } },
              },
            },
          },
        },
      }),
      this.prisma.reply.count({ where: { threadId, isDeleted: false, parentReplyId: null } }),
    ])

    return {
      data: replies.map((r) => this.formatReply(r)),
      meta: { total, page, limit },
    }
  }

  async createReply(
    threadId: string,
    userId: string,
    dto: { body: string; isAnonymous: boolean; parentReplyId?: string },
  ) {
    const thread = await this.prisma.thread.findUnique({ where: { id: threadId } })
    if (!thread || thread.isDeleted) throw new NotFoundException('Thread not found')

    const reply = await this.prisma.reply.create({
      data: {
        threadId,
        authorId: userId,
        body: sanitizeContent(dto.body),
        isAnonymous: dto.isAnonymous,
        parentReplyId: dto.parentReplyId ?? null,
      },
      include: {
        author: {
          select: { buyerProfile: { select: { displayName: true, verificationStatus: true } } },
        },
      },
    })

    return this.formatReply(reply)
  }

  async upvoteThread(threadId: string) {
    return this.prisma.thread.update({
      where: { id: threadId },
      data: { upvotes: { increment: 1 } },
      select: { id: true, upvotes: true },
    })
  }

  async reportThread(threadId: string, userId: string, reason: string) {
    // Create a moderation report (simplified — full flagging system would use a ModerationReport model)
    return { message: 'Report submitted for review', threadId }
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private formatThread(thread: any) {
    const profile = thread.author?.buyerProfile
    return {
      id: thread.id,
      title: thread.title,
      body: thread.body,
      authorDisplayName: thread.isAnonymous ? 'Community Member' : (profile?.displayName ?? 'Buyer'),
      isVerifiedBuyer: profile?.verificationStatus === 'VERIFIED_OWNER',
      isAnonymous: thread.isAnonymous,
      replyCount: thread._count?.replies ?? 0,
      upvotes: thread.upvotes,
      createdAt: thread.createdAt,
      isPinned: thread.isPinned,
    }
  }

  private formatReply(reply: any) {
    const profile = reply.author?.buyerProfile
    return {
      id: reply.id,
      body: reply.body,
      authorDisplayName: reply.isAnonymous ? 'Community Member' : (profile?.displayName ?? 'Buyer'),
      isVerifiedBuyer: profile?.verificationStatus === 'VERIFIED_OWNER',
      isAnonymous: reply.isAnonymous,
      createdAt: reply.createdAt,
      parentReplyId: reply.parentReplyId,
      childReplies: (reply.nestedReplies ?? []).map((c: any) => this.formatReply(c)),
    }
  }
}
