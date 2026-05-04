import Link from 'next/link'
import { Building, TrendingDown, Flag, ArrowRight } from 'lucide-react'
import { TransparencyScoreBadge } from '@/components/project/transparency-score-badge'
import type { Builder } from '@rewebportal/types'

interface BuilderCardProps {
  builder: Builder
}

export function BuilderCard({ builder }: BuilderCardProps) {
  const delayRate =
    builder.totalProjects > 0
      ? Math.round((builder.delayedProjects / builder.totalProjects) * 100)
      : 0

  return (
    <Link
      href={`/builders/${builder.slug}`}
      className="group flex flex-col rounded-xl border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-primary-200 transition-all"
      aria-label={`View ${builder.name} profile`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Logo placeholder */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
          <Building className="h-6 w-6" aria-hidden="true" />
        </div>
        {builder.transparencyScore !== null && builder.transparencyGrade !== null && (
          <TransparencyScoreBadge
            score={builder.transparencyScore}
            grade={builder.transparencyGrade}
            size="sm"
          />
        )}
      </div>

      <div className="mt-3 flex-1">
        <h3 className="font-heading font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
          {builder.name}
        </h3>
        {builder.establishedYear && (
          <p className="text-xs text-neutral-500 mt-0.5">Est. {builder.establishedYear}</p>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-neutral-50 p-3">
          <p className="text-xs text-neutral-500">Projects</p>
          <p className="text-sm font-bold text-neutral-800">{builder.totalProjects}</p>
        </div>
        <div className={`rounded-lg p-3 ${delayRate > 30 ? 'bg-danger-50' : delayRate > 15 ? 'bg-warning-50' : 'bg-success-50'}`}>
          <p className="text-xs text-neutral-500">Delay Rate</p>
          <p className={`text-sm font-bold ${delayRate > 30 ? 'text-danger-600' : delayRate > 15 ? 'text-warning-600' : 'text-success-600'}`}>
            {delayRate}%
          </p>
        </div>
        <div className="rounded-lg bg-neutral-50 p-3">
          <p className="text-xs text-neutral-500">Avg Delay</p>
          <p className="text-sm font-bold text-neutral-800">
            {builder.avgDelayMonths ? `${builder.avgDelayMonths} mo` : '—'}
          </p>
        </div>
        <div className={`rounded-lg p-3 ${builder.totalGrievances > 150 ? 'bg-danger-50' : builder.totalGrievances > 75 ? 'bg-warning-50' : 'bg-neutral-50'}`}>
          <p className="text-xs text-neutral-500">Grievances</p>
          <p className={`text-sm font-bold ${builder.totalGrievances > 150 ? 'text-danger-600' : builder.totalGrievances > 75 ? 'text-warning-600' : 'text-neutral-800'}`}>
            {builder.totalGrievances}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end">
        <span className="flex items-center gap-1 text-sm font-semibold text-primary-500 group-hover:gap-2 transition-all">
          View Profile <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
