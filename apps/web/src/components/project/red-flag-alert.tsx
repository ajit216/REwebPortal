import Link from 'next/link'
import { AlertCircle, AlertTriangle } from 'lucide-react'
import type { RedFlag } from '@rewebportal/types'
import { cn } from '@/lib/utils'

interface RedFlagAlertProps {
  flags: RedFlag[]
  compact?: boolean
}

export function RedFlagAlert({ flags, compact = false }: RedFlagAlertProps) {
  if (flags.length === 0) return null

  if (compact) {
    const criticalCount = flags.filter((f) => f.severity === 'CRITICAL').length
    const warningCount = flags.filter((f) => f.severity === 'WARNING').length
    return (
      <div className="flex items-center gap-1.5">
        {criticalCount > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-danger-50 border border-danger-500 px-2.5 py-0.5 text-xs font-semibold text-danger-700">
            <AlertCircle className="h-3 w-3" aria-hidden="true" />
            {criticalCount} Critical
          </span>
        )}
        {warningCount > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-warning-50 border border-warning-500 px-2.5 py-0.5 text-xs font-semibold text-warning-700">
            <AlertTriangle className="h-3 w-3" aria-hidden="true" />
            {warningCount} Warning
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3" role="alert" aria-label="Red flags for this project">
      {flags.map((flag) => (
        <div
          key={flag.id}
          className={cn(
            'flex items-start gap-3 rounded-xl border p-4',
            flag.severity === 'CRITICAL'
              ? 'border-danger-500 bg-danger-50'
              : 'border-warning-500 bg-warning-50'
          )}
        >
          {flag.severity === 'CRITICAL' ? (
            <AlertCircle className="h-5 w-5 shrink-0 text-danger-500 mt-0.5" aria-hidden="true" />
          ) : (
            <AlertTriangle className="h-5 w-5 shrink-0 text-warning-500 mt-0.5" aria-hidden="true" />
          )}
          <div className="flex-1 min-w-0">
            <p
              className={cn(
                'text-sm font-semibold',
                flag.severity === 'CRITICAL' ? 'text-danger-700' : 'text-warning-700'
              )}
            >
              {flag.severity === 'CRITICAL' ? '⛔ CRITICAL: ' : '⚠️ WARNING: '}
              {flag.title}
            </p>
            <p className="mt-0.5 text-sm text-neutral-700">{flag.description}</p>
            <Link
              href={flag.learnMorePath}
              className="mt-1 inline-block text-xs font-medium text-primary-500 hover:underline"
            >
              Learn More →
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
