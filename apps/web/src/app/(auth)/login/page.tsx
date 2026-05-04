import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Phone, Lock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Login' }

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-neutral-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500">
              <Shield className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="font-heading text-2xl font-bold text-neutral-900">Welcome back</h1>
          <p className="text-neutral-600 mt-1 text-sm">Login with your India mobile number</p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <form className="space-y-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1.5">
                Mobile Number
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
                  aria-describedby="phone-help"
                />
              </div>
              <p id="phone-help" className="mt-1 text-xs text-neutral-400">
                An OTP will be sent to this number
              </p>
            </div>

            <Button className="w-full" type="submit">
              <Phone className="h-4 w-4" />
              Send OTP
            </Button>
          </form>

          <div className="mt-6 rounded-lg bg-neutral-50 border border-neutral-200 p-3 text-xs text-neutral-500 flex items-start gap-2">
            <Lock className="h-3.5 w-3.5 mt-0.5 shrink-0 text-success-500" aria-hidden="true" />
            Your mobile number is never shared publicly. We use it only for authentication and alerts.
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-neutral-500">
          Don't have an account?{' '}
          <Link href="/register" className="text-primary-500 font-medium hover:underline">
            Register free →
          </Link>
        </p>
      </div>
    </div>
  )
}
