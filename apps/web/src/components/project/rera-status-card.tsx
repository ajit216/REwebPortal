'use client'

import { ExternalLink, Copy, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { DataDisclaimer } from '@/components/shared/data-disclaimer'
import { reraStatusLabel, reraStatusVariant } from '@/lib/utils'
import type { RERARecord } from '@rewebportal/types'

interface RERAStatusCardProps {
  reraRecord: RERARecord
}

const APPROVALS = [
  { key: 'iod', label: 'IOD (Intimation of Disapproval)', obtained: true, year: '2020' },
  { key: 'cc', label: 'Commencement Certificate (CC)', obtained: true, year: '2021' },
  { key: 'bcc', label: 'Building Completion Certificate (BCC)', obtained: false, year: null },
  { key: 'oc', label: 'Occupancy Certificate (OC)', obtained: false, year: null },
]

export function RERAStatusCard({ reraRecord }: RERAStatusCardProps) {
  const isLapsed = reraRecord.status === 'LAPSED' || reraRecord.status === 'CANCELLED'
  const isCompleted = reraRecord.status === 'COMPLETED'

  return (
    <div className="space-y-6">
      {/* RERA Registration */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h3 className="font-heading text-base font-semibold text-neutral-900 mb-4">RERA Registration</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs text-neutral-500 mb-1">RERA Number</p>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-medium text-neutral-900">{reraRecord.reraNumber}</span>
                <button
                  className="text-neutral-400 hover:text-neutral-700 transition-colors"
                  aria-label="Copy RERA number"
                  onClick={() => navigator.clipboard?.writeText(reraRecord.reraNumber)}
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <Badge variant={reraStatusVariant(reraRecord.status)}>
              {reraStatusLabel(reraRecord.status)}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-neutral-500 mb-0.5">Registration Date</p>
              <p className="font-medium text-neutral-800">{reraRecord.registrationDate}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500 mb-0.5">Original Completion</p>
              <p className="font-medium text-neutral-800">{reraRecord.originalCompletionDate}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500 mb-0.5">Current Deadline</p>
              <p className={`font-medium ${isLapsed ? 'text-danger-600' : 'text-neutral-800'}`}>
                {reraRecord.currentDeadline}
                {reraRecord.status === 'EXTENDED' && <span className="ml-1 text-warning-600 text-xs">(Extended)</span>}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-500 mb-0.5">Works Completed</p>
              <p className="font-medium text-neutral-800">{reraRecord.worksCompletedPct}%</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-neutral-500 mb-0.5">Promoter</p>
            <p className="text-sm font-medium text-neutral-800">{reraRecord.promoterName}</p>
          </div>

          <a
            href={`https://maharera.mahaonline.gov.in`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary-500 hover:underline mt-1"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View on MahaRERA
          </a>
        </div>
      </div>

      {/* Approvals Tracker */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h3 className="font-heading text-base font-semibold text-neutral-900 mb-4">Approvals Tracker</h3>
        <ul className="space-y-3">
          {APPROVALS.map((approval) => (
            <li key={approval.key} className="flex items-center gap-3">
              {approval.obtained ? (
                <CheckCircle className="h-5 w-5 shrink-0 text-success-500" aria-hidden="true" />
              ) : isCompleted ? (
                <CheckCircle className="h-5 w-5 shrink-0 text-success-500" aria-hidden="true" />
              ) : (
                <Clock className="h-5 w-5 shrink-0 text-neutral-300" aria-hidden="true" />
              )}
              <span className="text-sm text-neutral-700 flex-1">{approval.label}</span>
              {approval.obtained ? (
                <span className="text-xs text-success-600 font-medium">Obtained {approval.year}</span>
              ) : (
                <span className="text-xs text-neutral-400">Pending</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Violations */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h3 className="font-heading text-base font-semibold text-neutral-900 mb-4">RERA Violations</h3>
        {reraRecord.violations.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-success-700">
            <CheckCircle className="h-4 w-4 text-success-500" aria-hidden="true" />
            No RERA violations recorded
          </div>
        ) : (
          <ul className="space-y-2">
            {reraRecord.violations.map((violation, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-danger-700">
                <AlertTriangle className="h-4 w-4 shrink-0 text-danger-500 mt-0.5" aria-hidden="true" />
                {violation}
              </li>
            ))}
          </ul>
        )}
      </div>

      <DataDisclaimer lastUpdated="28 Apr 2025" />
    </div>
  )
}
