import type { Metadata } from 'next'
import Link from 'next/link'
import { Building, ArrowRight, Flag, Users, Clock, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProjectStatusBadge } from '@/components/project/project-status-badge'
import { PROJECTS } from '@/data/mock'

export const metadata: Metadata = { title: 'My Projects' }

// Mock: pretend user is linked to these 2 projects
const MY_LINKED_PROJECTS = PROJECTS.filter((p) => ['p1', 'p4'].includes(p.id))

export default function MyProjectsPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-neutral-900">My Linked Projects</h1>
        <Button variant="outline" asChild>
          <Link href="/projects">Browse All Projects</Link>
        </Button>
      </div>

      {MY_LINKED_PROJECTS.length === 0 ? (
        <div className="rounded-xl border border-neutral-200 bg-white p-10 text-center">
          <Building className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
          <p className="font-semibold text-neutral-700">No linked projects yet</p>
          <p className="text-sm text-neutral-500 mt-1 mb-4">Find your project and verify ownership to get personalised alerts.</p>
          <Button asChild><Link href="/projects">Find Your Project</Link></Button>
        </div>
      ) : (
        <div className="space-y-4">
          {MY_LINKED_PROJECTS.map((project) => (
            <div key={project.id} className="rounded-xl border border-neutral-200 bg-white p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <ProjectStatusBadge status={project.status} />
                  <h2 className="font-heading text-lg font-semibold text-neutral-900 mt-2">
                    {project.name}
                  </h2>
                  <p className="text-sm text-neutral-500">by {project.builderName} · {project.locality}, {project.city}</p>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-success-50 border border-success-500 px-3 py-1 text-xs font-semibold text-success-700">
                  ✓ Verified Owner
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                {project.delayMonths > 0 && (
                  <span className="flex items-center gap-1 text-danger-600">
                    <Clock className="h-3.5 w-3.5" />
                    {project.delayMonths} months delayed
                  </span>
                )}
                {project.openGrievances > 0 && (
                  <span className="flex items-center gap-1 text-warning-600">
                    <Flag className="h-3.5 w-3.5" />
                    {project.openGrievances} open grievances
                  </span>
                )}
                {project.redFlagCount > 0 && (
                  <span className="flex items-center gap-1 text-danger-700 font-semibold">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {project.redFlagCount} red flag{project.redFlagCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/projects/${project.slug}`}>
                    View Project <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/my-grievances">My Grievances</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
