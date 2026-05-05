import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Buyer Verification Queue' }

// TODO: Replace with real API data
// GET /api/v1/admin/verification?status=PENDING
export default function AdminVerificationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">Buyer Verification Queue</h2>
        <p className="text-sm text-neutral-500 mt-1">
          Review Agreement to Sale documents and approve/reject ownership verification requests.
          SLA: Review within 2 business days.
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
        <strong>Privacy Reminder:</strong> Agreement to Sale documents are for verification only.
        Only confirm the buyer is linked to the correct project. Do not record any financial details.
        Documents are automatically flagged for deletion 30 days after review.
      </div>

      {/* Summary counts */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-neutral-200 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-amber-600">47</p>
          <p className="text-sm text-neutral-500 mt-1">Pending Review</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-green-600">2,109</p>
          <p className="text-sm text-neutral-500 mt-1">Approved Total</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-red-500">34</p>
          <p className="text-sm text-neutral-500 mt-1">Rejected Total</p>
        </div>
      </div>

      {/* Queue table */}
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Buyer</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Project</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">BHK Type</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Submitted</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Days Pending</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-600">Action</th>
            </tr>
          </thead>
          <tbody>
            <VerificationRow
              buyer="Rahul M."
              phone="+91 9876XXXXXX"
              project="Lodha Palava City"
              bhk="3BHK"
              submitted="25 Apr 2025"
              daysPending={3}
            />
            <VerificationRow
              buyer="Priya S."
              phone="+91 9765XXXXXX"
              project="Rustomjee Elements"
              bhk="2BHK"
              submitted="23 Apr 2025"
              daysPending={5}
            />
          </tbody>
        </table>
      </div>
    </div>
  )
}

function VerificationRow({
  buyer, phone, project, bhk, submitted, daysPending,
}: {
  buyer: string
  phone: string
  project: string
  bhk: string
  submitted: string
  daysPending: number
}) {
  return (
    <tr className="border-b border-neutral-100 hover:bg-neutral-50">
      <td className="px-4 py-3">
        <p className="font-medium">{buyer}</p>
        <p className="text-xs text-neutral-400">{phone}</p>
      </td>
      <td className="px-4 py-3 text-sm">{project}</td>
      <td className="px-4 py-3 text-sm">{bhk}</td>
      <td className="px-4 py-3 text-sm text-neutral-500">{submitted}</td>
      <td className={`px-4 py-3 text-sm font-medium ${daysPending > 2 ? 'text-red-600' : 'text-neutral-600'}`}>
        {daysPending}d
      </td>
      <td className="px-4 py-3">
        <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
          Review Doc
        </button>
      </td>
    </tr>
  )
}
