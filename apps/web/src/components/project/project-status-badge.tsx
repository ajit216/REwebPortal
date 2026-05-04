import { Badge } from '@/components/ui/badge'
import { statusLabel, statusVariant, reraStatusLabel, reraStatusVariant } from '@/lib/utils'
import type { ProjectStatus, RERARecordStatus } from '@rewebportal/types'
import { CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react'

interface ProjectStatusBadgeProps {
  status: ProjectStatus
  reraStatus?: RERARecordStatus
  showIcon?: boolean
}

const StatusIcon = ({ status }: { status: ProjectStatus }) => {
  switch (status) {
    case 'READY_TO_MOVE':
    case 'COMPLETED':
      return <CheckCircle className="h-3 w-3" />
    case 'DELAYED':
    case 'STALLED':
      return <AlertTriangle className="h-3 w-3" />
    case 'UNDER_CONSTRUCTION':
    case 'NEARING_COMPLETION':
      return <Clock className="h-3 w-3" />
    default:
      return null
  }
}

export function ProjectStatusBadge({ status, reraStatus, showIcon = true }: ProjectStatusBadgeProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <Badge variant={statusVariant(status)}>
        {showIcon && <StatusIcon status={status} />}
        {statusLabel(status)}
      </Badge>
      {reraStatus && (
        <Badge variant={reraStatusVariant(reraStatus)}>
          {reraStatusLabel(reraStatus)}
        </Badge>
      )}
    </div>
  )
}
