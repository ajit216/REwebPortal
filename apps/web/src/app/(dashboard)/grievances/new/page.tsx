import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'
import { DataDisclaimer } from '@/components/shared/data-disclaimer'
import NewGrievanceClient from './grievance-client'

export const metadata: Metadata = {
  title: 'File a Grievance',
  description: 'File a formal complaint against your builder with REwebPortal. Your description stays private — only aggregated patterns are published.',
}

export default function NewGrievancePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link */}
      <nav className="mb-6" aria-label="Breadcrumb">
        <Link
          href="/my-grievances"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          My Grievances
        </Link>
      </nav>

      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-neutral-900">File a Grievance</h1>
        <p className="text-neutral-600 mt-1 text-sm">
          Formally document your complaint. Your description is private — only aggregated patterns are
          shown publicly to protect your privacy while maintaining transparency.
        </p>
      </div>

      {/* Privacy trust signal */}
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-success-200 bg-success-50 px-4 py-3">
        <Shield className="h-4 w-4 text-success-600 shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-xs text-success-800">
          <strong>Privacy protected:</strong> Your grievance description and evidence are encrypted and
          visible only to you and platform admins. Public pages only show complaint categories and counts.
        </p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <Suspense fallback={<div className="py-8 text-center text-neutral-500 text-sm">Loading…</div>}>
          <NewGrievanceClient />
        </Suspense>
      </div>

      <div className="mt-6">
        <DataDisclaimer lastUpdated="May 2025" />
      </div>
    </div>
  )
}
