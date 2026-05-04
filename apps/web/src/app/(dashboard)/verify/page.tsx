import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Upload, Lock, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Verify Ownership' }

export default function VerifyPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-neutral-900 mb-2">Verify Ownership</h1>
      <p className="text-neutral-600 mb-6 text-sm">
        Become a Verified Buyer to access community forums, WhatsApp groups, and display a trust badge.
      </p>

      {/* Steps */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { step: 1, icon: Shield, title: 'Select Project', desc: 'Choose the project you purchased in' },
          { step: 2, icon: Upload, title: 'Upload Agreement', desc: 'Upload your Agreement to Sale (PDF, max 10MB)' },
          { step: 3, icon: CheckCircle, title: 'Get Verified', desc: 'Admin reviews within 2-3 business days' },
        ].map((item) => (
          <div key={item.step} className="rounded-xl border border-neutral-200 bg-white p-4 flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white text-xs font-bold">
              {item.step}
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-800">{item.title}</p>
              <p className="text-xs text-neutral-500 mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <form className="space-y-5">
          <div>
            <label htmlFor="project" className="block text-sm font-medium text-neutral-700 mb-1.5">
              Select Project <span className="text-danger-500">*</span>
            </label>
            <select
              id="project"
              className="w-full h-10 rounded-lg border border-neutral-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              required
            >
              <option value="">Choose your project…</option>
              <option>Lodha Palava City — Dombivli</option>
              <option>Godrej Sky Garden — Chembur</option>
              <option>Oberoi Eternia — Mulund</option>
              <option>Rustomjee Seasons — Bandra East</option>
              <option>Hiranandani Castle — Ghodbunder Road</option>
              <option>Runwal My City — Dombivli East</option>
            </select>
          </div>

          <div>
            <label htmlFor="unitType" className="block text-sm font-medium text-neutral-700 mb-1.5">
              Unit Type <span className="text-danger-500">*</span>
            </label>
            <select
              id="unitType"
              className="w-full h-10 rounded-lg border border-neutral-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              required
            >
              <option value="">Select BHK type…</option>
              <option>1BHK</option>
              <option>2BHK</option>
              <option>3BHK</option>
              <option>4BHK</option>
            </select>
            <p className="mt-1 text-xs text-neutral-400">We do NOT ask for your floor or unit number to protect your privacy.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Agreement to Sale (PDF) <span className="text-danger-500">*</span>
            </label>
            <div className="rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 p-8 text-center hover:border-primary-300 hover:bg-primary-50 transition-colors cursor-pointer">
              <Upload className="h-8 w-8 text-neutral-300 mx-auto mb-2" aria-hidden="true" />
              <p className="text-sm font-medium text-neutral-600">Click to upload or drag & drop</p>
              <p className="text-xs text-neutral-400 mt-1">PDF only · Max 10MB</p>
              <input type="file" accept=".pdf" className="hidden" aria-label="Upload Agreement to Sale" />
            </div>
          </div>

          <div className="rounded-lg bg-success-50 border border-success-200 p-4 flex items-start gap-3">
            <Lock className="h-4 w-4 shrink-0 text-success-600 mt-0.5" aria-hidden="true" />
            <div className="text-xs text-success-800">
              <p className="font-semibold mb-1">Your privacy is protected</p>
              <ul className="space-y-1 text-success-700">
                <li>• Your Agreement to Sale is stored encrypted and only accessible to admins</li>
                <li>• Your unit number is never stored or displayed</li>
                <li>• Document is deleted within 30 days of verification</li>
                <li>• We verify only that you are a buyer — no financial details are stored</li>
              </ul>
            </div>
          </div>

          <Button className="w-full" type="submit">Submit for Verification</Button>
        </form>
      </div>
    </div>
  )
}
