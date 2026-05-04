import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { TransparencyGrade, ProjectStatus, RERARecordStatus, GrievanceStatus, GrievanceSeverity } from '@rewebportal/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(0)}L`
  }
  return `₹${amount.toLocaleString('en-IN')}`
}

export function formatPriceRange(low: number | null, high: number | null): string {
  if (!low && !high) return 'Price on request'
  if (!high) return `From ${formatCurrency(low!)}`
  if (!low) return `Up to ${formatCurrency(high)}`
  return `${formatCurrency(low)} – ${formatCurrency(high)}`
}

export function getGradeColor(grade: TransparencyGrade | null): string {
  switch (grade) {
    case 'A_PLUS':
    case 'A':
      return 'text-success-500'
    case 'B':
      return 'text-info-500'
    case 'C':
      return 'text-warning-500'
    case 'D':
      return 'text-danger-500'
    default:
      return 'text-neutral-400'
  }
}

export function getGradeBgColor(grade: TransparencyGrade | null): string {
  switch (grade) {
    case 'A_PLUS':
    case 'A':
      return 'bg-success-50 border-success-500 text-success-700'
    case 'B':
      return 'bg-info-50 border-info-500 text-info-700'
    case 'C':
      return 'bg-warning-50 border-warning-500 text-warning-700'
    case 'D':
      return 'bg-danger-50 border-danger-500 text-danger-700'
    default:
      return 'bg-neutral-100 border-neutral-200 text-neutral-600'
  }
}

export function getScoreCircleColor(score: number): string {
  if (score >= 80) return '#22C55E'
  if (score >= 65) return '#0EA5E9'
  if (score >= 50) return '#EAB308'
  return '#EF4444'
}

export function gradeLabel(grade: TransparencyGrade | null): string {
  switch (grade) {
    case 'A_PLUS': return 'A+'
    case 'A': return 'A'
    case 'B': return 'B'
    case 'C': return 'C'
    case 'D': return 'D'
    default: return 'N/A'
  }
}

export function statusLabel(status: ProjectStatus): string {
  switch (status) {
    case 'UNDER_CONSTRUCTION': return 'Under Construction'
    case 'NEARING_COMPLETION': return 'Nearing Completion'
    case 'READY_TO_MOVE': return 'Ready to Move'
    case 'COMPLETED': return 'Completed'
    case 'DELAYED': return 'Delayed'
    case 'STALLED': return 'Stalled'
    default: return status
  }
}

export function statusVariant(status: ProjectStatus): 'success' | 'info' | 'warning' | 'danger' {
  switch (status) {
    case 'READY_TO_MOVE':
    case 'COMPLETED':
      return 'success'
    case 'UNDER_CONSTRUCTION':
      return 'info'
    case 'NEARING_COMPLETION':
      return 'warning'
    case 'DELAYED':
    case 'STALLED':
      return 'danger'
    default:
      return 'info'
  }
}

export function reraStatusLabel(status: RERARecordStatus): string {
  switch (status) {
    case 'REGISTERED': return 'RERA Active'
    case 'EXTENDED': return 'RERA Extended'
    case 'LAPSED': return 'RERA Lapsed'
    case 'CANCELLED': return 'RERA Cancelled'
    case 'COMPLETED': return 'Completed'
    default: return status
  }
}

export function reraStatusVariant(status: RERARecordStatus): 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case 'REGISTERED': return 'success'
    case 'EXTENDED': return 'warning'
    case 'COMPLETED': return 'info'
    case 'LAPSED':
    case 'CANCELLED':
      return 'danger'
    default:
      return 'info'
  }
}

export function grievanceStatusLabel(status: GrievanceStatus): string {
  switch (status) {
    case 'DRAFT': return 'Draft'
    case 'SUBMITTED': return 'Submitted'
    case 'ACKNOWLEDGED': return 'Acknowledged'
    case 'ESCALATED': return 'Escalated'
    case 'RESOLVED': return 'Resolved'
    case 'CLOSED_UNRESOLVED': return 'Closed (Unresolved)'
    default: return status
  }
}

export function grievanceCategoryLabel(cat: string): string {
  const labels: Record<string, string> = {
    POSSESSION_DELAY: 'Possession Delay',
    CONSTRUCTION_QUALITY: 'Construction Quality',
    AMENITIES_NOT_DELIVERED: 'Amenities Not Delivered',
    FINANCIAL_DISCREPANCY: 'Financial Discrepancy',
    LEGAL_TITLE_ISSUE: 'Legal/Title Issue',
    POOR_COMMUNICATION: 'Poor Communication',
    OC_CERTIFICATE_DELAY: 'OC Certificate Delay',
    RERA_VIOLATION: 'RERA Violation',
    OTHER: 'Other',
  }
  return labels[cat] ?? cat
}

export function severityLabel(sev: GrievanceSeverity): string {
  switch (sev) {
    case 'LOW': return 'Low'
    case 'MEDIUM': return 'Medium'
    case 'HIGH': return 'High'
    case 'CRITICAL': return 'Critical'
    default: return sev
  }
}
