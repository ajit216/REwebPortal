import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Building,
  Flag,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataDisclaimer } from '@/components/shared/data-disclaimer'
import { ScorecardBreakdown } from '@/components/builder/scorecard-breakdown'
import { BUILDERS, PROJECTS, RED_FLAGS, BUILDER_SCORECARDS } from '@/data/mock'
import { statusLabel, statusVariant } from '@/lib/utils'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const builder = BUILDERS.find((b) => b.slug === params.slug)
  if (!builder) return { title: 'Builder Not Found' }
  return {
    title: `${builder.name} — Accountability Track Record`,
    description: `Full accountability history for ${builder.name}: possession delivery, RERA compliance, grievance resolution, and OC track record.`,
  }
}

export async function generateStaticParams() {
  return BUILDERS.map((b) => ({ slug: b.slug }))
}

function StatBlock({
  label,
  value,
  sub,
  trend,
  color = 'text-neutral-800',
}: {
  label: string
  value: string
  sub?: string
  trend?: 'up' | 'down' | 'neutral'
  color?: string
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <p className={`font-heading text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-neutral-500 mt-0.5">{label}</p>
      {sub && (
        <div className="mt-1 flex items-center gap-1">
          {trend === 'up' && <TrendingUp className="h-3 w-3 text-success-500" aria-hidden="true" />}
          {trend === 'down' && <TrendingDown className="h-3 w-3 text-danger-500" aria-hidden="true" />}
          <p className="text-xs text-neutral-400">{sub}</p>
        </div>
      )}
    </div>
  )
}

export default function BuilderTrackRecordPage({ params }: PageProps) {
  const builder = BUILDERS.find((b) => b.slug === params.slug)
  if (!builder) notFound()

  const builderProjects = PROJECTS.filter((p) => p.builderId === builder.id)
  const scorecard = BUILDER_SCORECARDS[builder.id]

  const completedProjects = builderProjects.filter((p) => p.status === 'READY_TO_MOVE' || p.status === 'COMPLETED')
  const delayedProjects = builderProjects.filter((p) => p.status === 'DELAYED' || p.status === 'STALLED')
  const onTimeProjects = builderProjects.filter((p) => p.delayMonths === 0)

  const deliveredOnTime = Math.round((onTimeProjects.length / Math.max(builderProjects.length, 1)) * 100)
  const totalGrievancesAcross = builderProjects.reduce((s, p) => s + p.openGrievances, 0)
  const grievancesPerProject =
    builderProjects.length > 0 ? (totalGrievancesAcross / builderProjects.length).toFixed(1) : '0'

  const totalRedFlags = builderProjects.reduce((s, p) => s + p.redFlagCount, 0)
  const allRedFlags = builderProjects.flatMap((p) => (RED_FLAGS[p.id] ?? []).map((f) => ({ ...f, projectName: p.name, projectSlug: p.slug })))

  // Derived OC estimate (projects with status COMPLETED or READY_TO_MOVE that have 0 delay = OC obtained)
  const ocObtainedCount = completedProjects.length
  const ocObtainedPct = builderProjects.length > 0
    ? Math.round((ocObtainedCount / builderProjects.length) * 100)
    : 0

  const delayDistribution = [
    { label: 'No delay', count: onTimeProjects.length, color: 'bg-success-500' },
    { label: '1–6 months', count: builderProjects.filter((p) => p.delayMonths > 0 && p.delayMonths <= 6).length, color: 'bg-warning-500' },
    { label: '7–12 months', count: builderProjects.filter((p) => p.delayMonths > 6 && p.delayMonths <= 12).length, color: 'bg-orange-500' },
    { label: '12+ months', count: builderProjects.filter((p) => p.delayMonths > 12).length, color: 'bg-danger-500' },
  ]
  const totalForDist = Math.max(builderProjects.length, 1)

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-neutral-500">
        <ol className="flex items-center gap-1 flex-wrap">
          <li><Link href="/" className="hover:text-neutral-700">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/builders" className="hover:text-neutral-700">Builders</Link></li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/builders/${builder.slug}`} className="hover:text-neutral-700">
              {builder.name}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-neutral-900 font-medium" aria-current="page">Track Record</li>
        </ol>
      </nav>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Building className="h-5 w-5 text-primary-500" aria-hidden="true" />
          <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">Accountability Track Record</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900">{builder.name}</h1>
        {builder.establishedYear && (
          <p className="text-neutral-500 text-sm mt-1">Est. {builder.establishedYear}</p>
        )}
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
        <StatBlock
          label="Total Projects (scope)"
          value={builder.totalProjects.toString()}
          color="text-primary-600"
        />
        <StatBlock
          label="Delivered On Time"
          value={`${deliveredOnTime}%`}
          sub={`${onTimeProjects.length} of ${builderProjects.length} tracked`}
          trend={deliveredOnTime >= 70 ? 'up' : 'down'}
          color={deliveredOnTime >= 70 ? 'text-success-600' : 'text-danger-600'}
        />
        <StatBlock
          label="Avg Delay"
          value={builder.avgDelayMonths ? `${builder.avgDelayMonths} mo` : '—'}
          color={(builder.avgDelayMonths ?? 0) > 8 ? 'text-danger-600' : 'text-neutral-800'}
        />
        <StatBlock
          label="Grievances / Project"
          value={grievancesPerProject}
          color={parseFloat(grievancesPerProject) > 10 ? 'text-danger-600' : 'text-neutral-800'}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Delivery section */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="font-heading text-base font-semibold text-neutral-900 mb-4">Possession Delivery</h2>

          <div className="space-y-3 mb-5">
            {delayDistribution.map((item) => {
              const pct = Math.round((item.count / totalForDist) * 100)
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1 text-sm">
                    <span className="text-neutral-700">{item.label}</span>
                    <span className="text-neutral-500 text-xs">{item.count} projects ({pct}%)</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-neutral-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="border-t border-neutral-100 pt-4 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success-500 shrink-0" aria-hidden="true" />
              <span className="text-neutral-700">
                <strong>{completedProjects.length}</strong> project{completedProjects.length !== 1 ? 's' : ''} completed or ready to move
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning-500 shrink-0" aria-hidden="true" />
              <span className="text-neutral-700">
                <strong>{builder.delayedProjects}</strong> project{builder.delayedProjects !== 1 ? 's' : ''} currently delayed
              </span>
            </div>
            {delayedProjects.some((p) => p.status === 'STALLED') && (
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-danger-500 shrink-0" aria-hidden="true" />
                <span className="text-neutral-700">
                  <strong>{delayedProjects.filter((p) => p.status === 'STALLED').length}</strong> project{delayedProjects.filter((p) => p.status === 'STALLED').length !== 1 ? 's' : ''} stalled
                </span>
              </div>
            )}
          </div>
        </div>

        {/* OC & Compliance */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="font-heading text-base font-semibold text-neutral-900 mb-4">RERA & OC Compliance</h2>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-neutral-700">OC Obtained Rate</span>
                <span className={`text-sm font-bold ${ocObtainedPct >= 80 ? 'text-success-600' : ocObtainedPct >= 60 ? 'text-warning-600' : 'text-danger-600'}`}>
                  {ocObtainedPct}%
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-neutral-100 overflow-hidden">
                <div
                  className={`h-full rounded-full ${ocObtainedPct >= 80 ? 'bg-success-500' : ocObtainedPct >= 60 ? 'bg-warning-500' : 'bg-danger-500'}`}
                  style={{ width: `${ocObtainedPct}%` }}
                />
              </div>
              <p className="text-xs text-neutral-400 mt-1">{ocObtainedCount} of {builderProjects.length} tracked projects</p>
            </div>

            <div className="border-t border-neutral-100 pt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                {totalRedFlags === 0
                  ? <CheckCircle className="h-4 w-4 text-success-500" aria-hidden="true" />
                  : <AlertTriangle className="h-4 w-4 text-warning-500" aria-hidden="true" />}
                <span className="text-neutral-700">
                  <strong>{totalRedFlags}</strong> active red flag{totalRedFlags !== 1 ? 's' : ''} across all projects
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Flag className="h-4 w-4 text-neutral-400" aria-hidden="true" />
                <span className="text-neutral-700">
                  <strong>{builder.totalGrievances}</strong> total grievances logged
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scorecard */}
      {scorecard && (
        <div className="mb-8">
          <h2 className="font-heading text-lg font-semibold text-neutral-900 mb-4">Transparency Scorecard</h2>
          <ScorecardBreakdown scorecard={scorecard} />
        </div>
      )}

      {/* Red Flags across projects */}
      {allRedFlags.length > 0 && (
        <div className="mb-8">
          <h2 className="font-heading text-lg font-semibold text-neutral-900 mb-4">
            Active Red Flags ({allRedFlags.length})
          </h2>
          <div className="space-y-3">
            {allRedFlags.map((flag) => (
              <div
                key={flag.id}
                className={`flex items-start gap-3 rounded-xl border p-4 ${
                  flag.severity === 'CRITICAL' ? 'border-danger-400 bg-danger-50' : 'border-warning-400 bg-warning-50'
                }`}
              >
                {flag.severity === 'CRITICAL'
                  ? <XCircle className="h-5 w-5 shrink-0 text-danger-500 mt-0.5" aria-hidden="true" />
                  : <AlertTriangle className="h-5 w-5 shrink-0 text-warning-500 mt-0.5" aria-hidden="true" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className={`text-sm font-semibold ${flag.severity === 'CRITICAL' ? 'text-danger-700' : 'text-warning-700'}`}>
                        {flag.title}
                      </p>
                      <Link
                        href={`/projects/${flag.projectSlug}`}
                        className="text-xs text-primary-500 hover:underline"
                      >
                        {flag.projectName}
                      </Link>
                    </div>
                    <Badge variant={flag.severity === 'CRITICAL' ? 'danger' : 'warning'}>
                      {flag.severity}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-neutral-700">{flag.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All projects list */}
      <div className="mb-8">
        <h2 className="font-heading text-lg font-semibold text-neutral-900 mb-4">
          Projects in Scope ({builderProjects.length})
        </h2>
        <div className="rounded-xl border border-neutral-200 bg-white divide-y divide-neutral-100">
          {builderProjects.map((project) => (
            <div key={project.id} className="p-4 flex items-center gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="font-heading text-sm font-semibold text-neutral-900 hover:text-primary-600 transition-colors"
                  >
                    {project.name}
                  </Link>
                  <Badge variant={statusVariant(project.status)}>{statusLabel(project.status)}</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                  <span>{project.locality}, {project.city}</span>
                  {project.delayMonths > 0 && (
                    <span className="flex items-center gap-1 text-danger-600">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      {project.delayMonths}mo delay
                    </span>
                  )}
                  {project.openGrievances > 0 && (
                    <span className="flex items-center gap-1 text-warning-600">
                      <Flag className="h-3 w-3" aria-hidden="true" />
                      {project.openGrievances} grievances
                    </span>
                  )}
                  {project.transparencyScore !== null && (
                    <span className="font-medium text-neutral-600">
                      Score: {project.transparencyScore}/100
                    </span>
                  )}
                </div>
              </div>
              <Link
                href={`/projects/${project.slug}/buyer-check`}
                className="text-xs font-medium text-primary-500 hover:underline shrink-0"
              >
                Buyer Check →
              </Link>
            </div>
          ))}
        </div>
      </div>

      <DataDisclaimer lastUpdated="28 Apr 2025" />

      <div className="mt-6">
        <Button variant="outline" asChild>
          <Link href={`/builders/${builder.slug}`}>
            <ArrowLeft className="h-4 w-4" />
            Back to Builder Profile
          </Link>
        </Button>
      </div>
    </div>
  )
}
