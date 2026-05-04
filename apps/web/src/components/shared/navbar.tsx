'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Shield, Menu, X, ChevronDown, Bell, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-heading font-bold text-neutral-900">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg">REwebPortal</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
            <Link href="/projects" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
              Projects
            </Link>
            <Link href="/builders" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
              Builders
            </Link>
            <Link href="/analytics" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
              Analytics
            </Link>
            <Link href="/legal" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
              Legal
            </Link>
            <Link href="/tools/delay-calculator" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
              Tools
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">Register</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="rounded-md p-2 text-neutral-600 hover:bg-neutral-100 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t border-neutral-200 bg-white md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-3" aria-label="Mobile navigation">
            {[
              { href: '/projects', label: 'Projects' },
              { href: '/builders', label: 'Builders' },
              { href: '/analytics', label: 'Analytics' },
              { href: '/legal', label: 'Legal' },
              { href: '/tools/delay-calculator', label: 'Tools' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2 border-t border-neutral-200 pt-3">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link href="/login" onClick={() => setMobileOpen(false)}>Login</Link>
              </Button>
              <Button size="sm" className="flex-1" asChild>
                <Link href="/register" onClick={() => setMobileOpen(false)}>Register</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
