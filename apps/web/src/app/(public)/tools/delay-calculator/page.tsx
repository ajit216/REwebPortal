import type { Metadata } from 'next'
import { DelayCalculatorClient } from './calculator-client'

export const metadata: Metadata = {
  title: 'RERA Delay Compensation Calculator',
  description: 'Calculate your RERA compensation entitlement for delayed possession in Mumbai & Thane.',
}

export default function DelayCalculatorPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold text-neutral-900">RERA Delay Compensation Calculator</h1>
        <p className="text-neutral-600 mt-2">
          Estimate the compensation you may be entitled to under Section 18 of RERA for delayed possession.
        </p>
      </div>
      <DelayCalculatorClient />
    </div>
  )
}
