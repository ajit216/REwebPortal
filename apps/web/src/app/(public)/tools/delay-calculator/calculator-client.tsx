'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calculator } from 'lucide-react'
import { Button } from '@/components/ui/button'

function formatCurrency(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`
  return `₹${amount.toLocaleString('en-IN')}`
}

export function DelayCalculatorClient() {
  const [amountPaid, setAmountPaid] = useState('')
  const [delayMonths, setDelayMonths] = useState('')
  const [rate, setRate] = useState('8.5')
  const [result, setResult] = useState<{ monthly: number; total: number; annual: number } | null>(null)

  const calculate = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(amountPaid)
    const months = parseFloat(delayMonths)
    const rateVal = parseFloat(rate)

    if (!amount || !months || !rateVal || amount <= 0 || months <= 0) {
      setResult(null)
      return
    }

    const annual = (amount * rateVal) / 100
    const monthly = annual / 12
    const total = monthly * months
    setResult({ annual, monthly, total })
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <form onSubmit={calculate} className="space-y-5">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-neutral-700 mb-1.5">
              Total Amount Paid to Builder (₹)
            </label>
            <input
              id="amount"
              type="number"
              min="0"
              step="1"
              placeholder="e.g. 5000000"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              className="w-full h-10 rounded-lg border border-neutral-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
            {amountPaid && parseFloat(amountPaid) > 0 && (
              <p className="mt-1 text-xs text-neutral-500">
                = {formatCurrency(parseFloat(amountPaid))}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="delay" className="block text-sm font-medium text-neutral-700 mb-1.5">
              Delay in Months (beyond RERA deadline)
            </label>
            <input
              id="delay"
              type="number"
              min="0"
              step="1"
              placeholder="e.g. 18"
              value={delayMonths}
              onChange={(e) => setDelayMonths(e.target.value)}
              className="w-full h-10 rounded-lg border border-neutral-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label htmlFor="rate" className="block text-sm font-medium text-neutral-700 mb-1.5">
              Interest Rate (% per annum — typically SBI MCLR + 2%)
            </label>
            <input
              id="rate"
              type="number"
              step="0.1"
              min="0"
              max="30"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full h-10 rounded-lg border border-neutral-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
            <p className="mt-1 text-xs text-neutral-400">
              Current SBI MCLR (1-year) + 2% ≈ 8.5% p.a. as of 2025
            </p>
          </div>

          <Button type="submit" className="w-full">
            <Calculator className="h-4 w-4" />
            Calculate Compensation
          </Button>
        </form>

        {/* Result */}
        {result && (
          <div className="mt-6 rounded-xl bg-primary-50 border border-primary-200 p-5">
            <h3 className="font-heading text-sm font-semibold text-primary-900 mb-4">Your Estimated Compensation</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Amount paid</span>
                <span className="font-semibold text-neutral-800">{formatCurrency(parseFloat(amountPaid))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Delay</span>
                <span className="font-semibold text-neutral-800">{delayMonths} months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Interest rate</span>
                <span className="font-semibold text-neutral-800">{rate}% p.a.</span>
              </div>
              <hr className="border-primary-200" />
              <div className="flex justify-between">
                <span className="text-neutral-600">Annual compensation</span>
                <span className="font-semibold text-primary-700">{formatCurrency(result.annual)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Monthly compensation</span>
                <span className="font-semibold text-primary-700">{formatCurrency(result.monthly)} / month</span>
              </div>
              <div className="flex justify-between items-center font-semibold pt-1">
                <span className="text-neutral-800">Total compensation</span>
                <span className="text-primary-700 text-lg">{formatCurrency(result.total)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-5 text-xs text-neutral-500 bg-neutral-50 border border-neutral-200 rounded-lg p-3">
          ⚠️ This calculator provides an estimate only. Actual compensation depends on your specific agreement, RERA order, 
          and applicable court/forum decisions. Consult a legal expert for personalised advice.
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-5">
        <h3 className="font-heading text-sm font-semibold text-neutral-900 mb-2">Next Steps</h3>
        <ol className="space-y-2 text-sm text-neutral-700">
          <li className="flex items-start gap-2">
            <span className="text-primary-500 font-bold shrink-0">1.</span>
            <span>
              Send a demand notice to your builder citing Section 18 of RERA — {' '}
              <Link href="/legal/templates" className="text-primary-500 hover:underline">
                download template
              </Link>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-500 font-bold shrink-0">2.</span>
            <span>
              If no response in 30 days, file on {' '}
              <a href="https://maharera.mahaonline.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">
                MahaRERA portal
              </a>{' '}
              (free)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-500 font-bold shrink-0">3.</span>
            <span>
              Consider approaching {' '}
              <Link href="/legal/consumer-forum-complaint-guide" className="text-primary-500 hover:underline">
                Consumer Forum
              </Link>{' '}
              for additional relief including mental agony damages
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-500 font-bold shrink-0">4.</span>
            <span>
              <Link href="/legal/experts" className="text-primary-500 hover:underline">
                Find a RERA lawyer
              </Link>{' '}
              in your area for personalised legal advice
            </span>
          </li>
        </ol>
      </div>
    </div>
  )
}
