# Database Schema — REwebPortal

> All models are defined in `apps/api/src/prisma/schema.prisma`
> Database: PostgreSQL 16

---

## Entity Relationship Overview

```
Builder ──< Project ──< ProjectUnit
                    ──< ProjectTimeline
                    ──< RERARecord ──< RERAApproval
                    ──< Grievance ──< GrievanceEvidence
                    ──< CommunityGroup ──< Thread ──< Reply
                    ──< ProjectUpdateLog

User ──< BuyerProfile ──< BuyerProjectLink
     ──< Grievance
     ──< Thread
     ──< Reply

LegalResource
LegalExpert
NotificationQueue
AdminAction
```

---

## Prisma Schema

```prisma
// apps/api/src/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────

enum UserRole {
  BUYER
  ADMIN
  MODERATOR
}

enum VerificationStatus {
  UNVERIFIED
  PENDING_REVIEW     // Document submitted, awaiting admin check
  VERIFIED_OWNER     // Confirmed property owner
}

enum ProjectStatus {
  UNDER_CONSTRUCTION
  NEARING_COMPLETION // >85% construction
  READY_TO_MOVE
  COMPLETED
  DELAYED            // >6 months past RERA deadline
  STALLED            // No activity >12 months
}

enum GrievanceStatus {
  DRAFT
  SUBMITTED
  ACKNOWLEDGED
  ESCALATED          // Forwarded to RERA/consumer forum
  RESOLVED
  CLOSED_UNRESOLVED
}

enum GrievanceSeverity {
  LOW     // Minor delay, communication issues
  MEDIUM  // Construction defect, possession delay
  HIGH    // Financial fraud, title dispute
  CRITICAL // Mass complaint, project stalled
}

enum GrievanceCategory {
  POSSESSION_DELAY
  CONSTRUCTION_QUALITY
  AMENITIES_NOT_DELIVERED
  FINANCIAL_DISCREPANCY
  LEGAL_TITLE_ISSUE
  POOR_COMMUNICATION
  OC_CERTIFICATE_DELAY
  RERA_VIOLATION
  OTHER
}

enum RERARecordStatus {
  REGISTERED
  EXTENDED
  LAPSED
  CANCELLED
  COMPLETED
}

enum TransparencyGrade {
  A_PLUS  // 90-100 score
  A       // 80-89
  B       // 65-79
  C       // 50-64
  D       // Below 50
}

enum CommunityGroupStatus {
  ACTIVE
  ARCHIVED
  CLOSED
}

enum LegalResourceCategory {
  RERA_RIGHTS
  CONSUMER_FORUM
  SAMPLE_NOTICES
  COURT_PROCEDURES
  GLOSSARY
  FAQ
}

// ─────────────────────────────────────────────
// USER & AUTH
// ─────────────────────────────────────────────

model User {
  id                String             @id @default(cuid())
  phone             String             @unique              // Primary identifier (India mobile)
  phoneVerified     Boolean            @default(false)
  email             String?            @unique
  passwordHash      String?                                 // Admin/moderator only
  role              UserRole           @default(BUYER)
  isActive          Boolean            @default(true)
  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt
  lastLoginAt       DateTime?

  // Relations
  buyerProfile      BuyerProfile?
  grievances        Grievance[]
  threads           Thread[]
  replies           Reply[]
  adminActions      AdminAction[]
  notifications     NotificationQueue[]

  @@index([phone])
  @@index([role])
  @@map("users")
}

model BuyerProfile {
  id                  String              @id @default(cuid())
  userId              String              @unique
  displayName         String                                // First name + last initial (e.g., "Ramesh K.")
  verificationStatus  VerificationStatus  @default(UNVERIFIED)
  verificationDocKey  String?                               // R2 object key — encrypted PDF
  verifiedAt          DateTime?
  verifiedByAdminId   String?
  preferredLocalities String[]                              // e.g., ["Thane West", "Mulund"]
  createdAt           DateTime            @default(now())
  updatedAt           DateTime            @updatedAt

  user                User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  projectLinks        BuyerProjectLink[]

  @@map("buyer_profiles")
}

model BuyerProjectLink {
  id               String   @id @default(cuid())
  buyerProfileId   String
  projectId        String
  unitTypeId       String?                      // Which unit type purchased
  unitNumberHash   String                       // SHA-256 of actual unit number — for uniqueness, not display
  isVerified       Boolean  @default(false)     // True only after admin validates agreement doc
  linkedAt         DateTime @default(now())

  buyerProfile     BuyerProfile @relation(fields: [buyerProfileId], references: [id], onDelete: Cascade)
  project          Project      @relation(fields: [projectId], references: [id])

  @@unique([buyerProfileId, projectId])         // One link per buyer per project
  @@index([projectId])
  @@map("buyer_project_links")
}

// OTP Records — short-lived, deleted after verification
model OTPRecord {
  id          String   @id @default(cuid())
  phone       String
  otpHash     String                       // bcrypt hash of OTP (never store plain OTP)
  expiresAt   DateTime
  attempts    Int      @default(0)
  used        Boolean  @default(false)
  createdAt   DateTime @default(now())

  @@index([phone])
  @@map("otp_records")
}

// ─────────────────────────────────────────────
// BUILDER
// ─────────────────────────────────────────────

model Builder {
  id                    String             @id @default(cuid())
  slug                  String             @unique
  name                  String
  legalEntityName       String                               // Registered company name
  cinNumber             String?                              // Corporate Identity Number
  establishedYear       Int?
  headquartersCity      String             @default("Mumbai")
  logoUrl               String?
  websiteUrl            String?
  contactEmail          String?
  contactPhone          String?
  description           String?

  // Transparency Scoring (computed, cached)
  transparencyScore     Float?                               // 0-100, recomputed on trigger
  transparencyGrade     TransparencyGrade?
  scoreLastComputedAt   DateTime?

  // Stats (denormalized for performance)
  totalProjects         Int                @default(0)
  activeProjects        Int                @default(0)
  completedProjects     Int                @default(0)
  delayedProjects       Int                @default(0)
  totalGrievances       Int                @default(0)
  avgDelayMonths        Float?

  isActive              Boolean            @default(true)
  createdAt             DateTime           @default(now())
  updatedAt             DateTime           @updatedAt

  projects              Project[]
  documents             BuilderDocument[]

  @@index([slug])
  @@index([transparencyScore])
  @@map("builders")
}

model BuilderDocument {
  id          String   @id @default(cuid())
  builderId   String
  docType     String                       // "incorporation", "pan", "annual_report"
  docLabel    String
  fileKey     String                       // R2 object key
  uploadedAt  DateTime @default(now())

  builder     Builder  @relation(fields: [builderId], references: [id], onDelete: Cascade)

  @@map("builder_documents")
}

// ─────────────────────────────────────────────
// PROJECT
// ─────────────────────────────────────────────

model Project {
  id                    String          @id @default(cuid())
  slug                  String          @unique
  builderId             String
  name                  String
  reraNumber            String          @unique
  status                ProjectStatus   @default(UNDER_CONSTRUCTION)

  // Location
  locality              String                               // e.g., "Thane West"
  subLocality           String?                              // e.g., "Ghodbunder Road"
  city                  String                               // "Mumbai" or "Thane"
  pincode               String
  latitude              Float?
  longitude             Float?
  googleMapsUrl         String?

  // Project Details
  totalUnits            Int
  completedUnits        Int             @default(0)
  totalTowers           Int?
  floorsPerTower        Int?
  projectAreaSqFt       Float?
  amenities             String[]                             // ["gym", "pool", "clubhouse"]
  nearbyLandmarks       String[]

  // Dates
  reraRegistrationDate  DateTime
  reraExpiryDate        DateTime                             // Original RERA completion deadline
  revisedCompletionDate DateTime?                           // Admin-updated revised date
  actualCompletionDate  DateTime?

  // Financial (from RERA filings — public data only)
  approxPricePerSqFt    Int?                                // ₹ per sq ft
  priceRangeLow         Int?                                // ₹ in lakhs
  priceRangeHigh        Int?

  // Media
  coverImageUrl         String?
  imageUrls             String[]

  // Computed stats (denormalized)
  delayMonths           Int             @default(0)
  totalGrievances       Int             @default(0)
  openGrievances        Int             @default(0)
  verifiedBuyerCount    Int             @default(0)
  transparencyScore     Float?

  isPublished           Boolean         @default(false)     // Admin publishes after data review
  createdAt             DateTime        @default(now())
  updatedAt             DateTime        @updatedAt

  // Full-text search vector (auto-updated via trigger)
  searchVector          Unsupported("tsvector")?

  builder               Builder         @relation(fields: [builderId], references: [id])
  unitTypes             ProjectUnitType[]
  timelines             ProjectTimeline[]
  reraRecords           RERARecord[]
  grievances            Grievance[]
  communityGroups       CommunityGroup[]
  buyerLinks            BuyerProjectLink[]
  updateLogs            ProjectUpdateLog[]
  redFlags              ProjectRedFlag[]

  @@index([builderId])
  @@index([status])
  @@index([city, locality])
  @@index([reraNumber])
  @@index([searchVector], type: Gin)    // GIN index for full-text search
  @@map("projects")
}

model ProjectUnitType {
  id              String   @id @default(cuid())
  projectId       String
  bhkType         String                       // "1BHK", "2BHK", "3BHK", "4BHK"
  carpetAreaSqFt  Float
  priceFrom       Int                          // ₹ in lakhs
  priceTo         Int
  totalUnits      Int
  soldUnits       Int      @default(0)
  floorPlanUrl    String?

  project         Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@map("project_unit_types")
}

model ProjectTimeline {
  id             String   @id @default(cuid())
  projectId      String
  milestoneLabel String                        // "Foundation", "Structure Floor 10", "OC Applied"
  plannedDate    DateTime
  actualDate     DateTime?
  isCompleted    Boolean  @default(false)
  notes          String?
  source         String   @default("admin")   // "admin" | "rera" | "builder_update"

  project        Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId])
  @@map("project_timelines")
}

model ProjectUpdateLog {
  id          String   @id @default(cuid())
  projectId   String
  updatedBy   String                           // Admin user ID
  field       String                           // Which field was changed
  oldValue    String?
  newValue    String?
  reason      String?
  updatedAt   DateTime @default(now())

  project     Project  @relation(fields: [projectId], references: [id])

  @@index([projectId])
  @@map("project_update_logs")
}

model ProjectRedFlag {
  id          String   @id @default(cuid())
  projectId   String
  flagType    String                           // "rera_lapsed", "stalled", "mass_complaint", "oc_delayed"
  severity    String                           // "warning" | "critical"
  title       String
  description String
  detectedAt  DateTime @default(now())
  resolvedAt  DateTime?
  isActive    Boolean  @default(true)

  project     Project  @relation(fields: [projectId], references: [id])

  @@index([projectId, isActive])
  @@map("project_red_flags")
}

// ─────────────────────────────────────────────
// RERA
// ─────────────────────────────────────────────

model RERARecord {
  id                    String           @id @default(cuid())
  projectId             String
  reraNumber            String
  status                RERARecordStatus
  registrationDate      DateTime
  originalExpiryDate    DateTime
  currentExpiryDate     DateTime
  promoterName          String
  carpetAreaSold        Float?           // % sold
  worksDonePercentage   Float?
  extensionGranted      Boolean          @default(false)
  extensionReason       String?

  // Raw RERA data (flexible JSONB for any additional fields)
  rawData               Json?

  lastSyncedAt          DateTime?
  syncedByAdminId       String?
  createdAt             DateTime         @default(now())
  updatedAt             DateTime         @updatedAt

  project               Project          @relation(fields: [projectId], references: [id])
  approvals             RERAApproval[]
  violations            RERAViolation[]

  @@index([projectId])
  @@index([reraNumber])
  @@map("rera_records")
}

model RERAApproval {
  id            String   @id @default(cuid())
  reraRecordId  String
  approvalType  String                           // "IOD", "CC", "OC", "BCC", "full_OC"
  approvalDate  DateTime?
  isObtained    Boolean  @default(false)
  notes         String?

  reraRecord    RERARecord @relation(fields: [reraRecordId], references: [id], onDelete: Cascade)

  @@map("rera_approvals")
}

model RERAViolation {
  id               String   @id @default(cuid())
  reraRecordId     String
  violationDate    DateTime
  violationType    String
  description      String
  penaltyAmount    Float?
  isResolved       Boolean  @default(false)
  resolvedDate     DateTime?
  sourceUrl        String?

  reraRecord       RERARecord @relation(fields: [reraRecordId], references: [id], onDelete: Cascade)

  @@map("rera_violations")
}

// ─────────────────────────────────────────────
// GRIEVANCE
// ─────────────────────────────────────────────

model Grievance {
  id             String              @id @default(cuid())
  projectId      String
  userId         String
  category       GrievanceCategory
  severity       GrievanceSeverity
  status         GrievanceStatus     @default(SUBMITTED)
  title          String
  description    String
  isAnonymous    Boolean             @default(false)       // Hides buyer identity in public view
  isVerifiedBuyer Boolean            @default(false)       // True if user has verified ownership

  // Resolution tracking
  builderResponse     String?
  resolutionNotes     String?
  resolvedAt          DateTime?
  escalatedAt         DateTime?
  escalatedTo         String?                              // "RERA" | "Consumer Forum" | "High Court"

  // Internal
  adminNotes          String?
  isPubliclyVisible   Boolean         @default(true)
  upvoteCount         Int             @default(0)          // Other buyers can upvote (solidarity)

  createdAt           DateTime        @default(now())
  updatedAt           DateTime        @updatedAt

  project             Project         @relation(fields: [projectId], references: [id])
  user                User            @relation(fields: [userId], references: [id])
  evidenceFiles       GrievanceEvidence[]
  statusHistory       GrievanceStatusHistory[]

  @@index([projectId, status])
  @@index([userId])
  @@index([category])
  @@map("grievances")
}

model GrievanceEvidence {
  id           String   @id @default(cuid())
  grievanceId  String
  fileKey      String                           // R2 object key (encrypted)
  fileType     String                           // "pdf", "jpg", "png"
  fileName     String                           // Original filename
  fileSizeBytes Int
  uploadedAt   DateTime @default(now())

  grievance    Grievance @relation(fields: [grievanceId], references: [id], onDelete: Cascade)

  @@map("grievance_evidence")
}

model GrievanceStatusHistory {
  id           String          @id @default(cuid())
  grievanceId  String
  fromStatus   GrievanceStatus
  toStatus     GrievanceStatus
  changedBy    String                           // Admin user ID
  note         String?
  changedAt    DateTime        @default(now())

  grievance    Grievance @relation(fields: [grievanceId], references: [id], onDelete: Cascade)

  @@map("grievance_status_history")
}

// ─────────────────────────────────────────────
// COMMUNITY
// ─────────────────────────────────────────────

model CommunityGroup {
  id           String               @id @default(cuid())
  projectId    String
  name         String                                       // "Lodha Palava Residents - Block A"
  status       CommunityGroupStatus @default(ACTIVE)
  memberCount  Int                  @default(0)
  description  String?

  // WhatsApp group — invite link managed externally, NEVER stored here
  // Platform only stores: "has WhatsApp group? Y/N" + contact admin instruction
  hasWhatsAppGroup  Boolean         @default(false)
  whatsAppAdminNote String?          // Admin contact to request joining (no public link)

  createdAt    DateTime             @default(now())
  updatedAt    DateTime             @updatedAt

  project      Project              @relation(fields: [projectId], references: [id])
  threads      Thread[]

  @@index([projectId])
  @@map("community_groups")
}

model Thread {
  id              String   @id @default(cuid())
  communityGroupId String
  authorId        String
  title           String
  body            String
  isPinned        Boolean  @default(false)
  isLocked        Boolean  @default(false)
  replyCount      Int      @default(0)
  upvoteCount     Int      @default(0)
  isVerifiedBuyer Boolean  @default(false)
  isAnonymous     Boolean  @default(false)
  isVisible       Boolean  @default(true)   // Admin can hide

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  communityGroup  CommunityGroup @relation(fields: [communityGroupId], references: [id])
  author          User           @relation(fields: [authorId], references: [id])
  replies         Reply[]

  @@index([communityGroupId])
  @@index([authorId])
  @@map("threads")
}

model Reply {
  id              String   @id @default(cuid())
  threadId        String
  authorId        String
  body            String
  parentReplyId   String?                                   // For nested replies (1 level deep)
  upvoteCount     Int      @default(0)
  isVerifiedBuyer Boolean  @default(false)
  isAnonymous     Boolean  @default(false)
  isVisible       Boolean  @default(true)

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  thread          Thread   @relation(fields: [threadId], references: [id], onDelete: Cascade)
  author          User     @relation(fields: [authorId], references: [id])

  @@index([threadId])
  @@map("replies")
}

// ─────────────────────────────────────────────
// LEGAL RESOURCES
// ─────────────────────────────────────────────

model LegalResource {
  id          String                @id @default(cuid())
  slug        String                @unique
  title       String
  category    LegalResourceCategory
  summary     String
  body        String                                        // Markdown content
  tags        String[]
  isPublished Boolean               @default(false)
  readTimeMin Int?
  authorName  String?
  reviewedBy  String?               // Legal expert name
  reviewedAt  DateTime?
  publishedAt DateTime?
  createdAt   DateTime              @default(now())
  updatedAt   DateTime              @updatedAt

  @@index([category])
  @@map("legal_resources")
}

model LegalExpert {
  id              String   @id @default(cuid())
  name            String
  specialization  String[]                                  // ["RERA", "Consumer Forum", "Property Law"]
  city            String
  barCouncilId    String?
  profileSummary  String
  contactEmail    String?
  contactPhone    String?
  websiteUrl      String?
  offersProBono   Boolean  @default(false)
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())

  @@map("legal_experts")
}

// ─────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────

model NotificationQueue {
  id           String   @id @default(cuid())
  userId       String
  channel      String                           // "email" | "sms"
  templateKey  String
  payload      Json                             // Template variables
  status       String   @default("pending")    // "pending" | "sent" | "failed"
  attempts     Int      @default(0)
  lastAttemptAt DateTime?
  sentAt       DateTime?
  createdAt    DateTime @default(now())

  user         User     @relation(fields: [userId], references: [id])

  @@index([status, attempts])
  @@map("notification_queue")
}

// ─────────────────────────────────────────────
// ADMIN
// ─────────────────────────────────────────────

model AdminAction {
  id         String   @id @default(cuid())
  adminId    String
  actionType String                            // "project_publish", "rera_sync", "grievance_update"
  entityType String                            // "project", "builder", "grievance"
  entityId   String
  notes      String?
  metadata   Json?
  performedAt DateTime @default(now())

  admin      User     @relation(fields: [adminId], references: [id])

  @@index([adminId])
  @@index([entityType, entityId])
  @@map("admin_actions")
}
```

