# Component Library — REwebPortal

> Built on shadcn/ui primitives. All components are in `apps/web/components/`.
> Props are TypeScript-typed. All components are accessible (WCAG 2.1 AA).

---

## 1. Project Components (`components/project/`)

### ProjectCard
Used in: Project directory grid, search results, builder project list

```tsx
interface ProjectCardProps {
  project: {
    slug: string
    name: string
    builderName: string
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
  }
}

// Visual structure:
// ┌─────────────────────────────────┐
// │ [Cover Image 16:9]              │
// │ [Status Badge]    [Score Badge] │
// ├─────────────────────────────────┤
// │ Project Name                    │
// │ by Builder Name                 │
// │ 📍 Locality, City               │
// │                                 │
// │ ⏰ 14mo delay  ⚠️ 23 complaints │
// │ ₹85L – ₹1.2Cr                  │
// │ [View Project →]                │
// └─────────────────────────────────┘
```

### TransparencyScoreBadge
```tsx
interface TransparencyScoreBadgeProps {
  score: number        // 0-100
  grade: TransparencyGrade
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}
// Circular gauge with grade letter, color-coded
```

### ProjectStatusBadge
```tsx
interface ProjectStatusBadgeProps {
  status: ProjectStatus
  reraStatus?: RERARecordStatus
  showIcon?: boolean
}
// Colored pill badge with icon
```

### RedFlagAlert
```tsx
interface RedFlagAlertProps {
  flags: ProjectRedFlag[]  // active flags only
  compact?: boolean        // compact = show count only; full = list all flags
}
// compact: "⛔ 2 Critical Flags"
// full: Expandable list of flag cards with descriptions
```

### ProjectStatsRow
```tsx
interface ProjectStatsRowProps {
  totalUnits: number
  delayMonths: number
  openGrievances: number
  verifiedBuyerCount: number
}
// Row of 4 stat pills with icons
```

### TimelineChart
```tsx
interface TimelineChartProps {
  milestones: ProjectTimeline[]
  reraDeadline: Date
  revisedDeadline?: Date
}
// Vertical timeline with planned vs actual dates
// Color-coded: green (on-time), red (delayed), grey (future)
```

### RERAStatusCard
```tsx
interface RERAStatusCardProps {
  reraRecord: RERARecord
  approvals: RERAApproval[]
  violations: RERAViolation[]
}
// Card showing RERA registration, status, approvals checklist, violations
```

---

## 2. Builder Components (`components/builder/`)

### BuilderCard
```tsx
interface BuilderCardProps {
  builder: {
    slug: string
    name: string
    logoUrl: string | null
    transparencyScore: number | null
    transparencyGrade: TransparencyGrade | null
    totalProjects: number
    delayedProjects: number
    avgDelayMonths: number | null
    totalGrievances: number
  }
}
// Builder logo + name + grade + quick stats
```

### TransparencyScorecardBreakdown
```tsx
interface ScorecardBreakdownProps {
  scorecard: {
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
}
// Full scorecard with animated score bars per dimension
// Disclaimer text rendered below
```

### BuilderComparisionTable
```tsx
interface BuilderComparisonTableProps {
  builders: BuilderScorecard[]  // max 3
}
// Side-by-side comparison grid
```

---

## 3. Grievance Components (`components/grievance/`)

### GrievanceForm
Multi-step form for submitting a complaint.

```tsx
// Step 1: Category + Severity selection (visual card grid)
// Step 2: Title + Description + Rich text hints
// Step 3: File upload (drag-and-drop, multi-file)
// Step 4: Privacy toggle + Review + Submit

interface GrievanceFormProps {
  projectId: string
  projectName: string
  onSuccess: (grievanceId: string) => void
}
```

### GrievanceCategorySummary
```tsx
interface GrievanceCategorySummaryProps {
  summary: Array<{ category: GrievanceCategory; count: number; percentage: number }>
  totalCount: number
  openCount: number
}
// Donut chart + breakdown table
// Used on public-facing project grievance tab
```

### GrievanceStatusBadge
```tsx
interface GrievanceStatusBadgeProps {
  status: GrievanceStatus
  showIcon?: boolean
}
// SUBMITTED → blue, ACKNOWLEDGED → amber, RESOLVED → green, ESCALATED → purple
```

### GrievanceCard (My Grievances view)
```tsx
interface GrievanceCardProps {
  grievance: GrievanceFull
  showActions?: boolean   // shows edit/escalate if showActions=true
}
// Shows title, category, severity, status, date filed, last update
```

### FileUploadZone
```tsx
interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void
  maxFiles?: number        // default: 3
  maxSizeBytes?: number    // default: 10MB
  acceptedTypes?: string[] // default: ['pdf', 'jpg', 'png']
  label?: string
}
// Drag-and-drop zone with file type icons and size validation
```

---

## 4. Community Components (`components/community/`)

