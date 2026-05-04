import type { Metadata } from 'next'
import Link from 'next/link'
import { BuilderCard } from '@/components/builder/builder-card'
import { BUILDERS } from '@/data/mock'

export const metadata: Metadata = {
  title: 'Builder Directory',
  description: 'Transparency scorecards and track records for reputed residential builders in Mumbai and Thane.',
}

export default function BuildersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold text-neutral-900">Builder Directory</h1>
        <p className="text-neutral-600 mt-1">
          Transparency scorecards for {BUILDERS.length} reputed builders in Mumbai & Thane
        </p>
      </div>

      {/* Compare CTA */}
      <div className="mb-6 rounded-xl border border-primary-200 bg-primary-50 p-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary-800">Compare Builders Side-by-Side</p>
          <p className="text-xs text-primary-600 mt-0.5">Select up to 3 builders and compare their scorecards</p>
        </div>
        <Link
          href="/builders/compare"
          className="shrink-0 rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 transition-colors"
        >
          Compare →
        </Link>
      </div>

      {/* Sort by score */}
      <div className="mb-4 text-sm text-neutral-500">
        Sorted by transparency score (highest first)
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[...BUILDERS]
          .sort((a, b) => (b.transparencyScore ?? 0) - (a.transparencyScore ?? 0))
          .map((builder) => (
            <BuilderCard key={builder.id} builder={builder} />
          ))}
      </div>
    </div>
  )
}
