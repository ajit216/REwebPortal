import type { Metadata } from 'next'
import Link from 'next/link'
import { RefreshCw, ExternalLink, CheckCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PROJECTS, RERA_RECORDS } from '@/data/mock'

export const metadata: Metadata = { title: 'RERA Sync Queue' }

export default function ReraSyncPage() {
  const syncQueue = PROJECTS.filter((p) => !['COMPLETED', 'READY_TO_MOVE'].includes(p.status))

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-neutral-900">RERA Sync Queue</h1>
        <p className="text-neutral-600 text-sm mt-1">
          Review and approve MahaRERA data syncs. All syncs are admin-triggered and require human review before publishing.
        </p>
      </div>

      <div className="mb-4 rounded-xl bg-info-50 border border-info-200 p-4 text-sm text-info-800">
        <p>
          <strong>Process:</strong> Click "Sync Now" → Backend fetches MahaRERA page → Review diff → Approve changes.
          Data is never published automatically without admin approval.
        </p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white divide-y divide-neutral-100">
        {syncQueue.map((project) => {
          const rera = RERA_RECORDS[project.id]
          return (
            <div key={project.id} className="p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h2 className="font-heading text-sm font-semibold text-neutral-900">{project.name}</h2>
                    <Badge variant={['DELAYED', 'STALLED'].includes(project.status) ? 'danger' : 'info'}>
                      {project.status.replace(/_/g, ' ')}
                    </Badge>
                    {rera && (
                      <Badge variant={rera.status === 'LAPSED' ? 'danger' : rera.status === 'EXTENDED' ? 'warning' : 'success'}>
                        RERA {rera.status}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500">{project.builderName}</p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-neutral-400">
                    <span className="font-mono">{project.reraNumber}</span>
                    {rera && <span>Works: {rera.worksCompletedPct}% · Deadline: {rera.currentDeadline}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="https://maharera.mahaonline.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary-500 hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    MahaRERA
                  </a>
                  <Button size="sm" variant="outline">
                    <RefreshCw className="h-3.5 w-3.5" />
                    Sync Now
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
