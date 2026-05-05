import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  Shield,
  Clock,
  FileText,
  Flag,
  Building,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Scale,
  Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataDisclaimer } from '@/components/shared/data-disclaimer'
import { RedFlagAlert } from '@/components/project/red-flag-alert'
import { PROJECTS, RERA_RECORDS, RED_FLAGS } from '@/data/mock'
import { statusLabel, statusVariant, reraStatusLabel, reraStatusVariant } from '@/lib/utils'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = PROJECTS.find((p) => p.slug === params.slug)
  if (!project) return { title: 'Project Not Found' }
  return {
    title: `Buyer Check — ${project.name}`,
    description: `Due diligence checklist and risk assessment for ${project.name} by ${project.builderName}.`,
  }
}

export async function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }))
}

type CheckStatus = 'ok' | 'warning' | 'critical' | 'info'

interface CheckItem {
  label: string
  value: string
  status: CheckStatus
  detail?: string
}

function CheckRow({ item }: { item: CheckItem }) {
  const iconMap: Record<CheckStatus, React.ReactNode> = {
    ok: <CheckCircle className="h-5 w-5 shrink-0 text-success-500" aria-label="Good" />,
    warning: <AlertTriangle className="h-5 w-5 shrink-0 text-warning-500" aria-label="Warning" />,
    critical: <XCircle className="h-5 w-5 shrink-0 text-danger-500" aria-label="Critical" />,
    info: <Info className="h-5 w-5 shrink-0 text-info-500" aria-label="Info" />,
  }
  const bgMap: Record<CheckStatus, string> = {
    ok: 'bg-success-50 border-success-200',
    warning: 'bg-warning-50 border-warning-200',
    critical: 'bg-danger-50 border-danger-200',
    info: 'bg-info-50 border-info-200',
  }
  const textMap: Record<CheckStatus, string> = {
    ok: 'text-success-700',
    warning: 'text-warning-700',
    critical: 'text-danger-700',
    info: 'text-info-700',
  }

  return (
    <div className={`flex items-start gap-3 rounded-xl border p-4 ${bgMap[item.status]}`}>
      {iconMap[item.status]}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <span className="text-sm font-semibold text-neutral-800">{item.label}</span>
          <span className={`text-sm font-medium ${textMap[item.status]}`}>{item.value}</span>
        </div>
        {item.detail && (
          <p className="mt-0.5 text-xs text-neutral-600">{item.detail}</p>
        )}
      </div>
    </div>
  )
}

function RiskMeter({ score }: { score: number }) {
  // score 0-100: 0=low, 100=critical
  const pct = Math.min(100, Math.max(0, score))
  const getLabel = () => {
    if (pct < 25) return { label: 'Low', color: '#22C55E', bg: 'bg-success-50', text: 'text-success-700' }
    if (pct < 50) return { label: 'Medium', color: '#EAB308', bg: 'bg-warning-50', text: 'text-warning-700' }
    if (pct < 75) return { label: 'Medium-High', color: '#F97316', bg: 'bg-orange-50', text: 'text-orange-700' }
    return { label: 'High', color: '#EF4444', bg: 'bg-danger-50', text: 'text-danger-700' }
  }
  const info = getLabel()

  return (
    <div className={`rounded-xl border p-5 ${info.bg} border-neutral-200`}>
      <h3 className="font-heading text-sm font-semibold text-neutral-800 mb-3">Overall Risk Assessment</h3>
      <div className="relative h-4 w-full rounded-full bg-gradient-to-r from-success-500 via-warning-500 to-danger-500 overflow-hidden shadow-inner">
        <div
          className="absolute top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-white border-2 shadow-md transition-all"
          style={{ left: `calc(${pct}% - 12px)`, borderColor: info.color }}
          aria-hidden="true"
        />
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-neutral-500">
        <span>Low Risk</span>
        <span className={`font-heading text-base font-bold ${info.text}`}>{info.label}</span>
        <span>High Risk</span>
      </div>
    </div>
  )
}

