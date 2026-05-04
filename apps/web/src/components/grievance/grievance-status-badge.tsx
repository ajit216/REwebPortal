import { Badge } from '@/components/ui/badge'
import { grievanceStatusLabel } from '@/lib/utils'
import type { GrievanceStatus } from '@rewebportal/types'

interface GrievanceStatusBadgeProps {
  status: GrievanceStatus
  showIcon?: boolean
}

const variantMap: Record<GrievanceStatus, 'info' | 'warning' | 'success' | 'danger' | 'default'> = {
  DRAFT: 'default',
  SUBMITTED: 'info',
  ACKNOWLEDGED: 'warning',
  ESCALATED: 'danger',
  RESOLVED: 'success',
  CLOSED_UNRESOLVED: 'default',
}

const icons: Partial<Record<GrievanceStatus, string>> = {
  SUBMITTED: '📋',
  ACKNOWLEDGED: '👁',
  ESCALATED: '⬆️',
  RESOLVED: '✅',
  CLOSED_UNRESOLVED: '🚫',
}

export function GrievanceStatusBadge({ status, showIcon = true }: GrievanceStatusBadgeProps) {
  return (
    <Badge variant={variantMap[status]}>
      {showIcon && icons[status] && <span aria-hidden="true">{icons[status]}</span>}
      {grievanceStatusLabel(status)}
    </Badge>
  )
}
