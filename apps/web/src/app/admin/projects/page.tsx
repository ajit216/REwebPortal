import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus, Building, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PROJECTS } from '@/data/mock'
import { statusLabel, statusVariant } from '@/lib/utils'

export const metadata: Metadata = { title: 'Manage Projects' }

export default function AdminProjectsPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-neutral-900">Projects</h1>
          <p className="text-neutral-600 text-sm mt-1">{PROJECTS.length} projects in the database</p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Add Project
        </Button>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white divide-y divide-neutral-100">
        {PROJECTS.map((project) => (
          <div key={project.id} className="p-4 flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <h2 className="font-heading text-sm font-semibold text-neutral-900">{project.name}</h2>
                <Badge variant={statusVariant(project.status)}>{statusLabel(project.status)}</Badge>
                {project.redFlagCount > 0 && (
                  <Badge variant="danger">⚠️ {project.redFlagCount} flags</Badge>
                )}
              </div>
              <p className="text-xs text-neutral-500">{project.builderName} · {project.locality}, {project.city}</p>
              <p className="font-mono text-xs text-neutral-400 mt-0.5">{project.reraNumber}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/projects/${project.slug}`}
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
