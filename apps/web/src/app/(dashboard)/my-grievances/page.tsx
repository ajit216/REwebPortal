import type { Metadata } from 'next'
import Link from 'next/link'
import { Flag, Plus } from 'lucide-react'
import { GrievanceCard } from '@/components/grievance/grievance-card'
import { Button } from '@/components/ui/button'
import { USER_GRIEVANCES } from '@/data/mock'

export const metadata: Metadata = { title: 'My Grievances' }

export default function MyGrievancesPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-neutral-900">My Grievances</h1>
        <Button asChild>
          <Link href="/grievances/new">
            <Plus className="h-4 w-4" />
            File New Grievance
          </Link>
        </Button>
      </div>

      {USER_GRIEVANCES.length === 0 ? (
        <div className="rounded-xl border border-neutral-200 bg-white p-10 text-center">
          <Flag className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
          <p className="font-semibold text-neutral-700">No grievances filed yet</p>
          <p className="text-sm text-neutral-500 mt-1 mb-4">
            Document your complaint formally to create a record and contribute to community insights.
          </p>
          <Button asChild>
            <Link href="/legal/rera-section-18-rights">How to file a grievance →</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {USER_GRIEVANCES.map((g) => (
            <GrievanceCard key={g.id} grievance={g} showActions />
          ))}
        </div>
      )}

      <div className="mt-6 rounded-xl bg-info-50 border border-info-200 p-4 text-sm text-info-800">
        <p>
          <strong>Privacy reminder:</strong> Your grievance descriptions are private and visible only to you and platform admins. 
          Only aggregated statistics are shown publicly.{' '}
          <Link href="/legal/rera-section-18-rights" className="underline hover:no-underline">
            Learn about your rights →
          </Link>
        </p>
      </div>
    </div>
  )
}
