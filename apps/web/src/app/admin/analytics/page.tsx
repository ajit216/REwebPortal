import type { Metadata } from 'next'
import {
  Users,
  ShieldCheck,
  TrendingUp,
  Flag,
  Clock,
  Eye,
  AlertTriangle,
  CheckCircle,
  Database,
} from 'lucide-react'
import { DataDisclaimer } from '@/components/shared/data-disclaimer'
import { ANALYTICS_STATS, PROJECTS, BUILDERS } from '@/data/mock'

export const metadata: Metadata = { title: 'Admin Analytics' }

const PLATFORM_HEALTH = {
  registeredUsers: 8432,
  verifiedBuyers: 2109,
  mau: 3241,
  newRegistrationsThisMonth: 234,
  projectsWithCompleteProfiles: 89,
  projectsWithRecentSync: 67,
  projectsNeedingSync: 23,
  verificationQueuePending: 47,
  avgTimeToAcknowledge: 2.3,
  unacknowledgedOver5Days: 12,
  escalatedThisMonth: 18,
  reportsPendingReview: 8,
  postsHiddenThisMonth: 14,
  userSuspensionsActive: 3,
}

function HealthMetric({
  label,
  value,
  sub,
  status,
  icon: Icon,
}: {
  label: string
  value: string | number
  sub?: string
  status: 'ok' | 'warning' | 'critical' | 'neutral'
  icon: React.ElementType
}) {
  const colors = {
    ok: 'text-success-600 bg-success-50',
    warning: 'text-warning-600 bg-warning-50',
    critical: 'text-danger-600 bg-danger-50',
    neutral: 'text-primary-600 bg-primary-50',
  }
  const valueColors = {
    ok: 'text-success-700',
    warning: 'text-warning-700',
    critical: 'text-danger-700',
    neutral: 'text-neutral-800',
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${colors[status]} mb-3`}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <p className={`font-heading text-2xl font-bold ${valueColors[status]}`}>{value}</p>
      <p className="text-xs text-neutral-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-neutral-400 mt-0.5">{sub}</p>}
    </div>
  )
}

export default function AdminAnalyticsPage() {
  const verifiedPct = Math.round((PLATFORM_HEALTH.verifiedBuyers / PLATFORM_HEALTH.registeredUsers) * 100)

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-neutral-900">Platform Analytics</h1>
        <p className="text-neutral-600 text-sm mt-1">Platform health and operational metrics</p>
      </div>

      {/* User Metrics */}
      <section className="mb-8">
        <h2 className="font-heading text-base font-semibold text-neutral-700 mb-4 uppercase tracking-wide text-xs">
          User Metrics
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <HealthMetric
            label="Registered Users"
            value={PLATFORM_HEALTH.registeredUsers.toLocaleString('en-IN')}
            icon={Users}
            status="neutral"
          />
          <HealthMetric
            label="Verified Buyers"
            value={PLATFORM_HEALTH.verifiedBuyers.toLocaleString('en-IN')}
            sub={`${verifiedPct}% of registered`}
            icon={ShieldCheck}
            status="ok"
          />
          <HealthMetric
            label="Monthly Active Users"
            value={PLATFORM_HEALTH.mau.toLocaleString('en-IN')}
            icon={TrendingUp}
            status="neutral"
          />
          <HealthMetric
            label="New Registrations"
            value={PLATFORM_HEALTH.newRegistrationsThisMonth}
            sub="This month"
            icon={Users}
            status="ok"
          />
        </div>
      </section>

      {/* Data Quality */}
      <section className="mb-8">
        <h2 className="font-heading text-base font-semibold text-neutral-700 mb-4 uppercase tracking-wide text-xs">
          Data Quality
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <HealthMetric
            label="Projects: Complete Profile"
            value={`${PLATFORM_HEALTH.projectsWithCompleteProfiles}%`}
            icon={Database}
            status="ok"
          />
          <HealthMetric
            label="Synced (last 30 days)"
            value={`${PLATFORM_HEALTH.projectsWithRecentSync}%`}
            icon={CheckCircle}
            status="warning"
          />
          <HealthMetric
            label="Needs RERA Sync"
            value={PLATFORM_HEALTH.projectsNeedingSync}
            sub="Projects overdue"
            icon={AlertTriangle}
            status="warning"
          />
          <HealthMetric
            label="Verification Queue"
            value={PLATFORM_HEALTH.verificationQueuePending}
            sub="Pending admin review"
            icon={ShieldCheck}
            status={PLATFORM_HEALTH.verificationQueuePending > 30 ? 'warning' : 'ok'}
          />
        </div>
      </section>

      {/* Grievance Operations */}
      <section className="mb-8">
        <h2 className="font-heading text-base font-semibold text-neutral-700 mb-4 uppercase tracking-wide text-xs">
          Grievance Operations
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <HealthMetric
            label="Total Grievances"
            value={ANALYTICS_STATS.totalGrievances.toLocaleString('en-IN')}
            icon={Flag}
            status="neutral"
          />
          <HealthMetric
            label="Active Grievances"
            value={ANALYTICS_STATS.activeGrievances}
            icon={Flag}
            status="warning"
          />
          <HealthMetric
            label="Avg Time to Acknowledge"
            value={`${PLATFORM_HEALTH.avgTimeToAcknowledge} days`}
            icon={Clock}
            status={PLATFORM_HEALTH.avgTimeToAcknowledge <= 3 ? 'ok' : 'warning'}
          />
          <HealthMetric
            label="Unacknowledged >5 days"
            value={PLATFORM_HEALTH.unacknowledgedOver5Days}
            sub="Action needed"
            icon={AlertTriangle}
            status={PLATFORM_HEALTH.unacknowledgedOver5Days > 10 ? 'critical' : 'warning'}
          />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <HealthMetric
            label="Escalated This Month"
            value={PLATFORM_HEALTH.escalatedThisMonth}
            icon={TrendingUp}
            status="neutral"
          />
        </div>
      </section>

      {/* Moderation */}
      <section className="mb-8">
        <h2 className="font-heading text-base font-semibold text-neutral-700 mb-4 uppercase tracking-wide text-xs">
          Content Moderation
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <HealthMetric
            label="Reports Pending Review"
            value={PLATFORM_HEALTH.reportsPendingReview}
            icon={Eye}
            status={PLATFORM_HEALTH.reportsPendingReview > 15 ? 'critical' : 'warning'}
          />
          <HealthMetric
            label="Posts Hidden (month)"
            value={PLATFORM_HEALTH.postsHiddenThisMonth}
            icon={Eye}
            status="neutral"
          />
          <HealthMetric
            label="Active Suspensions"
            value={PLATFORM_HEALTH.userSuspensionsActive}
            icon={Users}
            status="neutral"
          />
        </div>
      </section>

      {/* Project status breakdown */}
      <section className="mb-8">
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="font-heading text-base font-semibold text-neutral-900 mb-4">Project Status Overview</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
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

      {/* Action items */}
      <section className="mb-6">
        <div className="rounded-xl border border-danger-200 bg-danger-50 p-5">
          <h2 className="font-heading text-sm font-semibold text-danger-800 mb-3">
            🔴 Action Required
          </h2>
          <ul className="space-y-2 text-sm text-danger-700">
            {PLATFORM_HEALTH.unacknowledgedOver5Days > 0 && (
              <li className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                {PLATFORM_HEALTH.unacknowledgedOver5Days} grievances unacknowledged for &gt;5 days
              </li>
            )}
            {PLATFORM_HEALTH.projectsNeedingSync > 20 && (
              <li className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                {PLATFORM_HEALTH.projectsNeedingSync} projects overdue for RERA sync
              </li>
            )}
            {PLATFORM_HEALTH.verificationQueuePending > 30 && (
              <li className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                {PLATFORM_HEALTH.verificationQueuePending} verification requests pending
              </li>
            )}
          </ul>
        </div>
      </section>

      <DataDisclaimer lastUpdated="28 Apr 2025" extraNote="Admin analytics reflect platform data only, not external MahaRERA records." />
    </div>
  )
}
