import type { Metadata } from 'next'
import { Eye, Flag, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = { title: 'Moderation Queue' }

const MODERATION_QUEUE = [
  {
    id: 'm1',
    type: 'Community Post',
    author: 'Verified Buyer',
    projectName: 'Lodha Palava City',
    preview: 'Builder X\'s CEO is a fraud living at [address removed] — someone should...',
    reportCount: 5,
    reason: 'Personal address exposed, potential defamation',
    flaggedAt: '2025-05-02T10:00:00Z',
    priority: 'high',
  },
  {
    id: 'm2',
    type: 'Community Post',
    author: 'Suresh P.',
    projectName: 'Rustomjee Seasons',
    preview: 'Has anyone else not received their demand letter for Q1 2025?',
    reportCount: 1,
    reason: 'Off-topic report (likely spurious)',
    flaggedAt: '2025-05-01T15:30:00Z',
    priority: 'low',
  },
  {
    id: 'm3',
    type: 'Community Post',
    author: 'Verified Buyer',
    projectName: 'Runwal My City',
    preview: 'The builder is asking for ₹2 lakh in maintenance before possession — is this legal?',
    reportCount: 1,
    reason: 'Flagged as spam (likely spurious)',
    flaggedAt: '2025-04-30T09:00:00Z',
    priority: 'low',
  },
]

export default function ModerationPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-neutral-900">Moderation Queue</h1>
        <p className="text-neutral-600 text-sm mt-1">
          {MODERATION_QUEUE.length} posts pending review
        </p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white divide-y divide-neutral-100">
        {MODERATION_QUEUE.map((item) => (
          <div key={item.id} className="p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Badge variant={item.priority === 'high' ? 'danger' : 'default'}>
                    {item.priority === 'high' ? '🔴 High Priority' : '⚪ Low Priority'}
                  </Badge>
                  <span className="text-xs text-neutral-400">{item.type}</span>
                  <span className="flex items-center gap-1 text-xs text-neutral-400">
                    <Flag className="h-3 w-3" />
                    {item.reportCount} report{item.reportCount > 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-sm font-medium text-neutral-800 mb-0.5">by {item.author} · {item.projectName}</p>
                <p className="text-sm text-neutral-600 italic line-clamp-2">"{item.preview}"</p>
                <p className="mt-2 text-xs text-warning-700 bg-warning-50 border border-warning-200 rounded px-2 py-1 inline-block">
                  Reason: {item.reason}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Button size="sm" variant="destructive">Hide Post</Button>
                <Button size="sm" variant="outline">Keep Visible</Button>
                <span className="flex items-center gap-1 text-xs text-neutral-400">
                  <Clock className="h-3 w-3" />
                  {new Date(item.flaggedAt).toLocaleDateString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
