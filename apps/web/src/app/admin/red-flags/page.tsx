import type { Metadata } from 'next'
import Link from 'next/link'
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RED_FLAGS, PROJECTS } from '@/data/mock'

export const metadata: Metadata = { title: 'Red Flag Candidates' }

export default function RedFlagsPage() {
  // Flatten all red flags with their project info
  const allFlags = Object.entries(RED_FLAGS).flatMap(([projectId, flags]) => {
    const project = PROJECTS.find((p) => p.id === projectId)
    return flags.map((flag) => ({ ...flag, project }))
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-neutral-900">Red Flag Candidates</h1>
        <p className="text-neutral-600 text-sm mt-1">
          Review auto-detected red flags before publishing. {allFlags.length} active flags.
        </p>
      </div>

      <div className="mb-4 rounded-xl bg-danger-50 border border-danger-200 p-4 text-sm text-danger-800">
        <p>
          <strong>Important:</strong> Red flags affect project transparency scores and are visible to all users. 
          Verify each flag against official MahaRERA records before publishing.
        </p>
      </div>

      <div className="space-y-4">
        {allFlags.map((flag) => (
          <div
            key={flag.id}
            className={`rounded-xl border p-5 ${
              flag.severity === 'CRITICAL'
                ? 'border-danger-300 bg-danger-50'
                : 'border-warning-300 bg-warning-50'
            }`}
          >
            <div className="flex items-start gap-3">
              {flag.severity === 'CRITICAL' ? (
                <AlertCircle className="h-5 w-5 shrink-0 text-danger-500 mt-0.5" aria-hidden="true" />
              ) : (
                <AlertTriangle className="h-5 w-5 shrink-0 text-warning-500 mt-0.5" aria-hidden="true" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <Badge variant={flag.severity === 'CRITICAL' ? 'danger' : 'warning'}>
                      {flag.severity}
                    </Badge>
                    <h2 className="font-heading text-sm font-semibold text-neutral-900 mt-1">{flag.title}</h2>
                    {flag.project && (
                      <Link
                        href={`/projects/${flag.project.slug}`}
                        className="text-xs text-primary-500 hover:underline mt-0.5 block"
                      >
                        {flag.project.name} by {flag.project.builderName}
                      </Link>
                    )}
                    <p className="mt-2 text-sm text-neutral-700">{flag.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="success">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Approve & Publish
                    </Button>
                    <Button size="sm" variant="outline">
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
