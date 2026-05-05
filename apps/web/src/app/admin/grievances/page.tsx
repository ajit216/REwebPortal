import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Grievance Management' }

// TODO: Replace with real API data
// GET /api/v1/admin/grievances?status=SUBMITTED&sortBy=oldest
export default function AdminGrievancesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">Grievance Management</h2>
        <p className="text-sm text-neutral-500 mt-1">
          Review, acknowledge, escalate, and resolve buyer complaints.
        </p>
      </div>

      {/* SLA alert */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
        <strong>SLA Alert:</strong> 12 grievances have not been acknowledged in over 2 days. Target: acknowledge within 2 business days.
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 bg-white border border-neutral-200 rounded-lg p-4">
        <select className="text-sm border border-neutral-300 rounded-md px-3 py-1.5">
          <option>All Statuses</option>
          <option>Submitted</option>
          <option>Acknowledged</option>
          <option>Escalated</option>
          <option>Resolved</option>
        </select>
        <select className="text-sm border border-neutral-300 rounded-md px-3 py-1.5">
          <option>All Severities</option>
          <option>Critical</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <select className="text-sm border border-neutral-300 rounded-md px-3 py-1.5">
          <option>All Ages</option>
          <option>&gt;1 day</option>
          <option>&gt;3 days</option>
          <option>&gt;7 days</option>
        </select>
        <input
          type="text"
          placeholder="Search by project or reference..."
          className="text-sm border border-neutral-300 rounded-md px-3 py-1.5 flex-1 min-w-48"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Reference</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Project</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Category</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Severity</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Status</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Filed</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Age</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Action</th>
            </tr>
          </thead>
          <tbody>
            <GrievanceRow
              ref="GRV-2025-0891"
              project="Lodha Palava City"
              category="POSSESSION_DELAY"
              severity="HIGH"
              status="SUBMITTED"
              filed="25 Apr 2025"
              ageDays={3}
            />
            <GrievanceRow
              ref="GRV-2025-0756"
              project="Rustomjee Elements"
              category="OC_CERTIFICATE_DELAY"
              severity="CRITICAL"
              status="ESCALATED"
              filed="18 Apr 2025"
              ageDays={10}
            />
          </tbody>
        </table>
      </div>
    </div>
  )
}

function GrievanceRow({
  ref: refId, project, category, severity, status, filed, ageDays,
}: {
  ref: string
  project: string
  category: string
  severity: string
  status: string
  filed: string
  ageDays: number
}) {
  const severityColors: Record<string, string> = {
    CRITICAL: 'bg-red-100 text-red-700',
    HIGH: 'bg-orange-100 text-orange-700',
    MEDIUM: 'bg-amber-100 text-amber-700',
    LOW: 'bg-neutral-100 text-neutral-600',
  }

  const statusColors: Record<string, string> = {
    SUBMITTED: 'bg-blue-100 text-blue-700',
    ACKNOWLEDGED: 'bg-amber-100 text-amber-700',
    ESCALATED: 'bg-purple-100 text-purple-700',
    RESOLVED: 'bg-green-100 text-green-700',
  }

  return (
    <tr className="border-b border-neutral-100 hover:bg-neutral-50">
      <td className="px-4 py-3 font-mono text-xs text-neutral-600">{refId}</td>
      <td className="px-4 py-3 font-medium text-sm">{project}</td>
      <td className="px-4 py-3 text-xs text-neutral-600">{category.replace(/_/g, ' ')}</td>
      <td className="px-4 py-3">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityColors[severity]}`}>
          {severity}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {status}
        </span>
      </td>
      <td className="px-4 py-3 text-neutral-500 text-xs">{filed}</td>
      <td className={`px-4 py-3 text-xs font-medium ${ageDays > 2 ? 'text-red-600' : 'text-neutral-600'}`}>
        {ageDays}d ago
      </td>
      <td className="px-4 py-3">
        <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
          Review
        </button>
      </td>
    </tr>
  )
}