### ThreadCard
```tsx
interface ThreadCardProps {
  thread: ThreadSummary
  showProjectName?: boolean
}
// Author (display name or "Verified Buyer"), verified badge, 
// title, reply count, upvotes, timestamp
// Click navigates to full thread
```

### ThreadDetail
```tsx
interface ThreadDetailProps {
  thread: ThreadDetail
  currentUserId?: string
}
// Full thread post + replies with nesting
// Reply composer at bottom
```

### ReplyComposer
```tsx
interface ReplyComposerProps {
  threadId: string
  parentReplyId?: string | null
  onSubmit: (body: string, isAnonymous: boolean) => Promise<void>
  placeholder?: string
}
// Textarea + anonymous toggle + submit button
// Character counter (max 1000)
```

### VerifiedBuyerBadge
```tsx
interface VerifiedBuyerBadgeProps {
  isVerified: boolean
  isAnonymous: boolean
  displayName: string    // ignored if isAnonymous=true
  size?: 'sm' | 'md'
}
// "Ramesh K. ✅" or "Verified Buyer ✅" or "Community Member"
```

### WhatsAppGroupCard
```tsx
interface WhatsAppGroupCardProps {
  communityGroup: CommunityGroup
  currentUserIsVerifiedBuyer: boolean
  onRequestJoin: () => void
}
// Shows group exists, member count, join request CTA
// If not verified buyer: shows "Verify ownership to join"
```

---

## 5. Analytics Components (`components/analytics/`)

### DelayBarChart
```tsx
interface DelayBarChartProps {
  data: Array<{ builderName: string; avgDelayMonths: number }>
  highlightBuilderId?: string
}
// Horizontal bar chart using Recharts
```

### GrievanceTrendChart
```tsx
interface GrievanceTrendChartProps {
  data: Array<{ month: string; count: number }>
  title?: string
}
// Line chart — 12 months of grievance filing trend
```

### MarketOverviewStats
```tsx
interface MarketOverviewStatsProps {
  stats: {
    totalProjects: number
    byStatus: Record<ProjectStatus, number>
    avgTransparencyScore: number
    totalGrievances: number
    activeGrievances: number
  }
}
// Grid of stat cards with trend indicators
```

### ProjectRiskMeter
```tsx
interface ProjectRiskMeterProps {
  score: number        // 0-100, higher = more risk
  label?: string
}
// Horizontal meter: Low (green) → Medium (amber) → High (red) → Critical (dark red)
// Needle/dot indicator + label
```

---

## 6. Shared/Layout Components (`components/shared/`)

### PageHeader
```tsx
interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: Array<{ label: string; href?: string }>
  actions?: React.ReactNode
}
```

### SearchBar
```tsx
interface SearchBarProps {
  placeholder: string
  onSearch: (query: string) => void
  defaultValue?: string
  showFilters?: boolean
  onFiltersClick?: () => void
}
// Text input + search icon + optional filter button
// Debounced — waits 300ms before triggering search
```

### FilterPanel (sidebar/sheet)
```tsx
interface FilterPanelProps {
  filters: FilterConfig
  activeFilters: FilterValues
  onChange: (filters: FilterValues) => void
  onReset: () => void
}
// Used in project directory — city, locality, status, BHK, price, score
// On mobile: slides up as sheet
// On desktop: left sidebar
```

### InfoTooltip
```tsx
interface InfoTooltipProps {
  content: string | React.ReactNode
  iconSize?: number
}
// ℹ️ icon with hover/focus tooltip
// Used next to technical terms (RERA, IOD, CC, OC, etc.)
```

### EmptyState
```tsx
interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: { label: string; href: string }
}
// Centered empty state with icon, title, description, optional CTA
```

### DataDisclaimer
```tsx
interface DataDisclaimerProps {
  lastUpdated?: string
  source?: string
  extraNote?: string
}
// Small grey disclaimer bar: "Data sourced from MahaRERA. Last synced: [date]."
// Used below all RERA data sections
```

### AlertBanner
```tsx
interface AlertBannerProps {
  type: 'info' | 'warning' | 'danger'
  message: string
  linkLabel?: string
  linkHref?: string
  dismissible?: boolean
}
// Full-width page banner — used for platform announcements, critical flags
```

---

## 7. Form Components (Auth/Verification)

### OTPInput
```tsx
interface OTPInputProps {
  length: number     // 6
  onComplete: (otp: string) => void
  error?: string
}
// 6 individual digit boxes with auto-advance and backspace handling
// Auto-focus first on mount
```

### PhoneInput
```tsx
interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
  disabled?: boolean
}
// +91 prefix fixed (India only)
// 10-digit numeric validation
```

### DocumentUploadCard
```tsx
interface DocumentUploadCardProps {
  label: string
  description: string
  acceptedTypes: string[]
  onUpload: (file: File) => Promise<void>
  status?: 'idle' | 'uploading' | 'success' | 'error'
  privacyNote?: string
}
// Used in ownership verification flow
// Shows privacy note about document handling
```
