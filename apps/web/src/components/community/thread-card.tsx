import Link from 'next/link'
import { MessageSquare, ThumbsUp, Pin, ShieldCheck } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { Thread } from '@rewebportal/types'
import { Badge } from '@/components/ui/badge'

interface ThreadCardProps {
  thread: Thread
  showProjectName?: boolean
  projectSlug?: string
}

export function ThreadCard({ thread, showProjectName = false, projectSlug }: ThreadCardProps) {
  const timeAgo = formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })

  return (
    <article className="rounded-xl border border-neutral-200 bg-white p-5 hover:border-primary-200 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {thread.isPinned && (
            <div className="flex items-center gap-1 mb-1.5">
              <Pin className="h-3 w-3 text-primary-500" aria-hidden="true" />
              <span className="text-xs font-medium text-primary-500">Pinned</span>
            </div>
          )}
          <Link
            href={`/projects/${projectSlug}/community#${thread.id}`}
            className="font-heading text-base font-semibold text-neutral-900 hover:text-primary-600 transition-colors line-clamp-2"
          >
            {thread.title}
          </Link>
          <p className="mt-1 text-sm text-neutral-600 line-clamp-2">{thread.body}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-neutral-500">
        {/* Author */}
        <div className="flex items-center gap-1">
          {thread.isVerifiedBuyer && (
            <ShieldCheck className="h-3 w-3 text-success-500" aria-hidden="true" />
          )}
          <span className="font-medium text-neutral-700">
            {thread.isAnonymous ? 'Verified Buyer' : thread.authorDisplayName}
          </span>
          {thread.isVerifiedBuyer && (
            <Badge variant="verified" className="py-0 px-1.5 text-[10px]">✓</Badge>
          )}
        </div>

        <span aria-hidden="true">·</span>
        <span>{timeAgo}</span>

        <span aria-hidden="true">·</span>
        <span className="flex items-center gap-1">
          <MessageSquare className="h-3 w-3" aria-hidden="true" />
          {thread.replyCount} {thread.replyCount === 1 ? 'reply' : 'replies'}
        </span>

        <span className="flex items-center gap-1">
          <ThumbsUp className="h-3 w-3" aria-hidden="true" />
          {thread.upvotes}
        </span>

        {showProjectName && thread.projectName && (
          <>
            <span aria-hidden="true">·</span>
            <span className="text-primary-500">{thread.projectName}</span>
          </>
        )}
      </div>
    </article>
  )
}
