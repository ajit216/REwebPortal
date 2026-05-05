import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, Download, ArrowLeft, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Legal Templates — Homebuyer Documents',
  description: 'Download ready-to-use legal notice templates, complaint formats, and document checklists for Maharashtra homebuyers.',
}

const TEMPLATES = [
  {
    id: 't1',
    title: 'Legal Notice to Builder — Possession Delay (Section 18)',
    description: 'Formal legal notice demanding compensation or refund for possession delay under Section 18 of RERA. Customize with your details and send via registered post.',
    format: 'DOCX',
    category: 'Legal Notice',
    variant: 'warning' as const,
  },
  {
    id: 't2',
    title: 'MahaRERA Complaint Template — Delayed Possession',
    description: 'Pre-formatted complaint for filing on the MahaRERA online portal. Includes all required fields and guidance notes.',
    format: 'DOCX',
    category: 'RERA Complaint',
    variant: 'danger' as const,
  },
  {
    id: 't3',
    title: 'Consumer Forum Complaint — Deficiency of Service',
    description: 'Complaint format for MSCDRC (Maharashtra State Consumer Disputes Redressal Commission). Suitable for possession delay, quality defects, and amenity shortfall claims.',
    format: 'DOCX',
    category: 'Consumer Forum',
    variant: 'info' as const,
  },
  {
    id: 't4',
    title: 'Builder Email/Letter Template — Status Inquiry',
    description: 'Professional letter requesting possession status update from your builder. Creates a paper trail for future legal proceedings.',
    format: 'DOCX',
    category: 'Builder Communication',
    variant: 'default' as const,
  },
  {
    id: 't5',
    title: 'Document Checklist — Before Booking a Property',
    description: 'Complete checklist of documents to verify before signing any real estate agreement in Maharashtra.',
    format: 'PDF',
    category: 'Due Diligence',
    variant: 'success' as const,
  },
  {
    id: 't6',
    title: 'Joint RERA Complaint — Group Buyer Format',
    description: 'Template for coordinating a group RERA complaint with multiple buyers. Stronger signal to RERA authorities.',
    format: 'DOCX',
    category: 'Group Action',
    variant: 'warning' as const,
  },
]

export default function TemplatesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-neutral-500">
        <ol className="flex items-center gap-1">
          <li><Link href="/legal" className="hover:text-neutral-700">Legal Library</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-neutral-900 font-medium" aria-current="page">Templates</li>
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-neutral-900">Legal Templates</h1>
        <p className="text-neutral-600 mt-1 max-w-2xl">
          Ready-to-use legal documents for Maharashtra homebuyers. Customize with your details before use.
        </p>
      </div>

      <div className="mb-6 rounded-xl bg-warning-50 border border-warning-200 p-4 text-sm text-warning-800">
        ⚠️ These templates are starting points only. Consult a qualified lawyer before sending legal notices or filing complaints. 
        REwebPortal does not provide legal advice.
      </div>

      <div className="space-y-4">
        {TEMPLATES.map((template) => (
          <div key={template.id} className="rounded-xl border border-neutral-200 bg-white p-5 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neutral-100">
              <FileText className="h-6 w-6 text-neutral-500" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div>
                  <h2 className="font-heading text-sm font-semibold text-neutral-900">{template.title}</h2>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant={template.variant}>{template.category}</Badge>
                    <span className="text-xs text-neutral-400">{template.format}</span>
                  </div>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <a href="#" download aria-label={`Download ${template.title}`}>
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </a>
                </Button>
              </div>
              <p className="mt-2 text-sm text-neutral-600">{template.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl bg-primary-50 border border-primary-200 p-5">
        <h2 className="font-heading text-sm font-semibold text-primary-900 mb-2">Need help filling these out?</h2>
        <p className="text-sm text-primary-700 mb-3">
          Connect with a RERA-specialised lawyer in Mumbai or Thane for personalized assistance.
        </p>
        <Button size="sm" asChild>
          <Link href="/legal/experts">Find an Expert →</Link>
        </Button>
      </div>

      <div className="mt-6">
        <Button variant="outline" asChild>
          <Link href="/legal">
            <ArrowLeft className="h-4 w-4" />
            Back to Legal Library
          </Link>
        </Button>
      </div>
    </div>
  )
}