export default function BuyerCheckPage({ params }: PageProps) {
  const project = PROJECTS.find((p) => p.slug === params.slug)
  if (!project) notFound()

  const reraRecord = RERA_RECORDS[project.id]
  const redFlags = RED_FLAGS[project.id] ?? []

  // Build checklist items
  const grievancePer100 = project.totalUnits > 0
    ? Math.round((project.openGrievances / project.totalUnits) * 100 * 10) / 10
    : 0

  const checks: CheckItem[] = [
    {
      label: 'RERA Status',
      value: reraRecord ? reraStatusLabel(reraRecord.status) : 'No RERA data',
      status: !reraRecord
        ? 'warning'
        : reraRecord.status === 'REGISTERED' ? 'ok'
        : reraRecord.status === 'COMPLETED' ? 'ok'
        : reraRecord.status === 'EXTENDED' ? 'warning'
        : 'critical',
      detail: reraRecord
        ? `RERA No: ${reraRecord.reraNumber} · Deadline: ${reraRecord.currentDeadline}`
        : 'Verify RERA status on MahaRERA portal before proceeding.',
    },
    {
      label: 'Delivery / Delay',
      value: project.delayMonths > 0 ? `${project.delayMonths} months behind` : 'On schedule',
      status: project.delayMonths === 0 ? 'ok' : project.delayMonths <= 6 ? 'warning' : 'critical',
      detail: project.delayMonths > 0
        ? `Project is currently ${project.delayMonths} months behind its RERA-registered completion date.`
        : 'Project is tracking on or ahead of schedule.',
    },
    {
      label: 'Construction Progress',
      value: reraRecord ? `${reraRecord.worksCompletedPct}% complete` : 'Unknown',
      status: !reraRecord ? 'info'
        : reraRecord.worksCompletedPct >= 80 ? 'ok'
        : reraRecord.worksCompletedPct >= 50 ? 'warning'
        : 'critical',
      detail: reraRecord
        ? `As per last MahaRERA update. Verify directly at site.`
        : 'Construction data not yet available on platform.',
    },
    {
      label: 'Occupancy Certificate (OC)',
      value: reraRecord?.status === 'COMPLETED' ? 'OC Obtained' : 'OC Pending',
      status: reraRecord?.status === 'COMPLETED' ? 'ok' : project.status === 'READY_TO_MOVE' ? 'warning' : 'info',
      detail: reraRecord?.status !== 'COMPLETED'
        ? 'OC is required before you can legally register your flat. Verify before making possession payment.'
        : 'Project has obtained Occupancy Certificate.',
    },
    {
      label: 'Active Grievances',
      value: `${project.openGrievances} open (${grievancePer100} per 100 units)`,
      status: grievancePer100 === 0 ? 'ok' : grievancePer100 < 5 ? 'info' : grievancePer100 < 10 ? 'warning' : 'critical',
      detail: grievancePer100 >= 10
        ? 'High grievance rate. Review the complaint categories for patterns before buying.'
        : 'Grievance rate is within normal range for this project size.',
    },
    {
      label: 'Red Flags',
      value: redFlags.length === 0 ? 'No red flags' : `${redFlags.filter(f => f.severity === 'CRITICAL').length} critical, ${redFlags.filter(f => f.severity === 'WARNING').length} warnings`,
      status: redFlags.length === 0 ? 'ok' : redFlags.some(f => f.severity === 'CRITICAL') ? 'critical' : 'warning',
      detail: redFlags.length > 0
        ? 'Read each red flag carefully — they represent significant buyer-protection concerns.'
        : 'No active red flags on this project.',
    },
    {
      label: 'Transparency Score',
      value: project.transparencyScore !== null ? `${project.transparencyScore}/100 (Grade ${project.transparencyGrade?.replace('_PLUS', '+')})` : 'Not scored',
      status: project.transparencyScore === null ? 'info'
        : project.transparencyScore >= 80 ? 'ok'
        : project.transparencyScore >= 65 ? 'warning'
        : 'critical',
      detail: 'Computed from RERA compliance, delivery record, grievances, and buyer sentiment.',
    },
  ]

  // Compute overall risk score (0-100)
  let riskScore = 0
  if (project.delayMonths > 24) riskScore += 30
  else if (project.delayMonths > 12) riskScore += 20
  else if (project.delayMonths > 0) riskScore += 10
  if (reraRecord?.status === 'LAPSED') riskScore += 30
  else if (reraRecord?.status === 'EXTENDED') riskScore += 10
  if (redFlags.some(f => f.severity === 'CRITICAL')) riskScore += 25
  else if (redFlags.length > 0) riskScore += 10
  if (grievancePer100 > 10) riskScore += 15
  else if (grievancePer100 > 5) riskScore += 5
  if (project.transparencyScore !== null && project.transparencyScore < 50) riskScore += 10

  const criticalCount = checks.filter(c => c.status === 'critical').length
  const warningCount = checks.filter(c => c.status === 'warning').length

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-neutral-500">
        <ol className="flex items-center gap-1 flex-wrap">
          <li><Link href="/" className="hover:text-neutral-700">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/projects" className="hover:text-neutral-700">Projects</Link></li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/projects/${project.slug}`} className="hover:text-neutral-700">
              {project.name}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-neutral-900 font-medium" aria-current="page">Buyer Check</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-5 w-5 text-primary-500" aria-hidden="true" />
          <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">Buyer's Due Diligence</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900">
          Should I Buy Here?
        </h1>
        <p className="text-neutral-600 mt-1">
          <span className="font-semibold">{project.name}</span> by {project.builderName}
        </p>
      </div>

      {/* Important disclaimer */}
      <div className="mb-6 rounded-xl bg-neutral-50 border border-neutral-200 p-4 flex items-start gap-3">
        <Info className="h-5 w-5 shrink-0 text-neutral-400 mt-0.5" aria-hidden="true" />
        <p className="text-xs text-neutral-600 leading-relaxed">
          <strong>Information aggregation only.</strong> REwebPortal does not provide financial, legal, or investment advice.
          This checklist is computed from RERA public data and platform-reported information — it may not reflect all relevant factors.
          Always physically visit the site and consult a qualified property lawyer before making any real estate decision.
        </p>
      </div>

      {/* Risk Meter */}
      <div className="mb-6">
        <RiskMeter score={riskScore} />
      </div>

      {/* Summary badges */}
      <div className="mb-6 flex flex-wrap gap-3">
        {criticalCount > 0 && (
          <span className="flex items-center gap-1.5 rounded-full border border-danger-400 bg-danger-50 px-3 py-1.5 text-sm font-semibold text-danger-700">
            <XCircle className="h-4 w-4" aria-hidden="true" />
            {criticalCount} critical issue{criticalCount > 1 ? 's' : ''}
          </span>
        )}
        {warningCount > 0 && (
          <span className="flex items-center gap-1.5 rounded-full border border-warning-400 bg-warning-50 px-3 py-1.5 text-sm font-semibold text-warning-700">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            {warningCount} warning{warningCount > 1 ? 's' : ''}
          </span>
        )}
        {criticalCount === 0 && warningCount === 0 && (
          <span className="flex items-center gap-1.5 rounded-full border border-success-400 bg-success-50 px-3 py-1.5 text-sm font-semibold text-success-700">
            <CheckCircle className="h-4 w-4" aria-hidden="true" />
            No critical issues found
          </span>
        )}
        <Badge variant={statusVariant(project.status)}>{statusLabel(project.status)}</Badge>
      </div>

      {/* Checklist */}
      <section className="mb-6">
        <h2 className="font-heading text-base font-semibold text-neutral-900 mb-3">Due Diligence Checklist</h2>
        <div className="space-y-3">
          {checks.map((item) => (
            <CheckRow key={item.label} item={item} />
          ))}
        </div>
      </section>

      {/* Red Flags */}
      {redFlags.length > 0 && (
        <section className="mb-6">
          <h2 className="font-heading text-base font-semibold text-neutral-900 mb-3">Active Red Flags</h2>
          <RedFlagAlert flags={redFlags} />
        </section>
      )}

      {/* Recommendations */}
      <section className="mb-6 rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="font-heading text-base font-semibold text-neutral-900 mb-4">
          Our Recommendations
        </h2>
        <ol className="space-y-3 text-sm text-neutral-700">
          <li className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white text-xs font-bold">1</span>
            <span>
              <strong>Visit the construction site</strong> before signing any agreement. Check actual progress vs. builder claims.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white text-xs font-bold">2</span>
            <span>
              <strong>Verify RERA directly</strong> on the{' '}
              <a
                href="https://maharera.mahaonline.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 hover:underline"
              >
                MahaRERA portal ↗
              </a>{' '}
              — cross-check registration status and completion dates.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white text-xs font-bold">3</span>
            <span>
              <strong>Read the community forum</strong> —{' '}
              <Link href={`/projects/${project.slug}`} className="text-primary-500 hover:underline">
                existing buyers often share the most up-to-date ground reality.
              </Link>
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white text-xs font-bold">4</span>
            <span>
              <strong>Consult a RERA lawyer</strong> before signing final sale agreement.{' '}
              <Link href="/legal/experts" className="text-primary-500 hover:underline">
                Find one here →
              </Link>
            </span>
          </li>
          {project.delayMonths > 0 && (
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-warning-500 text-white text-xs font-bold">5</span>
              <span>
                <strong>Calculate your delay compensation rights</strong> —{' '}
                <Link href="/tools/delay-calculator" className="text-primary-500 hover:underline">
                  use our RERA calculator
                </Link>{' '}
                to understand what you can claim under Section 18.
              </span>
            </li>
          )}
        </ol>
      </section>

      {/* CTAs */}
      <div className="grid gap-3 sm:grid-cols-3 mb-6">
        <Button variant="outline" asChild>
          <Link href={`/projects/${project.slug}`}>
            <Building className="h-4 w-4" />
            Full Project Details
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/legal/experts">
            <Scale className="h-4 w-4" />
            Find a Lawyer
          </Link>
        </Button>
        <Button asChild>
          <Link href="/login?next=/grievances/new">
            <Flag className="h-4 w-4" />
            File a Grievance
          </Link>
        </Button>
      </div>

      <DataDisclaimer lastUpdated="28 Apr 2025" />
    </div>
  )
}
