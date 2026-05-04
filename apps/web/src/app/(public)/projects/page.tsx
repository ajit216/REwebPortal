import type { Metadata } from 'next'
import Link from 'next/link'
import { SlidersHorizontal } from 'lucide-react'
import { ProjectCard } from '@/components/project/project-card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PROJECTS, RED_FLAGS } from '@/data/mock'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Project Directory',
  description: 'Browse all residential projects in Mumbai and Thane with RERA compliance, transparency scores, and buyer grievances.',
}

export default function ProjectsPage({
  searchParams,
}: {
  searchParams: { status?: string; city?: string; q?: string }
}) {
  let filtered = PROJECTS

  if (searchParams.city) {
    filtered = filtered.filter((p) => p.city.toLowerCase() === searchParams.city!.toLowerCase())
  }
  if (searchParams.status) {
    const statuses = searchParams.status.split(',')
    filtered = filtered.filter((p) => statuses.includes(p.status))
  }
  if (searchParams.q) {
    const q = searchParams.q.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.builderName.toLowerCase().includes(q) ||
        p.locality.toLowerCase().includes(q) ||
        p.reraNumber.toLowerCase().includes(q)
    )
  }

  const statusCounts = PROJECTS.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold text-neutral-900">Project Directory</h1>
        <p className="text-neutral-600 mt-1">
          {filtered.length} residential projects in Mumbai & Thane
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <form method="GET" className="flex flex-wrap gap-3 w-full">
          <input
            name="q"
            type="search"
            placeholder="Search projects, builders, RERA…"
            defaultValue={searchParams.q}
            className="flex-1 min-w-48 h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <select
            name="city"
            defaultValue={searchParams.city ?? ''}
            className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Cities</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Thane">Thane</option>
          </select>
          <select
            name="status"
            defaultValue={searchParams.status ?? ''}
            className="h-10 rounded-lg border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Statuses</option>
            <option value="UNDER_CONSTRUCTION">Under Construction</option>
            <option value="NEARING_COMPLETION">Nearing Completion</option>
            <option value="READY_TO_MOVE">Ready to Move</option>
            <option value="DELAYED">Delayed</option>
            <option value="STALLED">Stalled</option>
            <option value="DELAYED,STALLED">Delayed or Stalled</option>
          </select>
          <Button type="submit">Filter</Button>
          {(searchParams.q || searchParams.city || searchParams.status) && (
            <Button variant="ghost" asChild>
              <Link href="/projects">Clear filters</Link>
            </Button>
          )}
        </form>
      </div>

      {/* Quick filter chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { label: 'All', href: '/projects' },
          { label: `Delayed (${statusCounts['DELAYED'] || 0})`, href: '/projects?status=DELAYED' },
          { label: `Stalled (${statusCounts['STALLED'] || 0})`, href: '/projects?status=STALLED' },
          { label: `Ready to Move (${statusCounts['READY_TO_MOVE'] || 0})`, href: '/projects?status=READY_TO_MOVE' },
          { label: `Mumbai`, href: '/projects?city=Mumbai' },
          { label: `Thane`, href: '/projects?city=Thane' },
        ].map((chip) => (
          <Link
            key={chip.href}
            href={chip.href}
            className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition-colors"
          >
            {chip.label}
          </Link>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-semibold text-neutral-700 mb-2">No projects match your filters</p>
          <p className="text-neutral-500 text-sm mb-4">Try adjusting or clearing your filters</p>
          <Button variant="outline" asChild><Link href="/projects">Clear filters</Link></Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              redFlags={RED_FLAGS[project.id] ?? []}
            />
          ))}
        </div>
      )}
    </div>
  )
}
