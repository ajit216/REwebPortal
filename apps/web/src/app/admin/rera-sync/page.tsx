import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'RERA Sync Queue' }

// TODO: Replace with real API data
// GET /api/v1/admin/rera/sync/queue — returns projects with sync status
export default function AdminRERASyncPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">RERA Sync Queue</h2>
        <p className="text-sm text-neutral-500 mt-1">
          Sync project data from MahaRERA portal. Each sync requires admin review before committing.
        </p>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <strong>How RERA Sync Works:</strong> Click "Sync Now" to fetch live data from MahaRERA.
        The system fetches the project page, parses RERA status, dates, and works-done percentage.
        You review the diff and approve changes before they go live. All approvals are logged.
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {['All Projects', 'Overdue (>30 days)', 'Critical (>60 days)', 'Never Synced'].map((tab) => (
          <button
            key={tab}
            className="px-3 py-1.5 text-sm border border-neutral-200 rounded-md bg-white hover:bg-neutral-50"
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Sync queue table */}
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Project</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">RERA Number</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Last Sync</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Sync Status</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Sample rows — replace with real data */}
            <SyncRow
              project="Lodha Palava City"
              rera="P51900000001"
              lastSync="28 Apr 2025"
              status="recent"
            />
            <SyncRow
              project="Rustomjee Elements"
              rera="P51900000002"
              lastSync="02 Mar 2025"
              status="overdue"
            />
            <SyncRow
              project="Kalpataru Summit"
              rera="P51900000003"
              lastSync="Never"
              status="never"
            />
          </tbody>
        </table>
      </div>

      {/* Reported data issues */}
      <div>
        <h3 className="text-base font-semibold text-neutral-700 mb-3">Data Issue Reports (3)</h3>
        <div className="space-y-2">
          <IssueRow
            project="Lodha Palava City"
            report="Works done shows 72% but site shows 40% actual construction"
          />
          <IssueRow
            project="Rustomjee Elements"
            report="OC applied in March 2025, not reflected in RERA portal"
          />
        </div>
      </div>
    </div>
  )
}

function SyncRow({
  project, rera, lastSync, status,
}: {
  project: string
  rera: string
  lastSync: string
  status: 'recent' | 'overdue' | 'never'
}) {
  const statusConfig = {
    recent: { label: '✅ Recent', color: 'text-green-700' },
    overdue: { label: '⚠️ Overdue', color: 'text-amber-700' },
    never: { label: '❌ Never Synced', color: 'text-red-700' },
  }[status]

  return (
    <tr className="border-b border-neutral-100 hover:bg-neutral-50">
      <td className="px-4 py-3 font-medium">{project}</td>
      <td className="px-4 py-3 font-mono text-neutral-600">{rera}</td>
      <td className="px-4 py-3 text-neutral-500">{lastSync}</td>
      <td className={`px-4 py-3 font-medium ${statusConfig.color}`}>{statusConfig.label}</td>
      <td className="px-4 py-3">
        {status !== 'recent' && (
          <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
            Sync Now
          </button>
        )}
      </td>
    </tr>
  )
}

function IssueRow({ project, report }: { project: string; report: string }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-4 flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-neutral-800">{project}</p>
        <p className="text-sm text-neutral-500 mt-0.5">"{report}"</p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button className="px-3 py-1 bg-neutral-100 text-neutral-700 text-xs rounded hover:bg-neutral-200">
          Review
        </button>
        <button className="px-3 py-1 bg-neutral-100 text-neutral-700 text-xs rounded hover:bg-neutral-200">
          Dismiss
        </button>
      </div>
    </div>
  )
}
