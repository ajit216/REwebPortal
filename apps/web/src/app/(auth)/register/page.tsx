import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Phone, User, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Register' }

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-neutral-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500">
              <Shield className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="font-heading text-2xl font-bold text-neutral-900">Create your account</h1>
          <p className="text-neutral-600 mt-1 text-sm">Free for homebuyers. 60-second setup.</p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <form className="space-y-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1.5">
                Mobile Number <span className="text-danger-500">*</span>
              </label>
              <div className="flex">
                <span className="flex items-center px-3 rounded-l-lg border border-r-0 border-neutral-200 bg-neutral-50 text-sm font-medium text-neutral-600">
                  +91
                </span>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="10-digit number"
                  className="flex-1 h-10 rounded-r-lg border border-neutral-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-neutral-700 mb-1.5">
                Display Name <span className="text-danger-500">*</span>
              </label>
              <input
                id="displayName"
                type="text"
                placeholder="e.g. Ramesh K."
                className="w-full h-10 rounded-lg border border-neutral-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
              <p className="mt-1 text-xs text-neutral-400">Format: FirstName LastInitial (e.g. "Priya M.")</p>
            </div>

            <div>
              <label htmlFor="locality" className="block text-sm font-medium text-neutral-700 mb-1.5">
                Preferred Locality (optional)
              </label>
              <select
                id="locality"
                className="w-full h-10 rounded-lg border border-neutral-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="">Select locality for alerts</option>
                <optgroup label="Mumbai">
                  <option>Mulund</option>
                  <option>Bandra</option>
                  <option>Chembur</option>
                  <option>Goregaon</option>
                  <option>Malad</option>
                  <option>Kandivali</option>
                </optgroup>
                <optgroup label="Thane">
                  <option>Thane West</option>
                  <option>Ghodbunder Road</option>
                  <option>Dombivli</option>
                  <option>Kalyan</option>
                  <option>Bhiwandi</option>
                </optgroup>
              </select>
            </div>

            <Button className="w-full" type="submit">
              <Phone className="h-4 w-4" />
              Send OTP & Register
            </Button>
          </form>

          <p className="mt-4 text-xs text-neutral-400 text-center">
            By registering, you agree to our{' '}
            <Link href="/about#terms" className="text-primary-500 hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/about#privacy" className="text-primary-500 hover:underline">Privacy Policy</Link>.
          </p>
        </div>

        <p className="mt-4 text-center text-sm text-neutral-500">
          Already have an account?{' '}
          <Link href="/login" className="text-primary-500 font-medium hover:underline">Login →</Link>
        </p>
      </div>
    </div>
  )
}
