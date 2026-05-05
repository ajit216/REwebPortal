import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Content Moderation' }

// TODO: Replace with real API data
// GET /api/v1/admin/moderation/queue
export default function AdminModerationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">Content Moderation</h2>
        <p className="text-sm text-neutral-500 mt-1">
          Review flagged forum posts and replies. Auto-queued when 3+ users report the same content.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-neutral-200 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-red-500">8</p>
          <p className="text-sm text-neutral-500 mt-1">Pending Review</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-neutral-700">14</p>
          <p className="text-sm text-neutral-500 mt-1">Hidden This Month</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-neutral-700">3</p>
          <p className="text-sm text-neutral-500 mt-1">Active Suspensions</p>
        </div>
      </div>

      {/* Moderation queue */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-neutral-700">Report Queue</h3>

        <ModerationCard
          type="Reply"
          thread="Anyone got possession update for Tower B?"
          project="Lodha Palava City"
          content="Builder's director lives at [SOME ADDRESS]. Let's go protest at his home tomorrow."
          reportCount={4}
          reasons={['Personal information exposed', 'Harassment']}
          authorWarnings={0}
        />

        <ModerationCard
          type="Thread"
          thread="URGENT: Builder is committing fraud with everyone"
          project="Rustomjee Elements"
          content="The builder is a complete criminal cheating everyone. [PHONE NUMBER] call this to complain."
          reportCount={3}
          reasons={['False information', 'Personal contact info']}
          authorWarnings={1}
        />
      </div>
    </div>
  )
}

function ModerationCard({
  type, thread, project, content, reportCount, reasons, authorWarnings,
}: {
  type: string
  thread: string
  project: string
  content: string
  reportCount: number
  reasons: string[]
  authorWarnings: number
}) {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-5 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span className="bg-neutral-100 px-2 py-0.5 rounded">{type}</span>
            <span>in thread: <strong>{thread}</strong></span>
            <span>— {project}</span>
          </div>
          <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-900 italic">
            "{content}"
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {reasons.map((r) => (
              <span key={r} className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                {r}
              </span>
            ))}
          </div>
          <p className="text-xs text-neutral-500 mt-2">
            Reported by {reportCount} users · Author warnings: {authorWarnings}/3
          </p>
        </div>
      </div>

      <div className="flex gap-2 pt-2 border-t border-neutral-100">
        <button className="px-3 py-1.5 bg-green-100 text-green-800 text-xs font-medium rounded hover:bg-green-200">
          ✅ Keep Visible
        </button>
        <button className="px-3 py-1.5 bg-amber-100 text-amber-800 text-xs font-medium rounded hover:bg-amber-200">
          🙈 Hide + Warn
        </button>
        <button className="px-3 py-1.5 bg-red-100 text-red-800 text-xs font-medium rounded hover:bg-red-200">
          🗑️ Delete
        </button>
        <button className="px-3 py-1.5 bg-neutral-100 text-neutral-700 text-xs font-medium rounded hover:bg-neutral-200 ml-auto">
          View Author History
        </button>
      </div>
    </div>
  )
}
