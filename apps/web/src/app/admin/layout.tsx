// Admin Layout — wraps all /admin/* pages
// Auth check: only ADMIN or MODERATOR role can access
// Separate from the buyer-facing (dashboard) layout

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: { template: '%s | REwebPortal Admin', default: 'Admin Panel | REwebPortal' },
  robots: 'noindex, nofollow', // Admin pages must never appear in search engines
}

const adminNavLinks = [
  { href: '/admin', label: '📊 Dashboard' },
  { href: '/admin/projects', label: '🏗️ Projects' },
  { href: '/admin/rera-sync', label: '📋 RERA Sync' },
  { href: '/admin/grievances', label: '⚖️ Grievances' },
  { href: '/admin/verification', label: '✅ Verification' },
  { href: '/admin/moderation', label: '🛡️ Moderation' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // TODO: Add server-side auth check here using next-auth session
  // If session.user.role !== 'ADMIN' && !== 'MODERATOR' → redirect to /admin/login

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 text-neutral-100 flex flex-col fixed inset-y-0 left-0">
        <div className="p-6 border-b border-neutral-800">
          <p className="text-xs text-neutral-400 uppercase tracking-widest">REwebPortal</p>
          <h1 className="text-lg font-semibold mt-1">Admin Panel</h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {adminNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-3 py-2 rounded-md text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-neutral-800">
          <p className="text-xs text-neutral-500">Logged in as admin</p>
          <Link href="/admin/login" className="text-xs text-neutral-400 hover:text-white mt-1 block">
            Log out
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
