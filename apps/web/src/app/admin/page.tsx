import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Dashboard' }

// TODO: Replace with real data from API
const mockStats = {
  unacknowledgedGrievances: 12,
  verificationsPending: 47,
  moderationReports: 8,
  reraOverdue: 23,
  totalUsers: 8432,
  verifiedBuyers: 2109,
  totalGrievances: 1243,
  newUsersThisMonth: 234,
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">Platform Dashboard</h2>
        <p className="text-neutral-500 text-sm mt-1">
          {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })} — Logged in as admin@rewebportal.in
        </p>
      </div>

      {/* Immediate action items */}
      <section>
        <h3 className="text-base font-semibold text-red-700 mb-3">⚠️ Immediate Action Required</h3>
        <div className="space-y-2">
          {mockStats.unacknowledgedGrievances > 0 && (
            <ActionBanner
              severity="red"
              label={`${mockStats.unacknowledgedGrievances} unacknowledged grievances (>2 days old)`}
              href="/admin/grievances"
            />
          )}
          {mockStats.verificationsPending > 0 && (
            <ActionBanner
              severity="amber"
              label={`${mockStats.verificationsPending} buyer verification requests pending`}
              href="/admin/verification"
            />
          )}
          {mockStats.moderationReports > 0 && (
            <ActionBanner
              severity="amber"
              label={`${mockStats.moderationReports} moderation reports in queue`}
              href="/admin/moderation"
            />
          )}
          {mockStats.reraOverdue > 0 && (
            <ActionBanner
              severity="blue"
              label={`${mockStats.reraOverdue} projects due for RERA sync (>30 days)`}
              href="/admin/rera-sync"
            />
          )}
        </div>
      </section>

      {/* Platform stats */}
      <section>
        <h3 className="text-base font-semibold text-neutral-700 mb-3">Platform Stats — This Month</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Users" value={mockStats.totalUsers.toLocaleString('en-IN')} />
          <StatCard label="Verified Buyers" value={mockStats.verifiedBuyers.toLocaleString('en-IN')} />
          <StatCard label="Total Grievances" value={mockStats.totalGrievances.toLocaleString('en-IN')} />
          <StatCard label="New Users (Month)" value={mockStats.newUsersThisMonth.toLocaleString('en-IN')} />
        </div>
      </section>

      {/* Quick links */}
      <section>
        <h3 className="text-base font-semibold text-neutral-700 mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <QuickLink href="/admin/projects" label="+ Add Project" />
          <QuickLink href="/admin/projects" label="Publish Queue" />
          <QuickLink href="/admin/rera-sync" label="RERA Sync Queue" />
          <QuickLink href="/admin/verification" label="Pending Verifications" />
        </div>
      </section>
    </div>
  )
}

function ActionBanner({ severity, label, href }: { severity: 'red' | 'amber' | 'blue'; label: string; href: string }) {
  const colors = {
    red: 'bg-red-50 border-red-200 text-red-800',
    amber: 'bg-amber-50 border-amber-200 text-amber-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
  }

  return (
    <div className={`flex items-center justify-between px-4 py-3 border rounded-lg ${colors[severity]}`}>
      <span className="text-sm font-medium">{label}</span>
      <Link href={href} className="text-xs font-semibold underline ml-4 shrink-0">
        Review →
      </Link>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-4">
      <p className="text-2xl font-bold text-neutral-900">{value}</p>
      <p className="text-sm text-neutral-500 mt-1">{label}</p>
    </div>
  )
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
    >
      {label}
    </Link>
  )
}
