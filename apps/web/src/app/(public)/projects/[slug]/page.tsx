import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, ExternalLink, Building, Users, Flag } from 'lucide-react'
import { TransparencyScoreBadge } from '@/components/project/transparency-score-badge'
import { ProjectStatusBadge } from '@/components/project/project-status-badge'
import { ProjectStatsRow } from '@/components/project/project-stats-row'
import { RedFlagAlert } from '@/components/project/red-flag-alert'
import { ProjectTabs } from '@/components/project/project-tabs'
import { DataDisclaimer } from '@/components/shared/data-disclaimer'
import { Button } from '@/components/ui/button'
import { formatPriceRange } from '@/lib/utils'
import {
  PROJECTS,
  RERA_RECORDS,
  TIMELINES,
  RED_FLAGS,
  THREADS,
  GRIEVANCE_CATEGORY_SUMMARY,
} from '@/data/mock'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = PROJECTS.find((p) => p.slug === params.slug)
  if (!project) return { title: 'Project Not Found' }
  return {
    title: `${project.name} — ${project.builderName}`,
    description: `RERA status, transparency score, buyer grievances and community for ${project.name} by ${project.builderName} in ${project.locality}, ${project.city}.`,
  }
}

export async function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }))
}

export default function ProjectDetailPage({ params }: PageProps) {
  const project = PROJECTS.find((p) => p.slug === params.slug)
  if (!project) notFound()

  const reraRecord = RERA_RECORDS[project.id]
  const timeline = TIMELINES[project.id] ?? []
  const redFlags = RED_FLAGS[project.id] ?? []
  const threads = THREADS.slice(0, 4)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-neutral-500">
        <ol className="flex items-center gap-1 flex-wrap">
          <li><Link href="/" className="hover:text-neutral-700">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/projects" className="hover:text-neutral-700">Projects</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-neutral-900 font-medium" aria-current="page">{project.name}</li>
        </ol>
      </nav>

      {/* PROJECT HEADER */}
      <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden mb-6">
        {project.coverImageUrl && (
          <div className="relative h-56 sm:h-72 bg-neutral-200">
            <Image
              src={project.coverImageUrl}
              alt={`${project.name} project`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>
        )}

        <div className="p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <ProjectStatusBadge
                status={project.status}
                reraStatus={reraRecord?.status}
              />
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900 mt-3">
                {project.name}
              </h1>
              <p className="text-neutral-600 mt-1">
                by{' '}
                <span className="font-semibold text-primary-600">{project.builderName}</span>
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-neutral-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  {project.locality}, {project.city}
                </span>
                <span className="font-mono text-xs">
                  📋 {project.reraNumber}
                </span>
              </div>
            </div>
            {project.transparencyScore !== null && project.transparencyGrade !== null && (
              <div className="flex flex-col items-center">
                <TransparencyScoreBadge
                  score={project.transparencyScore}
                  grade={project.transparencyGrade}
                  size="lg"
                  showLabel
                />
              </div>
            )}
          </div>

          <div className="mt-6">
            <ProjectStatsRow
              totalUnits={project.totalUnits}
              delayMonths={project.delayMonths}
              openGrievances={project.openGrievances}
              verifiedBuyerCount={project.verifiedBuyerCount}
            />
          </div>

          {redFlags.length > 0 && (
            <div className="mt-6">
              <RedFlagAlert flags={redFlags} />
            </div>
          )}
        </div>
      </div>

      {/* Main content — sidebar layout */}
      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          {project.description && (
            <div className="rounded-xl border border-neutral-200 bg-white p-6">
              <h2 className="font-heading text-base font-semibold text-neutral-900 mb-3">About This Project</h2>
              <p className="text-sm text-neutral-700 leading-relaxed">{project.description}</p>
            </div>
          )}

          {/* Unit Types */}
          {project.units.length > 0 && (
            <div className="rounded-xl border border-neutral-200 bg-white p-6">
              <h2 className="font-heading text-base font-semibold text-neutral-900 mb-4">Unit Types & Pricing</h2>
              <div className="divide-y divide-neutral-100">
                {project.units.map((unit) => (
                  <div key={unit.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-semibold text-neutral-800">{unit.bhkType}</p>
                      <p className="text-xs text-neutral-500">{unit.carpetAreaSqft} sq ft carpet</p>
                    </div>
                    <p className="text-sm font-semibold text-neutral-700">
                      {formatPriceRange(unit.priceLow, unit.priceHigh)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-5 space-y-3">
            <h3 className="font-heading text-sm font-semibold text-neutral-900">Quick Actions</h3>
            <Button className="w-full" asChild>
              <Link href="/login?next=/grievances/new">
                <Flag className="h-4 w-4" />
                File a Grievance
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/login?next=/dashboard/verify">
                <Users className="h-4 w-4" />
                Join Community
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/login?next=/dashboard/verify">
                <Building className="h-4 w-4" />
                Verify Ownership
              </Link>
            </Button>
          </div>

          {reraRecord && (
            <div className="rounded-xl border border-neutral-200 bg-white p-5">
              <h3 className="font-heading text-sm font-semibold text-neutral-900 mb-3">RERA Quick Info</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <dt className="text-neutral-500 shrink-0">Number</dt>
                  <dd className="font-mono font-medium text-neutral-800 text-xs text-right">{reraRecord.reraNumber}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-neutral-500">Status</dt>
                  <dd className="font-medium text-neutral-800">{reraRecord.status}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-neutral-500">Works Done</dt>
                  <dd className="font-medium text-neutral-800">{reraRecord.worksCompletedPct}%</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-neutral-500">Deadline</dt>
                  <dd className="font-medium text-neutral-800">{reraRecord.currentDeadline}</dd>
                </div>
              </dl>
              <a
                href="https://maharera.mahaonline.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center gap-1 text-xs text-primary-500 hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                View on MahaRERA
              </a>
            </div>
          )}

          <DataDisclaimer lastUpdated="28 Apr 2025" />
        </div>
      </div>

      {/* Tabs section */}
      <ProjectTabs
        projectSlug={project.slug}
        reraRecord={reraRecord}
        timeline={timeline}
        threads={threads}
        openGrievances={project.openGrievances}
        grievanceCategorySummary={GRIEVANCE_CATEGORY_SUMMARY}
      />
    </div>
  )
}
