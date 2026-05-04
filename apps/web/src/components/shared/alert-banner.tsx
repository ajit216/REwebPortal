'use client'

import { useState } from 'react'
import { AlertTriangle, Info, AlertCircle, X } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface AlertBannerProps {
  type: 'info' | 'warning' | 'danger'
  message: string
  linkLabel?: string
  linkHref?: string
  dismissible?: boolean
}

export function AlertBanner({ type, message, linkLabel, linkHref, dismissible = true }: AlertBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  const styles = {
    info: 'bg-info-50 border-info-500 text-info-700',
    warning: 'bg-warning-50 border-warning-500 text-warning-700',
    danger: 'bg-danger-50 border-danger-500 text-danger-700',
  }

  const Icon = type === 'danger' ? AlertCircle : type === 'warning' ? AlertTriangle : Info

  return (
    <div className={cn('border-b px-4 py-3', styles[type])} role="alert">
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{message}</span>
          {linkLabel && linkHref && (
            <Link href={linkHref} className="underline hover:no-underline ml-1">
              {linkLabel} →
            </Link>
          )}
        </div>
        {dismissible && (
          <button
            onClick={() => setDismissed(true)}
            className="rounded p-1 hover:bg-black/10 transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
