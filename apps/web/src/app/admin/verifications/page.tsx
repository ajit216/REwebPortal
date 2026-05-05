import type { Metadata } from 'next'
import { CheckCircle, Clock, Shield, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = { title: 'Verification Queue' }

const VERIFICATION_QUEUE = [
  {
    id: 'v1',
    buyerName: 'Rahul M.',
    phone: '+91 XXXXXX1234',
    project: 'Lodha Palava City',
    unitType: '3BHK',
    submittedAt: '2025-05-01T09:30:00Z',
    status: 'PENDING',
    docName: 'agreement-rahul.pdf',
  },
  {
    id: 'v2',
    buyerName: 'Priya K.',
    phone: '+91 XXXXXX5678',
    project: 'Godrej Sky Garden',
    unitType: '2BHK',
    submittedAt: '2025-04-30T14:00:00Z',
    status: 'PENDING',
    docName: 'ats-priya-godrej.pdf',
  },
  {
    id: 'v3',
    buyerName: 'Anil P.',
    phone: '+91 XXXXXX9012',
    project: 'Runwal My City',
    unitType: '1BHK',
    submittedAt: '2025-04-28T11:00:00Z',
    status: 'VERIFIED',
    docName: 'agreement-anil-runwal.pdf',
  },
]

export default function VerificationsPage() {
  const pending = VERIFICATION_QUEUE.filter((v) => v.status === 'PENDING')

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-neutral-900">Verification Queue</h1>
        <p className="text-neutral-600 text-sm mt-1">
          {pending.length} buyer verifications pending review
        </p>
      </div>

      <div className="mb-4 rounded-xl bg-info-50 border border-info-200 p-4 text-sm text-info-800">
        <p>
          <strong>Privacy:</strong> Review documents only to confirm buyer status. Do not store or record unit numbers.
          Documents are encrypted and available via presigned URLs (expires in 5 minutes).
        </p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white divide-y divide-neutral-100">
        {VERIFICATION_QUEUE.map((v) => (
          <div key={v.id} className="p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="h-4 w-4 text-primary-500" aria-hidden="true" />
                  <span className="font-heading text-sm font-semibold text-neutral-900">{v.buyerName}</span>
                  <Badge variant={v.status === 'VERIFIED' ? 'success' : 'info'}>
                    {v.status}
                  </Badge>
                </div>
                <p className="text-xs text-neutral-500">{v.phone}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-neutral-600">
                  <span><strong>Project:</strong> {v.project}</span>
                  <span><strong>Unit:</strong> {v.unitType}</span>
                  <span className="flex items-center gap-1 text-xs text-neutral-400">
                    <Clock className="h-3 w-3" />
                    {new Date(v.submittedAt).toLocaleDateString('en-IN')}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-neutral-400">Document: {v.docName}</p>
              </div>
              {v.status === 'PENDING' && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">View Doc</Button>
                  <Button size="sm" variant="success">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Approve
                  </Button>
                  <Button size="sm" variant="destructive">
                    <XCircle className="h-3.5 w-3.5" />
                    Reject
                  </Button>
                </div>
              )}
              {v.status === 'VERIFIED' && (
                <span className="flex items-center gap-1 text-sm font-medium text-success-600">
                  <CheckCircle className="h-4 w-4" aria-hidden="true" />
                  Verified
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
