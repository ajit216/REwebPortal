import type { Metadata } from 'next'
import { MarketOverviewStats } from '@/components/analytics/market-overview-stats'
import { DelayBarChart } from '@/components/analytics/delay-bar-chart'
import { GrievanceTrendChart } from '@/components/analytics/grievance-trend-chart'
import { DataDisclaimer } from '@/components/shared/data-disclaimer'
import { ANALYTICS_STATS, DELAY_CHART_DATA, GRIEVANCE_TREND_DATA } from '@/data/mock'

export const metadata: Metadata = {
  title: 'Analytics — Mumbai & Thane Real Estate',
  description: 'Data-driven insights on delays, grievances, and transparency scores across Mumbai & Thane residential projects.',
}

export default function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold text-neutral-900">Analytics Dashboard</h1>
        <p className="text-neutral-600 mt-1">
          The state of Mumbai & Thane residential real estate — data updated regularly
        </p>
      </div>

      {/* Market Overview */}
      <section className="mb-8">
        <h2 className="font-heading text-lg font-semibold text-neutral-900 mb-4">Market Overview</h2>
        <MarketOverviewStats stats={ANALYTICS_STATS} />
      </section>

      {/* Project Status Breakdown */}
      <section className="mb-8">
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="font-heading text-lg font-semibold text-neutral-900 mb-4">Project Status Breakdown</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {(Object.entries(ANALYTICS_STATS.byStatus) as [string, number][]).map(([status, count]) => {
              const colors: Record<string, string> = {
                UNDER_CONSTRUCTION: 'text-info-600 bg-info-50',
                NEARING_COMPLETION: 'text-warning-600 bg-warning-50',
                READY_TO_MOVE: 'text-success-600 bg-success-50',
                COMPLETED: 'text-success-700 bg-success-50',
                DELAYED: 'text-danger-600 bg-danger-50',
                STALLED: 'text-danger-700 bg-danger-50',
              }
              const pct = Math.round((count / ANALYTICS_STATS.totalProjects) * 100)
              return (
                <div key={status} className={`rounded-xl p-4 text-center ${colors[status] ?? 'bg-neutral-50'}`}>
                  <p className="font-heading text-2xl font-bold">{count}</p>
                  <p className="text-xs mt-1">{status.replace(/_/g, ' ')}</p>
                  <p className="text-xs opacity-70">{pct}%</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Delay Chart */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="font-heading text-base font-semibold text-neutral-900 mb-4">
            Average Delay by Builder
          </h2>
          <DelayBarChart data={DELAY_CHART_DATA} />
        </div>

        {/* Grievance Trend */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="font-heading text-base font-semibold text-neutral-900 mb-4">
            Grievance Filing Trend (12 Months)
          </h2>
          <GrievanceTrendChart data={GRIEVANCE_TREND_DATA} />
        </div>
      </div>

      <DataDisclaimer lastUpdated="28 Apr 2025" extraNote="Analytics are computed from platform data and may lag real-time conditions." />
    </div>
  )
}
