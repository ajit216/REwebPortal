import type { Metadata } from 'next'
import Link from 'next/link'
import { MarketOverviewStats } from '@/components/analytics/market-overview-stats'
import { DelayBarChart } from '@/components/analytics/delay-bar-chart'
import { GrievanceTrendChart } from '@/components/analytics/grievance-trend-chart'
import { DataDisclaimer } from '@/components/shared/data-disclaimer'
import { ExportButton } from '@/components/shared/export-button'
import { ANALYTICS_STATS, DELAY_CHART_DATA, GRIEVANCE_TREND_DATA, PROJECTS, BUILDERS } from '@/data/mock'

export const metadata: Metadata = {
  title: 'Analytics — Mumbai & Thane Real Estate',
  description: 'Data-driven insights on delays, grievances, and transparency scores across Mumbai & Thane residential projects.',
}

// Data prepared for CSV export (server-side safe, passed to client button)
const projectExportData = PROJECTS.map((p) => ({
  Name: p.name,
  Builder: p.builderName,
  City: p.city,
  Locality: p.locality,
  Status: p.status,
  'Transparency Score': p.transparencyScore ?? '',
  'Delay (months)': p.delayMonths,
  'Open Grievances': p.openGrievances,
  'RERA Number': p.reraNumber,
}))

const builderExportData = BUILDERS.map((b) => ({
  Builder: b.name,
  'Total Projects': b.totalProjects,
  'Delayed Projects': b.delayedProjects,
  'Avg Delay (months)': b.avgDelayMonths ?? '',
  'Total Grievances': b.totalGrievances,
  'Transparency Score': b.transparencyScore ?? '',
  Grade: b.transparencyGrade ?? '',
}))

const delayExportData = DELAY_CHART_DATA.map((d) => ({
  Builder: d.builderName,
  'Avg Delay (months)': d.avgDelayMonths,
}))

export default function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-heading text-3xl font-bold text-neutral-900">Analytics Dashboard</h1>
          <p className="text-neutral-600 mt-1">
            The state of Mumbai & Thane residential real estate — data updated regularly
          </p>
        </div>
        <Link
          href="/builders/compare"
          className="shrink-0 rounded-lg border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-100 transition-colors"
        >
          Compare Builders →
        </Link>
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
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="font-heading text-base font-semibold text-neutral-900">
              Average Delay by Builder
            </h2>
            <ExportButton
              filename="builder-delays.csv"
              data={delayExportData}
              label="Export"
            />
          </div>
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

      {/* Data Export */}
      <section className="mb-8">
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="font-heading text-base font-semibold text-neutral-900 mb-2">Data Exports</h2>
          <p className="text-sm text-neutral-500 mb-4">
            Download public platform data as CSV. Individual buyer data is never exported.
          </p>
          <div className="flex flex-wrap gap-3">
            <ExportButton
              filename="rewebportal-projects.csv"
              data={projectExportData}
              label="Project List (CSV)"
            />
            <ExportButton
              filename="rewebportal-builders.csv"
              data={builderExportData}
              label="Builder Comparison (CSV)"
            />
            <ExportButton
              filename="rewebportal-delay-stats.csv"
              data={delayExportData}
              label="Delay Statistics (CSV)"
            />
          </div>
        </div>
      </section>

      {/* Delay distribution breakdown */}
      <section className="mb-8">
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="font-heading text-base font-semibold text-neutral-900 mb-4">
            Delay Distribution — All Projects
          </h2>
          {(() => {
            const noDelay = PROJECTS.filter((p) => p.delayMonths === 0).length
            const low = PROJECTS.filter((p) => p.delayMonths > 0 && p.delayMonths <= 6).length
            const mid = PROJECTS.filter((p) => p.delayMonths > 6 && p.delayMonths <= 12).length
            const high = PROJECTS.filter((p) => p.delayMonths > 12 && p.delayMonths <= 24).length
            const vhigh = PROJECTS.filter((p) => p.delayMonths > 24).length
            const total = PROJECTS.length

            return (
              <div className="space-y-3">
                {[
                  { label: 'No delay', count: noDelay, color: 'bg-success-500' },
                  { label: '1–6 months delay', count: low, color: 'bg-warning-500' },
                  { label: '7–12 months delay', count: mid, color: 'bg-orange-500' },
                  { label: '13–24 months delay', count: high, color: 'bg-danger-500' },
                  { label: '24+ months delay', count: vhigh, color: 'bg-danger-700' },
                ].map((item) => {
                  const pct = Math.round((item.count / total) * 100)
                  return (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1 text-sm">
                        <span className="text-neutral-700">{item.label}</span>
                        <span className="text-neutral-500 text-xs">{item.count} projects ({pct}%)</span>
                      </div>
                      <div className="h-3 w-full rounded-full bg-neutral-100 overflow-hidden">
                        <div className={`h-full rounded-full ${item.color}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })()}
        </div>
      </section>

      {/* Top delayed projects */}
      <section className="mb-8">
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="font-heading text-base font-semibold text-neutral-900 mb-4">
            Most Delayed Projects (Currently Active)
          </h2>
          <div className="divide-y divide-neutral-100">
            {[...PROJECTS]
              .filter((p) => p.delayMonths > 0)
              .sort((a, b) => b.delayMonths - a.delayMonths)
              .slice(0, 5)
              .map((project, i) => (
                <div key={project.id} className="py-3 flex items-center gap-3">
                  <span className="font-heading text-lg font-bold text-neutral-300 w-6 shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="text-sm font-semibold text-neutral-900 hover:text-primary-600 transition-colors"
                    >
                      {project.name}
                    </Link>
                    <p className="text-xs text-neutral-500">{project.builderName} · {project.city}</p>
                  </div>
                  <span className="text-sm font-bold text-danger-600 shrink-0">
                    {project.delayMonths} months
                  </span>
                </div>
              ))}
          </div>
        </div>
      </section>

      <DataDisclaimer lastUpdated="28 Apr 2025" extraNote="Analytics are computed from platform data and may lag real-time conditions." />
    </div>
  )
}
