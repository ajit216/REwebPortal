import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Verify OTP' }

export default function VerifyOTPPage({
  searchParams,
}: {
  searchParams: { phone?: string; next?: string }
}) {
  const phone = searchParams.phone ?? ''
  const maskedPhone = phone ? `+91 XXXXXX${phone.slice(-4)}` : '+91 XXXXXXXXXX'

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-neutral-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500">
              <Shield className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="font-heading text-2xl font-bold text-neutral-900">Enter OTP</h1>
          <p className="text-neutral-600 mt-1 text-sm">
            A 6-digit OTP was sent to <strong>{maskedPhone}</strong>
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <form className="space-y-4">
            {/* 6 OTP input boxes */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3 text-center">
                Enter the 6-digit code
              </label>
              <div className="flex justify-center gap-2" role="group" aria-label="OTP digits">
                {Array.from({ length: 6 }).map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="h-12 w-10 rounded-lg border border-neutral-200 text-center text-lg font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    aria-label={`OTP digit ${i + 1}`}
                    autoFocus={i === 0}
                  />
                ))}
              </div>
            </div>

            <Button className="w-full" type="submit">
              Verify & Continue
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-neutral-400 mb-2">Didn't receive the code?</p>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary-500 hover:underline"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Resend OTP (valid for 5 minutes)
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-neutral-500">
          Wrong number?{' '}
          <Link href="/login" className="text-primary-500 font-medium hover:underline">
            Go back
          </Link>
        </p>
      </div>
    </div>
  )
}
