import type { Metadata } from 'next'
import Link from 'next/link'
import { Bell, AlertCircle, AlertTriangle, MessageSquare } from 'lucide-react'

export const metadata: Metadata = { title: 'Alerts' }

const MOCK_ALERTS = [
  {
    id: 'a1',
    type: 'danger' as const,
    icon: AlertCircle,
    title: 'New Red Flag: Lodha Palava City',
    message: 'RERA registration extended to Jun 2026. Possession delay now 18 months.',
    time: '2 hours ago',
    href: '/projects/lodha-palava-city-dombivli',
  },
  {
    id: 'a2',
    type: 'warning' as const,
    icon: AlertTriangle,
    title: 'Grievance Update: GRV-2025-0142',
    message: 'Your complaint on Lodha Palava City has been acknowledged by our team.',
    time: '1 day ago',
    href: '/dashboard/my-grievances',
  },
  {
    id: 'a3',
    type: 'info' as const,
    icon: MessageSquare,
    title: 'Community Activity',
    message: '12 new posts in Lodha Palava City community since your last visit.',
    time: '2 days ago',
    href: '/projects/lodha-palava-city-dombivli?tab=community',
  },
]

const alertStyles = {
  danger: 'border-danger-200 bg-danger-50',
  warning: 'border-warning-200 bg-warning-50',
  info: 'border-info-200 bg-info-50',
}

const iconStyles = {
  danger: 'text-danger-500',
  warning: 'text-warning-500',
  info: 'text-info-500',
}

export default function AlertsPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-neutral-900">Alerts</h1>
        <span className="rounded-full bg-danger-100 px-3 py-1 text-xs font-semibold text-danger-700">
          {MOCK_ALERTS.length} new
        </span>
      </div>

      <div className="space-y-3">
        {MOCK_ALERTS.map((alert) => (
          <Link
            key={alert.id}
            href={alert.href}
            className={`flex items-start gap-4 rounded-xl border p-4 hover:shadow-sm transition-all ${alertStyles[alert.type]}`}
          >
            <alert.icon className={`h-5 w-5 mt-0.5 shrink-0 ${iconStyles[alert.type]}`} aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-neutral-900">{alert.title}</p>
              <p className="text-sm text-neutral-700 mt-0.5">{alert.message}</p>
              <p className="text-xs text-neutral-400 mt-1">{alert.time}</p>
            </div>
          </Link>
        ))}
      </div>

      {MOCK_ALERTS.length === 0 && (
        <div className="rounded-xl border border-neutral-200 bg-white p-10 text-center">
          <Bell className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
          <p className="font-semibold text-neutral-700">No alerts yet</p>
          <p className="text-sm text-neutral-500 mt-1">
            Link projects to receive red flag alerts and grievance updates.
          </p>
        </div>
      )}
    </div>
  )
}
