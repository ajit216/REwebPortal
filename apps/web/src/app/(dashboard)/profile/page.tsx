import type { Metadata } from 'next'
import { User, Phone, MapPin, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'My Profile' }

export default function ProfilePage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-neutral-900 mb-6">My Profile</h1>

      <div className="space-y-5">
        {/* Account Info */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="font-heading text-base font-semibold text-neutral-900 mb-4">Account Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">Display Name</label>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                  <User className="h-5 w-5 text-primary-500" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">Rahul M.</p>
                  <p className="text-xs text-neutral-400">Registered buyer</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">Mobile Number</label>
              <div className="flex items-center gap-2 text-sm text-neutral-700">
                <Phone className="h-4 w-4 text-neutral-400" aria-hidden="true" />
                <span>+91 XXXXXX7890</span>
                <span className="rounded-full bg-success-50 border border-success-500 px-2 py-0.5 text-xs font-semibold text-success-700">Verified</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">Preferred Locality</label>
              <div className="flex items-center gap-2 text-sm text-neutral-700">
                <MapPin className="h-4 w-4 text-neutral-400" aria-hidden="true" />
                <span>Thane West</span>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Status */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="font-heading text-base font-semibold text-neutral-900 mb-4">Verification Status</h2>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-50">
              <Shield className="h-5 w-5 text-success-500" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-success-700">✓ Verified Buyer</p>
              <p className="text-xs text-neutral-500 mt-0.5">
                You are a verified buyer of Lodha Palava City. Your verified badge appears on all your posts and grievances.
              </p>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h2 className="font-heading text-base font-semibold text-neutral-900 mb-4">Notification Preferences</h2>
          <div className="space-y-3 text-sm">
            {[
              { label: 'Red flag alerts for my projects', enabled: true },
              { label: 'Grievance status updates', enabled: true },
              { label: 'Community activity digest', enabled: false },
              { label: 'New RERA data synced', enabled: true },
            ].map((pref) => (
              <div key={pref.label} className="flex items-center justify-between py-1">
                <span className="text-neutral-700">{pref.label}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${pref.enabled ? 'bg-success-50 text-success-700' : 'bg-neutral-100 text-neutral-500'}`}>
                  {pref.enabled ? 'On' : 'Off'}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-neutral-400">Notifications are sent via SMS to your registered number.</p>
        </div>

        {/* Danger Zone */}
        <div className="rounded-xl border border-danger-200 bg-danger-50 p-6">
          <h2 className="font-heading text-base font-semibold text-danger-800 mb-2">Account Actions</h2>
          <p className="text-sm text-danger-700 mb-4">
            Deleting your account will remove all your grievances and community posts permanently.
          </p>
          <Button variant="destructive" size="sm">Delete Account</Button>
        </div>
      </div>
    </div>
  )
}
