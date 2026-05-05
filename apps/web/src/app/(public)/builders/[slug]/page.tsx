import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Building, Globe, Calendar, TrendingDown, Flag } from 'lucide-react'
import { ScorecardBreakdown } from '@/components/builder/scorecard-breakdown'
import { ProjectCard } from '@/components/project/project-card'
import { DataDisclaimer } from '@/components/shared/data-disclaimer'
import { Button } from '@/components/ui/button'
import { BUILDERS, PROJECTS, RED_FLAGS, BUILDER_SCORECARDS } from '@/data/mock'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const builder = BUILDERS.find((b) => b.slug === params.slug)
  if (!builder) return { title: 'Builder Not Found' }
  return {
    title: `${builder.name} — Builder Profile & Scorecard`,
    description: `Transparency scorecard, project track record, and buyer grievances for ${builder.name} in Mumbai & Thane.`,
  }
}

export async function generateStaticParams() {
  return BUILDERS.map((b) => ({ slug: b.slug }))
}

export default function BuilderDetailPage({ params }: PageProps) {
  const builder = BUILDERS.find((b) => b.slug === params.slug)
  if (!builder) notFound()

  const builderProjects = PROJECTS.filter((p) => p.builderId === builder.id)
  const scorecard = BUILDER_SCORECARDS[builder.id]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-neutral-500">
        <ol className="flex items-center gap-1">
          <li><Link href="/" className="hover:text-neutral-700">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/builders" className="hover:text-neutral-700">Builders</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-neutral-900 font-medium" aria-current="page">{builder.name}</li>
        </ol>
      </nav>

      {/* Builder Header */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 lg:p-8 mb-6">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
            <Building className="h-8 w-8" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900">{builder.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-neutral-500">
              {builder.establishedYear && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                  Est. {builder.establishedYear}
                </span>
              )}
              {builder.website && (
                <a
                  href={builder.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary-500 hover:underline"
                >
                  <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                  Official Website
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Total Projects', value: builder.totalProjects.toString(), color: 'text-neutral-800' },
            {
              label: 'Delayed Projects',
              value: builder.delayedProjects.toString(),
              color: builder.delayedProjects > 3 ? 'text-danger-600' : 'text-warning-600',
            },
            {
              label: 'Avg Delay',
              value: builder.avgDelayMonths ? `${builder.avgDelayMonths} months` : '—',
              color: (builder.avgDelayMonths ?? 0) > 6 ? 'text-danger-600' : 'text-neutral-800',
            },
            {
              label: 'Total Grievances',
              value: builder.totalGrievances.toString(),
              color: builder.totalGrievances > 150 ? 'text-danger-600' : 'text-neutral-800',
            },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl bg-neutral-50 p-4">
              <p className={`font-heading text-xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-neutral-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Scorecard */}
          {scorecard ? (
            <ScorecardBreakdown scorecard={scorecard} />
          ) : (
            <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center text-neutral-500">
              Scorecard not yet available for this builder.
            </div>
          )}

          {/* Projects */}
          <div>
            <h2 className="font-heading text-lg font-semibold text-neutral-900 mb-4">
              Projects ({builderProjects.length})
            </h2>
            {builderProjects.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2">
                {builderProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    redFlags={RED_FLAGS[project.id] ?? []}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center text-neutral-500">
                No projects listed for this builder yet.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-5 space-y-3">
            <h3 className="font-heading text-sm font-semibold text-neutral-900">Quick Actions</h3>
            <Button className="w-full" asChild>
              <Link href={`/builders/${builder.slug}/track-record`}>Full Track Record →</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/builders/compare">Compare with Others</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href={`/projects?builder=${builder.slug}`}>All Projects →</Link>
            </Button>
          </div>
          <DataDisclaimer lastUpdated="28 Apr 2025" />
        </div>
      </div>
    </div>
  )
}
