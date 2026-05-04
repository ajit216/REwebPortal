import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RERA Delay Compensation Calculator',
  description: 'Calculate your RERA compensation entitlement for delayed possession in Mumbai & Thane.',
}

function calculateCompensation(
  amountPaid: number,
  delayMonths: number
): { annualInterest: number; totalCompensation: number; monthlyCompensation: number } {
  const ratePercent = 8.5 // SBI MCLR + 2% approx
  const annual = (amountPaid * ratePercent) / 100
  const monthly = annual / 12
  const total = monthly * delayMonths
  return { annualInterest: annual, totalCompensation: total, monthlyCompensation: monthly }
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

      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <form className="space-y-5" id="calc-form">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-neutral-700 mb-1.5">
              Total Amount Paid to Builder (₹)
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              min="0"
              placeholder="e.g. 5000000"
              className="w-full h-10 rounded-lg border border-neutral-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label htmlFor="delay" className="block text-sm font-medium text-neutral-700 mb-1.5">
              Delay in Months (beyond RERA deadline)
            </label>
            <input
              id="delay"
              name="delay"
              type="number"
              min="0"
              placeholder="e.g. 18"
              className="w-full h-10 rounded-lg border border-neutral-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label htmlFor="rate" className="block text-sm font-medium text-neutral-700 mb-1.5">
              Interest Rate (% per annum — typically SBI MCLR + 2%)
            </label>
            <input
              id="rate"
              name="rate"
              type="number"
              step="0.1"
              defaultValue="8.5"
              className="w-full h-10 rounded-lg border border-neutral-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </form>

        {/* Sample Result (static illustration) */}
        <div className="mt-6 rounded-xl bg-primary-50 border border-primary-200 p-5">
          <h3 className="font-heading text-sm font-semibold text-primary-900 mb-3">Illustrative Example</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600">Amount paid (example)</span>
              <span className="font-semibold text-neutral-800">₹50,00,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Delay</span>
              <span className="font-semibold text-neutral-800">18 months</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Rate</span>
              <span className="font-semibold text-neutral-800">8.5% p.a.</span>
            </div>
            <hr className="border-primary-200" />
            <div className="flex justify-between">
              <span className="text-neutral-600">Monthly compensation</span>
              <span className="font-semibold text-primary-700">₹35,417 / month</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span className="text-neutral-800">Total compensation (18 mo.)</span>
              <span className="text-primary-700 text-base">₹6,37,500</span>
            </div>
          </div>
        </div>

        <div className="mt-5 text-xs text-neutral-500 bg-neutral-50 border border-neutral-200 rounded-lg p-3">
          ⚠️ This calculator provides an estimate only. Actual compensation depends on your specific agreement, RERA order, and applicable court/forum decisions. Consult a legal expert for personalised advice.
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-5">
        <h3 className="font-heading text-sm font-semibold text-neutral-900 mb-2">Next Steps</h3>
        <ul className="space-y-2 text-sm text-neutral-700">
          <li className="flex items-start gap-2">
            <span className="text-primary-500 font-bold">1.</span>
            <span>Send a demand notice to your builder citing Section 18 of RERA — <a href="/legal/sample-legal-notice-builder" className="text-primary-500 hover:underline">download template</a></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-500 font-bold">2.</span>
            <span>If no response in 30 days, file on <a href="https://maharera.mahaonline.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">MahaRERA portal</a> (free)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-500 font-bold">3.</span>
            <span>Consider approaching <a href="/legal/consumer-forum-complaint-guide" className="text-primary-500 hover:underline">Consumer Forum</a> for additional relief</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
