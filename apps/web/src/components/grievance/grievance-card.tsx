import { formatDistanceToNow } from 'date-fns'
import { GrievanceStatusBadge } from './grievance-status-badge'
import { Badge } from '@/components/ui/badge'
import { grievanceCategoryLabel, severityLabel } from '@/lib/utils'
import type { Grievance } from '@rewebportal/types'

interface GrievanceCardProps {
  grievance: Grievance
  showActions?: boolean
}

const severityVariant = (sev: string) => {
  switch (sev) {
    case 'CRITICAL': return 'danger'
    case 'HIGH': return 'danger'
    case 'MEDIUM': return 'warning'
    default: return 'default'
  }
}

export function GrievanceCard({ grievance, showActions = false }: GrievanceCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <p className="font-mono text-xs text-neutral-400 mb-1">{grievance.referenceId}</p>
          <h4 className="font-heading text-sm font-semibold text-neutral-900 line-clamp-2">
            {grievance.title}
          </h4>
          <p className="text-xs text-neutral-500 mt-0.5">{grievance.projectName}</p>
        </div>
        <GrievanceStatusBadge status={grievance.status} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge variant="default">{grievanceCategoryLabel(grievance.category)}</Badge>
        <Badge variant={severityVariant(grievance.severity) as any}>
          {severityLabel(grievance.severity)} Severity
        </Badge>
        {grievance.isAnonymous && (
          <Badge variant="default">Anonymous</Badge>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-400">
        <span>Filed {formatDistanceToNow(new Date(grievance.createdAt), { addSuffix: true })}</span>
        <span>Updated {formatDistanceToNow(new Date(grievance.updatedAt), { addSuffix: true })}</span>
      </div>
    </div>
  )
}
