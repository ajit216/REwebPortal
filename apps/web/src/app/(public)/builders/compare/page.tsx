import type { Metadata } from 'next'
import Link from 'next/link'
import { Building, CheckCircle, XCircle, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TransparencyScoreBadge } from '@/components/project/transparency-score-badge'
import { getScoreCircleColor, gradeLabel } from '@/lib/utils'
import { BUILDERS, BUILDER_SCORECARDS } from '@/data/mock'

export const metadata: Metadata = {
  title: 'Compare Builders',
  description: 'Side-by-side comparison of builder transparency scorecards for Mumbai & Thane residential builders.',
}

// Default to top 3 by score for the compare page
const DEFAULT_BUILDERS = [...BUILDERS]
  .sort((a, b) => (b.transparencyScore ?? 0) - (a.transparencyScore ?? 0))
  .slice(0, 3)

const BREAKDOWN_LABELS: Record<string, string> = {
  reraCompliance: 'RERA Compliance',
  deliveryTrack: 'Delivery Track Record',
  grievanceRate: 'Grievance Rate',
  transparency: 'Information Transparency',
  buyerSentiment: 'Buyer Sentiment',
}

export default function BuilderComparePage() {
  const builders = DEFAULT_BUILDERS
  const scorecards = builders.map((b) => BUILDER_SCORECARDS[b.id])

  const rows = [
    {
      label: 'Transparency Score',
      render: (b: typeof builders[0], i: number) => {
        const scorecard = scorecards[i]
        if (!scorecard) return <span className="text-neutral-400">N/A</span>
        return (
          <div className="flex justify-center">
            <TransparencyScoreBadge score={scorecard.overallScore} grade={scorecard.grade} size="md" />
          </div>
        )
      },
    },
    {
      label: 'Total Projects',
      render: (b: typeof builders[0]) => (
        <span className="font-semibold text-neutral-800">{b.totalProjects}</span>
      ),
    },
    {
      label: 'Delayed Projects',
      render: (b: typeof builders[0]) => (
        <span className={`font-semibold ${b.delayedProjects > 3 ? 'text-danger-600' : 'text-warning-600'}`}>
          {b.delayedProjects}
        </span>
      ),
    },
    {
      label: 'Avg Delay',
      render: (b: typeof builders[0]) => (
        <span className={`font-semibold ${(b.avgDelayMonths ?? 0) > 6 ? 'text-danger-600' : 'text-neutral-700'}`}>
          {b.avgDelayMonths ? `${b.avgDelayMonths} months` : '—'}
        </span>
      ),
    },
    {
      label: 'Total Grievances',
      render: (b: typeof builders[0]) => (
        <span className={`font-semibold ${b.totalGrievances > 150 ? 'text-danger-600' : 'text-neutral-700'}`}>
          {b.totalGrievances}
        </span>
      ),
    },
  ]

  const breakdownKeys = ['reraCompliance', 'deliveryTrack', 'grievanceRate', 'transparency', 'buyerSentiment'] as const

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-neutral-500">
        <ol className="flex items-center gap-1">
          <li><Link href="/" className="hover:text-neutral-700">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/builders" className="hover:text-neutral-700">Builders</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-neutral-900 font-medium" aria-current="page">Compare</li>
        </ol>
      </nav>

      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold text-neutral-900">Compare Builders</h1>
        <p className="text-neutral-600 mt-1">
          Side-by-side comparison of the top-rated builders in Mumbai & Thane
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full min-w-[600px]">
          {/* Builder headers */}
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="p-5 text-left text-sm font-semibold text-neutral-500 w-48">Metric</th>
              {builders.map((builder) => (
                <th key={builder.id} className="p-5 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100">
                      <Building className="h-6 w-6 text-neutral-400" aria-hidden="true" />
                    </div>
                    <Link
                      href={`/builders/${builder.slug}`}
                      className="font-heading text-sm font-semibold text-neutral-900 hover:text-primary-600 transition-colors"
                    >
                      {builder.name}
                    </Link>
                    {builder.establishedYear && (
                      <span className="text-xs text-neutral-400">Est. {builder.establishedYear}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-100">
            {/* Overview rows */}
            {rows.map((row) => (
              <tr key={row.label} className="hover:bg-neutral-50">
                <td className="p-5 text-sm font-medium text-neutral-700">{row.label}</td>
                {builders.map((builder, i) => (
                  <td key={builder.id} className="p-5 text-center text-sm">
                    {row.render(builder, i)}
                  </td>
                ))}
              </tr>
            ))}

            {/* Scorecard breakdown header */}
            <tr className="bg-neutral-50">
              <td colSpan={builders.length + 1} className="px-5 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                Scorecard Breakdown
              </td>
            </tr>

            {/* Breakdown rows */}
            {breakdownKeys.map((key) => (
              <tr key={key} className="hover:bg-neutral-50">
                <td className="p-5 text-sm font-medium text-neutral-700">
                  <div>
                    {BREAKDOWN_LABELS[key]}
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {key === 'reraCompliance' && '30% weight'}
                      {key === 'deliveryTrack' && '25% weight'}
                      {key === 'grievanceRate' && '20% weight'}
                      {key === 'transparency' && '15% weight'}
                      {key === 'buyerSentiment' && '10% weight'}
                    </p>
                  </div>
                </td>
                {builders.map((builder, i) => {
                  const sc = scorecards[i]
                  if (!sc) return <td key={builder.id} className="p-5 text-center text-neutral-400">—</td>
                  const val = sc.breakdown[key]
                  const color = getScoreCircleColor(val.score)
                  return (
                    <td key={builder.id} className="p-5 text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="text-sm font-bold" style={{ color }}>{val.score}/100</span>
                        <div className="w-24 h-1.5 rounded-full bg-neutral-200 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${val.score}%`, backgroundColor: color }}
                          />
                        </div>
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 rounded-xl bg-neutral-50 border border-neutral-200 p-4 text-xs text-neutral-500">
        ⚠️ Transparency scores are computed from publicly available RERA data and buyer-reported information. 
        They reflect data transparency and compliance patterns — not an editorial opinion or financial recommendation.
        Showing top 3 builders by score. <Link href="/builders" className="text-primary-500 hover:underline">View all builders →</Link>
      </div>

      <div className="mt-6 flex justify-center">
        <Button variant="outline" asChild>
          <Link href="/builders">← Back to Builder Directory</Link>
        </Button>
      </div>
    </div>
  )
}
