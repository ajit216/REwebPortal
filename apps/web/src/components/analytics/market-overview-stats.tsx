import type { AnalyticsStats } from '@rewebportal/types'
import { Building, TrendingDown, Flag, CheckCircle } from 'lucide-react'

interface MarketOverviewStatsProps {
  stats: AnalyticsStats
}

export function MarketOverviewStats({ stats }: MarketOverviewStatsProps) {
  const cards = [
    {
      label: 'Total Projects Tracked',
      value: stats.totalProjects.toString(),
      icon: Building,
      color: 'text-primary-500',
      bg: 'bg-primary-50',
    },
    {
      label: 'Delayed / Stalled',
      value: `${(stats.byStatus.DELAYED || 0) + (stats.byStatus.STALLED || 0)}`,
      sub: `of ${stats.totalProjects} projects`,
      icon: TrendingDown,
      color: 'text-danger-500',
      bg: 'bg-danger-50',
    },
    {
      label: 'Total Grievances',
      value: stats.totalGrievances.toLocaleString('en-IN'),
      sub: `${stats.activeGrievances} active`,
      icon: Flag,
      color: 'text-warning-500',
      bg: 'bg-warning-50',
    },
    {
      label: 'Avg Transparency Score',
      value: `${stats.avgTransparencyScore}/100`,
      icon: CheckCircle,
      color: 'text-success-500',
      bg: 'bg-success-50',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.bg} mb-3`}>
            <card.icon className={`h-5 w-5 ${card.color}`} aria-hidden="true" />
          </div>
          <p className={`text-2xl font-bold font-heading ${card.color}`}>{card.value}</p>
          <p className="text-xs text-neutral-500 mt-0.5">{card.label}</p>
          {card.sub && <p className="text-xs text-neutral-400 mt-0.5">{card.sub}</p>}
        </div>
      ))}
    </div>
  )
}
