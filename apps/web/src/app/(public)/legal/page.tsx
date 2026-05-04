import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, Clock, ArrowRight } from 'lucide-react'
import { LEGAL_RESOURCES } from '@/data/mock'

export const metadata: Metadata = {
  title: 'Legal Resource Library',
  description: 'Know your rights as a homebuyer in Maharashtra. RERA rights, consumer forum guides, legal notice templates, and expert directory.',
}

const CATEGORY_LABELS: Record<string, string> = {
  RERA_RIGHTS: 'RERA Rights',
  CONSUMER_FORUM: 'Consumer Forum',
  SAMPLE_NOTICES: 'Sample Notices',
  COURT_PROCEDURES: 'Court Procedures',
  GLOSSARY: 'Glossary',
  FAQ: 'FAQ',
}

const CATEGORY_COLORS: Record<string, string> = {
  RERA_RIGHTS: 'bg-primary-50 text-primary-700 border-primary-200',
  CONSUMER_FORUM: 'bg-success-50 text-success-700 border-success-200',
  SAMPLE_NOTICES: 'bg-warning-50 text-warning-700 border-warning-200',
  COURT_PROCEDURES: 'bg-danger-50 text-danger-700 border-danger-200',
  GLOSSARY: 'bg-neutral-100 text-neutral-700 border-neutral-200',
  FAQ: 'bg-info-50 text-info-700 border-info-200',
}

export default function LegalPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-neutral-900">Legal Resource Library</h1>
        <p className="text-neutral-600 mt-1 max-w-2xl">
          Know your rights as a homebuyer in Maharashtra. Plain-language guides, RERA rights, consumer forum procedures, and downloadable templates.
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <span
            key={key}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${CATEGORY_COLORS[key]}`}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Resources grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {LEGAL_RESOURCES.map((resource) => (
          <Link
            key={resource.id}
            href={`/legal/${resource.slug}`}
            className="group rounded-xl border border-neutral-200 bg-white p-6 hover:shadow-md hover:border-primary-200 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${CATEGORY_COLORS[resource.category] ?? ''}`}>
                {CATEGORY_LABELS[resource.category]}
              </span>
              <span className="flex items-center gap-1 text-xs text-neutral-400">
                <Clock className="h-3 w-3" aria-hidden="true" />
                {resource.readingTimeMinutes} min
              </span>
            </div>
            <h2 className="font-heading text-sm font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
              {resource.title}
            </h2>
            <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed mb-4">
              {resource.summary}
            </p>
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>Published {resource.publishedAt}</span>
              <span className="flex items-center gap-1 text-primary-500 group-hover:gap-2 transition-all font-medium">
                Read <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Expert Network CTA */}
      <div className="mt-10 rounded-2xl bg-primary-900 text-white p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="font-heading text-xl font-bold mb-2">Need Expert Legal Help?</h2>
            <p className="text-primary-200 text-sm max-w-md">
              Connect with RERA-specialised lawyers and property consultants in Mumbai & Thane.
              Initial 15-minute consultation available.
            </p>
          </div>
          <Link
            href="/legal/experts"
            className="shrink-0 rounded-xl bg-white text-primary-700 px-6 py-3 text-sm font-semibold hover:bg-primary-50 transition-colors"
          >
            Find an Expert →
          </Link>
        </div>
      </div>
    </div>
  )
}
