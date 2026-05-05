import type { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink, Building } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BUILDERS } from '@/data/mock'

export const metadata: Metadata = { title: 'Manage Builders' }

function gradeVariant(grade: string | null): 'success' | 'info' | 'warning' | 'danger' {
  if (!grade) return 'info'
  if (grade === 'A_PLUS' || grade === 'A') return 'success'
  if (grade === 'B') return 'info'
  if (grade === 'C') return 'warning'
  return 'danger'
}

function gradeLabel(grade: string | null): string {
  if (grade === 'A_PLUS') return 'A+'
  return grade ?? 'N/A'
}

export default function AdminBuildersPage() {
  const sorted = [...BUILDERS].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-neutral-900">Builders</h1>
          <p className="text-neutral-600 text-sm mt-1">{BUILDERS.length} builders in the directory</p>
        </div>
        <Button size="sm">
          <Building className="h-4 w-4" />
          Add Builder
        </Button>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white divide-y divide-neutral-100 overflow-hidden">
        <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-4 py-2.5 bg-neutral-50 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
          <span>Builder</span>
          <span className="text-center">Projects</span>
          <span className="text-center">Delayed</span>
          <span className="text-center">Grade</span>
          <span></span>
        </div>

        {sorted.map((builder) => (
          <div
            key={builder.id}
            className="px-4 py-3 flex flex-wrap sm:grid sm:grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4"
          >
            <div className="flex-1 min-w-0">
              <p className="font-heading text-sm font-semibold text-neutral-900">{builder.name}</p>
              <p className="text-xs text-neutral-500 mt-0.5">
                Est. {builder.establishedYear ?? '—'} ·{' '}
                {builder.website ? (
                  <a
                    href={builder.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-500 hover:underline"
                  >
                    {new URL(builder.website).hostname}
                  </a>
                ) : (
                  'No website'
                )}
              </p>
            </div>

            <div className="text-sm text-neutral-700 font-medium text-center">
              {builder.totalProjects}
              <span className="block text-xs text-neutral-400 font-normal">projects</span>
            </div>

            <div className="text-sm font-medium text-center">
              <span className={builder.delayedProjects > 3 ? 'text-danger-600' : 'text-neutral-700'}>
                {builder.delayedProjects}
              </span>
              <span className="block text-xs text-neutral-400 font-normal">delayed</span>
            </div>

            <div className="text-center">
              <Badge variant={gradeVariant(builder.transparencyGrade)}>
                {gradeLabel(builder.transparencyGrade)}
              </Badge>
              <p className="text-xs text-neutral-400 mt-1">{builder.transparencyScore ?? '—'}/100</p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/builders/${builder.slug}`}
                target="_blank"
                className="text-xs text-primary-500 hover:underline flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                View
              </Link>
              <Button size="sm" variant="outline">Edit</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
