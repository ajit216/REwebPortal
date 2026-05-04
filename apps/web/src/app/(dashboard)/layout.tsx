import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'
import Link from 'next/link'
import { LayoutDashboard, Building, Flag, Bell, Shield, User } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard/my-projects', label: 'My Projects', icon: Building },
  { href: '/dashboard/my-grievances', label: 'My Grievances', icon: Flag },
  { href: '/dashboard/alerts', label: 'Alerts', icon: Bell },
  { href: '/dashboard/verify', label: 'Verify Ownership', icon: Shield },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24 space-y-1" aria-label="Dashboard navigation">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
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
      <Footer />
    </>
  )
}
