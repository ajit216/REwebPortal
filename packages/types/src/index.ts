// ─── Enums ───────────────────────────────────────────────────────────────────

export type UserRole = 'BUYER' | 'ADMIN' | 'MODERATOR'

export type VerificationStatus = 'UNVERIFIED' | 'PENDING_REVIEW' | 'VERIFIED_OWNER'

export type ProjectStatus =
  | 'UNDER_CONSTRUCTION'
  | 'NEARING_COMPLETION'
  | 'READY_TO_MOVE'
  | 'COMPLETED'
  | 'DELAYED'
  | 'STALLED'

export type GrievanceStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'ACKNOWLEDGED'
  | 'ESCALATED'
  | 'RESOLVED'
  | 'CLOSED_UNRESOLVED'

export type GrievanceSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type GrievanceCategory =
  | 'POSSESSION_DELAY'
  | 'CONSTRUCTION_QUALITY'
  | 'AMENITIES_NOT_DELIVERED'
  | 'FINANCIAL_DISCREPANCY'
  | 'LEGAL_TITLE_ISSUE'
  | 'POOR_COMMUNICATION'
  | 'OC_CERTIFICATE_DELAY'
  | 'RERA_VIOLATION'
  | 'OTHER'

export type RERARecordStatus =
  | 'REGISTERED'
  | 'EXTENDED'
  | 'LAPSED'
  | 'CANCELLED'
  | 'COMPLETED'

export type TransparencyGrade = 'A_PLUS' | 'A' | 'B' | 'C' | 'D'

export type CommunityGroupStatus = 'ACTIVE' | 'ARCHIVED' | 'CLOSED'

export type LegalResourceCategory =
  | 'RERA_RIGHTS'
  | 'CONSUMER_FORUM'
  | 'SAMPLE_NOTICES'
  | 'COURT_PROCEDURES'
  | 'GLOSSARY'
  | 'FAQ'

// ─── Core Models ─────────────────────────────────────────────────────────────

export interface Builder {
  id: string
  slug: string
  name: string
  logoUrl: string | null
  establishedYear: number | null
  website: string | null
  totalProjects: number
  delayedProjects: number
  avgDelayMonths: number | null
  totalGrievances: number
  transparencyScore: number | null
  transparencyGrade: TransparencyGrade | null
}

export interface ProjectUnit {
  id: string
  bhkType: string
  carpetAreaSqft: number
  priceLow: number
  priceHigh: number
}

export interface Project {
  id: string
  slug: string
  name: string
  builderName: string
  builderId: string
  locality: string
  city: string
  status: ProjectStatus
  coverImageUrl: string | null
  transparencyScore: number | null
  transparencyGrade: TransparencyGrade | null
  delayMonths: number
  openGrievances: number
  reraNumber: string
  priceRangeLow: number | null
  priceRangeHigh: number | null
  redFlagCount: number
  totalUnits: number
  verifiedBuyerCount: number
  description: string | null
  lat: number | null
  lng: number | null
  units: ProjectUnit[]
}

export interface RERARecord {
  id: string
  projectId: string
  reraNumber: string
  status: RERARecordStatus
  registrationDate: string
  originalCompletionDate: string
  currentDeadline: string
  worksCompletedPct: number
  promoterName: string
  violations: string[]
}

export interface ProjectTimeline {
  id: string
  milestone: string
  plannedDate: string
  actualDate: string | null
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'DELAYED'
  delayMonths: number
}

export interface RedFlag {
  id: string
  severity: 'CRITICAL' | 'WARNING'
  title: string
  description: string
  learnMorePath: string
}

export interface Thread {
  id: string
  title: string
  body: string
  authorDisplayName: string
  isVerifiedBuyer: boolean
  isAnonymous: boolean
  replyCount: number
  upvotes: number
  createdAt: string
  isPinned: boolean
  projectName?: string
}

export interface Grievance {
  id: string
  referenceId: string
  projectName: string
  category: GrievanceCategory
  severity: GrievanceSeverity
  title: string
  status: GrievanceStatus
  createdAt: string
  updatedAt: string
  isAnonymous: boolean
}

export interface LegalResource {
  id: string
  slug: string
  title: string
  summary: string
  category: LegalResourceCategory
  readingTimeMinutes: number
  publishedAt: string
}

export interface GrievanceCategorySummary {
  category: GrievanceCategory
  count: number
  percentage: number
}

export interface AnalyticsStats {
  totalProjects: number
  byStatus: Record<ProjectStatus, number>
  avgTransparencyScore: number
  totalGrievances: number
  activeGrievances: number
}

export interface BuilderScorecard {
  builderId: string
  builderName: string
  overallScore: number
  grade: TransparencyGrade
  breakdown: {
    reraCompliance: { score: number; weight: number }
    deliveryTrack: { score: number; weight: number }
    grievanceRate: { score: number; weight: number }
    transparency: { score: number; weight: number }
    buyerSentiment: { score: number; weight: number }
  }
  lastUpdated: string
}
