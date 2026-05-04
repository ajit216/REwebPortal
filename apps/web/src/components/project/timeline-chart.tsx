import { CheckCircle, Clock, AlertTriangle, Circle } from 'lucide-react'
import type { ProjectTimeline } from '@rewebportal/types'
import { cn } from '@/lib/utils'

interface TimelineChartProps {
  milestones: ProjectTimeline[]
}

const StatusIcon = ({ status, delayMonths }: { status: ProjectTimeline['status']; delayMonths: number }) => {
  switch (status) {
    case 'COMPLETED':
      return <CheckCircle className={cn('h-5 w-5', delayMonths > 0 ? 'text-warning-500' : 'text-success-500')} />
    case 'IN_PROGRESS':
      return <Clock className="h-5 w-5 text-info-500" />
    case 'DELAYED':
      return <AlertTriangle className="h-5 w-5 text-danger-500" />
    case 'PENDING':
      return <Circle className="h-5 w-5 text-neutral-300" />
    default:
      return <Circle className="h-5 w-5 text-neutral-300" />
  }
}

export function TimelineChart({ milestones }: TimelineChartProps) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[10px] top-5 bottom-5 w-0.5 bg-neutral-200" aria-hidden="true" />

      <ol className="space-y-6 relative" aria-label="Construction milestones">
        {milestones.map((milestone, idx) => (
          <li key={milestone.id} className="flex items-start gap-4 pl-1">
            <div className="relative z-10 shrink-0 mt-0.5">
              <StatusIcon status={milestone.status} delayMonths={milestone.delayMonths} />
            </div>
            <div className="flex-1 min-w-0 pb-2">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <h4 className={cn(
                  'text-sm font-semibold',
                  milestone.status === 'PENDING' ? 'text-neutral-400' : 'text-neutral-800'
                )}>
                  {milestone.milestone}
                </h4>
                {milestone.delayMonths > 0 && milestone.status === 'COMPLETED' && (
                  <span className="text-xs bg-warning-50 border border-warning-500 text-warning-700 rounded-full px-2 py-0.5 font-medium">
                    +{milestone.delayMonths}mo delay
                  </span>
                )}
                {milestone.status === 'IN_PROGRESS' && (
                  <span className="text-xs bg-info-50 border border-info-500 text-info-700 rounded-full px-2 py-0.5 font-medium">
                    In Progress
                  </span>
                )}
              </div>
              <div className="mt-1 flex gap-4 text-xs text-neutral-500">
                <span>
                  <span className="font-medium">Planned: </span>
                  {milestone.plannedDate}
                </span>
                {milestone.actualDate && (
                  <span>
                    <span className="font-medium">Actual: </span>
                    <span className={milestone.delayMonths > 0 ? 'text-warning-600 font-medium' : 'text-success-600'}>
                      {milestone.actualDate}
                    </span>
                  </span>
                )}
                {!milestone.actualDate && milestone.status !== 'PENDING' && (
                  <span className="text-neutral-400 italic">In progress</span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
