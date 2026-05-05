import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Building,
  RefreshCw,
  Shield,
  Flag,
  AlertTriangle,
  Users,
  Eye,
  CheckCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PROJECTS, BUILDERS, ANALYTICS_STATS } from '@/data/mock'

export const metadata: Metadata = { title: 'Admin Dashboard' }

const QUICK_STATS = [
  { label: 'Total Projects', value: ANALYTICS_STATS.totalProjects, icon: Building, color: 'text-primary-500', bg: 'bg-primary-50' },
  { label: 'Active Grievances', value: ANALYTICS_STATS.activeGrievances, icon: Flag, color: 'text-warning-500', bg: 'bg-warning-50' },
  { label: 'Delayed / Stalled', value: (ANALYTICS_STATS.byStatus.DELAYED || 0) + (ANALYTICS_STATS.byStatus.STALLED || 0), icon: AlertTriangle, color: 'text-danger-500', bg: 'bg-danger-50' },
  { label: 'Total Builders', value: BUILDERS.length, icon: Users, color: 'text-success-500', bg: 'bg-success-50' },
]

const ADMIN_SECTIONS = [
  { href: '/admin/projects', icon: Building, label: 'Manage Projects', desc: 'Edit project details, sync RERA data, add timelines' },
  { href: '/admin/rera-sync', icon: RefreshCw, label: 'RERA Sync Queue', desc: 'Review and approve MahaRERA data syncs' },
  { href: '/admin/grievances', icon: Flag, label: 'Grievance Queue', desc: 'Review, acknowledge and escalate complaints' },
  { href: '/admin/moderation', icon: Eye, label: 'Moderation Queue', desc: 'Review flagged community posts' },
  { href: '/admin/red-flags', icon: AlertTriangle, label: 'Red Flag Candidates', desc: 'Review and publish auto-detected red flags' },
  { href: '/admin/verifications', icon: CheckCircle, label: 'Verification Queue', desc: 'Review buyer ownership verification requests' },
]

export default function AdminDashboardPage() {
  const projectsNeedingSync = PROJECTS.filter((p) => !['COMPLETED', 'READY_TO_MOVE'].includes(p.status))

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-5 w-5 text-primary-500" />
            <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">Admin Portal</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-neutral-900">Dashboard</h1>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/">View Public Site →</Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
        {QUICK_STATS.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.bg} mb-3`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} aria-hidden="true" />
            </div>
            <p className={`font-heading text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-neutral-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Action Sections */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {ADMIN_SECTIONS.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group rounded-xl border border-neutral-200 bg-white p-5 hover:shadow-md hover:border-primary-200 transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50">
                <section.icon className="h-5 w-5 text-primary-500" aria-hidden="true" />
              </div>
              <h2 className="font-heading text-sm font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                {section.label}
              </h2>
            </div>
            <p className="text-xs text-neutral-500">{section.desc}</p>
          </Link>
        ))}
      </div>

      {/* Projects Needing Attention */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="font-heading text-base font-semibold text-neutral-900 mb-4">
          Projects Needing RERA Sync ({projectsNeedingSync.length})
        </h2>
        <div className="divide-y divide-neutral-100">
          {projectsNeedingSync.slice(0, 5).map((project) => (
            <div key={project.id} className="py-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-neutral-800">{project.name}</p>
                <p className="text-xs text-neutral-500">{project.builderName} · RERA: {project.reraNumber}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${
                  ['DELAYED', 'STALLED'].includes(project.status)
                    ? 'bg-danger-50 text-danger-700'
                    : 'bg-info-50 text-info-700'
                }`}>
                  {project.status.replace(/_/g, ' ')}
                </span>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/admin/rera-sync?project=${project.id}`}>
                    <RefreshCw className="h-3 w-3" />
                    Sync
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
        {projectsNeedingSync.length > 5 && (
          <p className="mt-3 text-xs text-neutral-400 text-center">
            +{projectsNeedingSync.length - 5} more projects. <Link href="/admin/projects" className="text-primary-500 hover:underline">View all →</Link>
          </p>
        )}
      </div>
    </div>
  )
}
