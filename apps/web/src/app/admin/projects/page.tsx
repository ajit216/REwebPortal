import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Projects' }

// TODO: Replace with real API data
// GET /api/v1/admin/projects?page=1&limit=50
export default function AdminProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Projects</h2>
          <p className="text-sm text-neutral-500 mt-1">Manage all published and draft projects</p>
        </div>
        <a
          href="/admin/projects/new"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add Project
        </a>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 bg-white border border-neutral-200 rounded-lg p-4">
        <select className="text-sm border border-neutral-300 rounded-md px-3 py-1.5">
          <option>All Cities</option>
          <option>Mumbai</option>
          <option>Thane</option>
        </select>
        <select className="text-sm border border-neutral-300 rounded-md px-3 py-1.5">
          <option>All Statuses</option>
          <option>Under Construction</option>
          <option>Delayed</option>
          <option>Stalled</option>
          <option>Completed</option>
        </select>
        <select className="text-sm border border-neutral-300 rounded-md px-3 py-1.5">
          <option>Published + Draft</option>
          <option>Published Only</option>
          <option>Draft Only</option>
        </select>
        <input
          type="text"
          placeholder="Search by name or RERA number..."
          className="text-sm border border-neutral-300 rounded-md px-3 py-1.5 flex-1 min-w-48"
        />
      </div>

      {/* Table placeholder */}
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Project / Builder</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">RERA Number</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Status</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Published</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Score</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Last RERA Sync</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-neutral-100">
              <td className="px-4 py-4" colSpan={7}>
                <div className="text-center text-neutral-400 py-8">
                  Connect to API — implement data fetch here
                  <br />
                  <span className="text-xs">GET /api/v1/admin/projects</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
