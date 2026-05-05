import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Building, RefreshCw, Flag, Eye, AlertTriangle, CheckCircle, LayoutDashboard } from 'lucide-react'

export const metadata: Metadata = { title: { default: 'Admin', template: '%s | Admin — REwebPortal' } }

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'Projects', icon: Building },
  { href: '/admin/rera-sync', label: 'RERA Sync', icon: RefreshCw },
  { href: '/admin/grievances', label: 'Grievances', icon: Flag },
  { href: '/admin/moderation', label: 'Moderation', icon: Eye },
  { href: '/admin/red-flags', label: 'Red Flags', icon: AlertTriangle },
  { href: '/admin/verifications', label: 'Verifications', icon: CheckCircle },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Admin top bar */}
      <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-neutral-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-500">
                <Shield className="h-4 w-4 text-white" aria-hidden="true" />
              </div>
              <span className="font-heading font-semibold text-sm">REwebPortal Admin</span>
            </div>
            <Link href="/" className="text-xs text-neutral-400 hover:text-white transition-colors">
              ← View Public Site
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <nav className="sticky top-20 space-y-0.5" aria-label="Admin navigation">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                >
                  <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main>{children}</main>
        </div>
      </div>
    </div>
  )
}
