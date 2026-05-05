import type { Metadata } from 'next'
import Link from 'next/link'
import { Calculator, Scale, FileSearch, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Homebuyer Tools',
  description: 'Free tools for Mumbai & Thane homebuyers — delay compensation calculator, buyer checklist, and more.',
}

const TOOLS = [
  {
    href: '/tools/delay-calculator',
    icon: Calculator,
    title: 'RERA Delay Compensation Calculator',
    description:
      'Estimate the compensation you may be entitled to under Section 18 of RERA. Enter the amount paid and delay months to see your monthly interest entitlement.',
    badge: 'Free',
    badgeColor: 'bg-success-50 text-success-700 border-success-200',
  },
  {
    href: '/legal',
    icon: Scale,
    title: 'Legal Resource Library',
    description:
      'Plain-language legal guides for Maharashtra homebuyers — RERA rights, consumer forum procedures, sample legal notices, and court timelines.',
    badge: 'Legal',
    badgeColor: 'bg-primary-50 text-primary-700 border-primary-200',
  },
  {
    href: '/projects',
    icon: FileSearch,
    title: 'Project Due Diligence',
    description:
      'Check any residential project\'s RERA compliance, transparency score, delay history, and grievance pattern before you buy or after you\'ve booked.',
    badge: 'Research',
    badgeColor: 'bg-info-50 text-info-700 border-info-200',
  },
]

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="font-heading text-3xl font-bold text-neutral-900">Homebuyer Tools</h1>
        <p className="text-neutral-600 mt-2 max-w-xl">
          Free resources to help Mumbai & Thane homebuyers make informed decisions and protect their
          investment.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group flex flex-col rounded-xl border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-primary-200 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50">
                <tool.icon className="h-5 w-5 text-primary-600" aria-hidden="true" />
              </div>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${tool.badgeColor}`}
              >
                {tool.badge}
              </span>
            </div>

            <h2 className="font-heading text-base font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors mb-2">
              {tool.title}
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed flex-1">{tool.description}</p>

            <div className="mt-5 flex items-center gap-1 text-sm font-medium text-primary-600">
              Open tool
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </div>
          </Link>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-10 rounded-xl bg-neutral-50 border border-neutral-200 p-5">
        <p className="text-sm text-neutral-600">
          <strong>Disclaimer:</strong> The tools and resources on this page are for informational
          purposes only. Results from the delay compensation calculator are indicative estimates
          based on Section 18 of RERA and are not legal advice. Consult a qualified advocate before
          filing legal notices or pursuing formal action.
        </p>
      </div>
    </div>
  )
}
