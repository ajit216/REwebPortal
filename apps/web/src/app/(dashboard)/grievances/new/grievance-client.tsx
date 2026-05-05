'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Shield,
  Flag,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Lock,
  Upload,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const CATEGORIES = [
  { value: 'POSSESSION_DELAY', label: 'Possession Delay', desc: 'Flat not handed over by promised or RERA date' },
  { value: 'CONSTRUCTION_QUALITY', label: 'Construction Quality', desc: 'Seepage, cracks, poor finishing, structural issues' },
  { value: 'AMENITIES_NOT_DELIVERED', label: 'Amenities Not Delivered', desc: 'Promised gym, pool, club, or other facilities not built' },
  { value: 'FINANCIAL_DISCREPANCY', label: 'Financial Discrepancy', desc: 'Extra charges, GST issues, illegal demand letters' },
  { value: 'LEGAL_TITLE_ISSUE', label: 'Legal / Title Issue', desc: 'Clear title not obtained, encumbrances, disputed land' },
  { value: 'POOR_COMMUNICATION', label: 'Poor Communication', desc: 'Builder not responding to calls, emails, or notices' },
  { value: 'OC_CERTIFICATE_DELAY', label: 'OC Certificate Delay', desc: 'Occupancy Certificate not obtained despite possession' },
  { value: 'RERA_VIOLATION', label: 'RERA Violation', desc: 'Specific RERA rule violation by builder' },
  { value: 'OTHER', label: 'Other', desc: 'Issue does not fit the above categories' },
]

const SEVERITIES = [
  { value: 'LOW', label: 'Low', desc: 'Minor inconvenience, communication lapse', color: 'border-neutral-200 text-neutral-700' },
  { value: 'MEDIUM', label: 'Medium', desc: 'Possession delay, construction defect', color: 'border-warning-300 text-warning-700 bg-warning-50' },
  { value: 'HIGH', label: 'High', desc: 'Significant financial impact, title dispute', color: 'border-danger-300 text-danger-700 bg-danger-50' },
  { value: 'CRITICAL', label: 'Critical', desc: 'Project stalled, mass complaint, fraud', color: 'border-danger-500 text-danger-700 bg-danger-100' },
]

type Step = 1 | 2 | 3 | 4