---

## Key Database Indexes Summary

| Table | Index | Purpose |
|---|---|---|
| `users` | `phone` | OTP login lookup |
| `projects` | `city, locality` | Geographic filtering |
| `projects` | `status` | Status filter |
| `projects` | `searchVector` (GIN) | Full-text search |
| `grievances` | `projectId, status` | Per-project complaint count |
| `threads` | `communityGroupId` | Forum listing |
| `rera_records` | `reraNumber` | RERA lookup by number |

---

## PostgreSQL Trigger — Full Text Search Update

```sql
-- Run as migration
CREATE OR REPLACE FUNCTION update_project_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW."searchVector" := to_tsvector(
    'english',
    COALESCE(NEW.name, '') || ' ' ||
    COALESCE(NEW.locality, '') || ' ' ||
    COALESCE(NEW."subLocality", '') || ' ' ||
    COALESCE(NEW."reraNumber", '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER project_search_vector_update
BEFORE INSERT OR UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION update_project_search_vector();
```

---

## Transparency Score Computation

```typescript
// Computed on: new grievance, RERA update, milestone update
// Stored in: projects.transparencyScore, builders.transparencyScore

function computeProjectTransparencyScore(project: ProjectWithRelations): number {
  let score = 100;

  // Deductions
  if (project.delayMonths > 0)         score -= Math.min(project.delayMonths * 2, 20); // max -20
  if (project.reraRecords[0]?.status === 'LAPSED')  score -= 25;
  if (project.openGrievances > 10)     score -= 15;
  else if (project.openGrievances > 5) score -= 8;
  if (project.redFlags.filter(f => f.isActive && f.severity === 'critical').length > 0) score -= 20;
  if (project.redFlags.filter(f => f.isActive && f.severity === 'warning').length > 0)  score -= 10;

  // Bonuses
  if (project.reraRecords[0]?.worksDonePercentage > 80) score += 5;
  const completedApprovals = project.reraRecords[0]?.approvals?.filter(a => a.isObtained).length ?? 0;
  score += Math.min(completedApprovals * 3, 15);

  return Math.max(0, Math.min(100, Math.round(score)));
}
```
