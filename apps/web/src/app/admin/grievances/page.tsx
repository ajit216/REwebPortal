import type { Metadata } from 'next'
import { Flag, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GrievanceStatusBadge } from '@/components/grievance/grievance-status-badge'
import { grievanceCategoryLabel, severityLabel } from '@/lib/utils'
import { USER_GRIEVANCES, GRIEVANCE_CATEGORY_SUMMARY } from '@/data/mock'

export const metadata: Metadata = { title: 'Grievance Queue' }

// Expand mock data for admin view
const ADMIN_GRIEVANCES = [
  ...USER_GRIEVANCES,
  {
    id: 'ag1',
    referenceId: 'GRV-2025-0501',
    projectName: 'Rustomjee Seasons',
    category: 'POSSESSION_DELAY' as const,
    severity: 'CRITICAL' as const,
    title: 'Possession delayed 32 months, builder unresponsive',
    status: 'SUBMITTED' as const,
    createdAt: '2025-05-01T08:00:00Z',
    updatedAt: '2025-05-01T08:00:00Z',
    isAnonymous: false,
  },
  {
    id: 'ag2',
    referenceId: 'GRV-2025-0498',
    projectName: 'Runwal My City',
    category: 'CONSTRUCTION_QUALITY' as const,
    severity: 'HIGH' as const,
    title: 'Seepage in walls, builder not responding',
    status: 'SUBMITTED' as const,
    createdAt: '2025-04-30T14:00:00Z',
    updatedAt: '2025-04-30T14:00:00Z',
    isAnonymous: true,
  },
]

const severityColor: Record<string, string> = {
  CRITICAL: 'danger',
  HIGH: 'danger',
  MEDIUM: 'warning',
  LOW: 'default',
}

export default function AdminGrievancesPage() {
  const unacknowledged = ADMIN_GRIEVANCES.filter((g) => g.status === 'SUBMITTED')

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-neutral-900">Grievance Queue</h1>
          <p className="text-neutral-600 text-sm mt-1">
            {unacknowledged.length} unacknowledged complaints
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {GRIEVANCE_CATEGORY_SUMMARY.slice(0, 4).map((item) => (
          <div key={item.category} className="rounded-xl border border-neutral-200 bg-white p-4">
            <p className="text-lg font-bold font-heading text-neutral-800">{item.count}</p>
            <p className="text-xs text-neutral-500 mt-0.5">{grievanceCategoryLabel(item.category)}</p>
          </div>
        ))}
      </div>

      {/* Queue */}
      <div className="rounded-xl border border-neutral-200 bg-white divide-y divide-neutral-100">
        {ADMIN_GRIEVANCES.map((g) => (
          <div key={g.id} className="p-5">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex-1 min-w-0">
                <p className="font-mono text-xs text-neutral-400 mb-1">{g.referenceId}</p>
                <h2 className="font-heading text-sm font-semibold text-neutral-900 line-clamp-1">{g.title}</h2>
                <p className="text-xs text-neutral-500 mt-0.5">{g.projectName}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <GrievanceStatusBadge status={g.status} />
                  <Badge variant={severityColor[g.severity] as any}>{severityLabel(g.severity)}</Badge>
                  <Badge variant="default">{grievanceCategoryLabel(g.category)}</Badge>
                  {g.isAnonymous && <Badge variant="default">Anonymous</Badge>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs text-neutral-400">
                  <Clock className="h-3 w-3" />
                  {new Date(g.createdAt).toLocaleDateString('en-IN')}
                </span>
                <Button size="sm" variant="outline">
                  Review
                </Button>
                {g.status === 'SUBMITTED' && (
                  <Button size="sm">Acknowledge</Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