export default function NewGrievanceClient() {
  const searchParams = useSearchParams()
  const projectSlug = searchParams.get('project') ?? ''

  const [step, setStep] = useState<Step>(1)
  const [category, setCategory] = useState('')
  const [severity, setSeverity] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [refId] = useState(`GRV-2025-${String(Math.floor(1000 + Math.random() * 8999))}`)

  const canProceedStep1 = category !== ''
  const canProceedStep2 = severity !== ''
  const canProceedStep3 = title.trim().length >= 10 && description.trim().length >= 20

  function handleSubmit() {
    // In production: POST /api/v1/grievances with JWT auth
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center py-12">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-50 mb-4">
          <CheckCircle className="h-8 w-8 text-success-500" aria-hidden="true" />
        </div>
        <h2 className="font-heading text-xl font-bold text-neutral-900 mb-2">Grievance Submitted</h2>
        <p className="text-neutral-600 mb-1">Reference: <span className="font-mono font-semibold text-neutral-900">{refId}</span></p>
        <p className="text-sm text-neutral-500 max-w-sm mt-2 mb-6">
          Your complaint will appear in the project's aggregated grievance summary within 24 hours. You'll receive an SMS when it's acknowledged.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild>
            <Link href="/my-grievances">View My Grievances</Link>
          </Button>
          {projectSlug && (
            <Button variant="outline" asChild>
              <Link href={`/projects/${projectSlug}`}>Back to Project</Link>
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Progress */}
      <div className="mb-8 flex items-center gap-1">
        {([1, 2, 3, 4] as Step[]).map((s) => (
          <div key={s} className="flex items-center gap-1">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                s < step
                  ? 'bg-success-500 text-white'
                  : s === step
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-200 text-neutral-500'
              }`}
            >
              {s < step ? '✓' : s}
            </div>
            {s < 4 && <div className={`h-0.5 w-8 ${s < step ? 'bg-success-500' : 'bg-neutral-200'}`} />}
          </div>
        ))}
        <div className="ml-3 text-xs text-neutral-500">
          Step {step} of 4 —{' '}
          {step === 1 ? 'Category' : step === 2 ? 'Severity' : step === 3 ? 'Details' : 'Review & Privacy'}
        </div>
      </div>

      {/* Step 1 — Category */}
      {step === 1 && (
        <div>
          <h2 className="font-heading text-lg font-semibold text-neutral-900 mb-4">
            What is your complaint about?
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`text-left rounded-xl border p-4 transition-all ${
                  category === cat.value
                    ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
                    : 'border-neutral-200 bg-white hover:border-primary-200 hover:bg-neutral-50'
                }`}
              >
                <p className="text-sm font-semibold text-neutral-900">{cat.label}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{cat.desc}</p>
              </button>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={() => setStep(2)} disabled={!canProceedStep1}>
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2 — Severity */}
      {step === 2 && (
        <div>
          <h2 className="font-heading text-lg font-semibold text-neutral-900 mb-4">
            How severe is the issue?
          </h2>
          <div className="grid gap-3">
            {SEVERITIES.map((sev) => (
              <button
                key={sev.value}
                onClick={() => setSeverity(sev.value)}
                className={`text-left rounded-xl border p-4 transition-all ${
                  severity === sev.value
                    ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
                    : `border-neutral-200 bg-white hover:border-neutral-300`
                }`}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${sev.color}`}>
                    {sev.label}
                  </span>
                </div>
                <p className="text-xs text-neutral-500">{sev.desc}</p>
              </button>
            ))}
          </div>
          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={() => setStep(3)} disabled={!canProceedStep2}>
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3 — Details */}
      {step === 3 && (
        <div>
          <h2 className="font-heading text-lg font-semibold text-neutral-900 mb-1">Describe your complaint</h2>
          <p className="text-sm text-neutral-500 mb-5">
            Be factual and specific. Include dates, amounts, and what you've already tried.
            Your description is <strong>private</strong> — only you and platform admins can see it.
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
                Title <span className="text-neutral-400 font-normal">({title.length}/100)</span>
              </label>
              <input
                id="title"
                type="text"
                maxLength={100}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Flat possession delayed by 18 months with no update from builder"
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label htmlFor="desc" className="block text-sm font-medium text-neutral-700 mb-1">
                Description <span className="text-neutral-400 font-normal">({description.length}/1500)</span>
              </label>
              <textarea
                id="desc"
                maxLength={1500}
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Example: Builder promised possession in Dec 2024 per my agreement to sale. It's now May 2025 and no update has been given despite multiple emails and two visits to the site office. Construction appears to be at 70% as of April 2025."
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-y"
              />
            </div>

            {/* Evidence upload (UI only — no backend in mock) */}
            <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-5 text-center">
              <Upload className="h-6 w-6 text-neutral-400 mx-auto mb-2" aria-hidden="true" />
              <p className="text-sm font-medium text-neutral-700">Attach evidence (optional)</p>
              <p className="text-xs text-neutral-500 mt-0.5">PDF, JPG — max 3 files, 10 MB each</p>
              <div className="mt-3 flex items-center justify-center gap-1 text-xs text-neutral-400">
                <Lock className="h-3 w-3" aria-hidden="true" />
                Files are encrypted and visible only to you and platform admins
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
            <Button onClick={() => setStep(4)} disabled={!canProceedStep3}>
              Review <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 4 — Review & Privacy */}
      {step === 4 && (
        <div>
          <h2 className="font-heading text-lg font-semibold text-neutral-900 mb-5">Review & Privacy</h2>

          {/* Summary */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5 space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Category</span>
              <span className="font-medium text-neutral-900">
                {CATEGORIES.find((c) => c.value === category)?.label}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Severity</span>
              <span className="font-medium text-neutral-900">
                {SEVERITIES.find((s) => s.value === severity)?.label}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Title</span>
              <span className="font-medium text-neutral-900 text-right max-w-[60%] line-clamp-2">{title}</span>
            </div>
          </div>

          {/* Privacy toggle */}
          <div className="mb-6 space-y-3">
            <p className="text-sm font-medium text-neutral-700">How should your identity appear publicly?</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => setIsAnonymous(false)}
                className={`text-left rounded-xl border p-4 transition-all ${
                  !isAnonymous
                    ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
                    : 'border-neutral-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="h-4 w-4 text-success-500" />
                  <span className="text-sm font-semibold text-neutral-900">Verified Buyer</span>
                  <span className="text-xs text-neutral-400">(recommended)</span>
                </div>
                <p className="text-xs text-neutral-500">
                  Public sees your verified buyer badge. Your display name is shown.
                </p>
              </button>
              <button
                onClick={() => setIsAnonymous(true)}
                className={`text-left rounded-xl border p-4 transition-all ${
                  isAnonymous
                    ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
                    : 'border-neutral-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="h-4 w-4 text-neutral-500" />
                  <span className="text-sm font-semibold text-neutral-900">Community Member</span>
                </div>
                <p className="text-xs text-neutral-500">
                  Fully anonymous in public view. Admin can still see your account.
                </p>
              </button>
            </div>
          </div>

          {/* Warning notice */}
          <div className="mb-6 flex items-start gap-3 rounded-xl bg-warning-50 border border-warning-200 p-4">
            <AlertTriangle className="h-4 w-4 text-warning-600 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs text-warning-800">
              By submitting, you confirm this is a factual account of your experience. REwebPortal will not display your description publicly — only aggregated statistics are shown. False or malicious complaints may result in account action.
            </p>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
            <Button onClick={handleSubmit}>
              <Flag className="h-4 w-4" />
              Submit Grievance
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
