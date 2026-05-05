# Admin Panel — REwebPortal

The admin panel is the operational backbone of the platform. It is exclusively for `ADMIN` and `MODERATOR` role users. Admins access it via `/admin` (requires email + password login — separate from buyer OTP flow).

---

## 1. Admin Authentication

Admin login is intentionally separate from buyer login:

```
/admin/login (public page, not linked from public nav)
  → Email + Password (no OTP)
  → bcrypt(cost=12) validation
  → Admin JWT (8-hour TTL, not 15-minute)
  → All admin actions logged to admin_actions table
  → Failed logins: lockout after 5 attempts for 30 minutes
```

Admin accounts are **provisioned manually** — there is no admin self-registration.

---

## 2. Admin Dashboard (Overview)

**URL:** `/admin`

The landing page after admin login. Shows platform health at a glance.

```
PLATFORM HEALTH — ADMIN DASHBOARD
Today: 28 April 2025 | Logged in as: admin@rewebportal.in

IMMEDIATE ACTION REQUIRED
┌────────────────────────────────────────────────────────────────┐
│ 🔴 12 unacknowledged grievances (>2 days old)    [Review →]   │
│ 🟡 47 buyer verification requests pending         [Review →]   │
│ 🟡 8 moderation reports in queue                  [Review →]   │
│ 🔵 23 projects due for RERA sync (>30 days)       [Sync →]    │
└────────────────────────────────────────────────────────────────┘

PLATFORM STATS (THIS MONTH)
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│  8,432   │ │  2,109   │ │  1,243   │ │   234    │
│  Users   │ │Verified  │ │Grievances│ │New users │
│  Total   │ │ Buyers   │ │  Filed   │ │this month│
└──────────┘ └──────────┘ └──────────┘ └──────────┘

DATA QUALITY
├── Projects with complete profiles:        89% (437/487)
├── Projects with RERA synced <30 days:     67% (326/487)
├── Projects needing attention:             23
└── Projects with active red flags:         18

GRIEVANCE OPERATIONS
├── Avg time to acknowledgement:            2.3 days
├── Unacknowledged > 5 days:               12  ← action needed
├── Escalated this month:                  18
└── Resolved this month:                   89
```

---

## 3. Project Management

**URL:** `/admin/projects`

### 3.1 Project List

Table view of all projects (published + unpublished):

| Column | Details |
|---|---|
| Name + Builder | Linked to project detail |
| RERA Number | Monospace, copyable |
| Status | Status badge |
| Published | Toggle |
| Transparency Score | Numeric with grade |
| Last RERA Sync | Timestamp + "Sync now" button |
| Red Flags | Count badge |
| Actions | Edit · Publish/Unpublish · Delete |

**Filters:** City · Builder · Status · Published Y/N · Has Red Flags · RERA Sync overdue

### 3.2 Create/Edit Project

Multi-section form:

**Section 1: Basic Details**
- Project name
- Slug (auto-generated from name, editable)
- Builder (select from registered builders)
- RERA number (validated format: P519XXXXXXXX)
- Status (dropdown)
- City · Locality · Sub-locality · Pincode
- GPS coordinates (or Mapbox picker)
- Google Maps URL

**Section 2: Project Details**
- Total units · Total towers · Floors per tower
- Project area (sq ft)
- Amenities (multi-tag input)
- Nearby landmarks (multi-tag)
- Project description (Markdown)

**Section 3: Unit Types**
- Dynamic rows: BHK type · Carpet area · Price range · Total units · Sold units
- Floor plan upload (optional, PDF)

**Section 4: Dates**
- RERA registration date · RERA expiry date
- Revised completion date (admin-updated based on intelligence)
- Actual completion date (set when OC obtained)

**Section 5: Media**
- Cover image upload (JPG, max 5MB)
- Additional images (up to 8)
- Images stored in R2, resized to 1200px width

**Section 6: Financial (Public RERA data only)**
- Approximate price per sq ft · Price range low/high

**Save as Draft** · **Publish** (two separate actions)

> **Note:** Publishing makes a project visible to all users. Drafts are only visible to admins.

### 3.3 Project Update Log

Every change to a project is recorded (who, what, from, to, when). Accessible from project edit page under "Change History" tab.

---

## 4. Builder Management

**URL:** `/admin/builders`

### 4.1 Builder List

Table of all builders with: Name · CIN · Total projects · Transparency grade · Last score computation · Actions

### 4.2 Create/Edit Builder

**Fields:**
- Builder name (legal name + display name)
- CIN Number (MCA21 format)
- Established year
- Headquarters city
- Logo upload (R2, resized to 400×400px)
- Website URL · Contact email · Contact phone (admin-only, not public)
- Description (Markdown)

**Recompute Transparency Score** button → triggers synchronous score recomputation and updates `transparencyScore`, `transparencyGrade`, `scoreLastComputedAt`.

**Score Computation Logic:**
```
Input: All published projects by this builder

reraCompliance  = avg(RERA scores across active projects)   weight: 30%
deliveryTrack   = f(delayMonths across projects)             weight: 25%
grievanceRate   = f(open grievances per 100 units)           weight: 20%
transparency    = avg(profile completeness %)                weight: 15%
buyerSentiment  = f(upvotes, resolved %)                     weight: 10%

Final score: weighted average, rounded to 1 decimal
Grade: A+ (≥90), A (80-89), B (65-79), C (50-64), D (<50)
```

---

## 5. RERA Sync Queue

**URL:** `/admin/rera-sync`

The most operationally critical admin workflow. Keeps RERA data accurate.

### 5.1 Sync Queue View

```
RERA SYNC QUEUE — 23 projects need attention

Filter: All | Overdue (>30d) | Critical (>60d) | Never Synced

Project Name          RERA Number      Last Sync      Status        Action
────────────────────────────────────────────────────────────────────────────
Lodha Palava City     P51900000123     28 Apr 2025    ✅ Recent      —
Rustomjee Elements    P51900000456     02 Mar 2025    ⚠️ 56 days    [Sync Now]
Kalpataru Summit      P51900000789     Never          ❌ Never       [Sync Now]
[...]
```

### 5.2 Sync Workflow

```
Admin clicks [Sync Now] for project:
  ↓
1. Backend: GET https://maharera.mahaonline.gov.in/... (server-side fetch)
   — Uses Cheerio to parse HTML response
   — Extracts: status, registration date, expiry date, works done %, 
     carpet area sold %, violations, promoter name
   — Creates "staged" RERARecord (not yet committed to DB)

2. Admin sees DIFF VIEW:
   ┌─────────────────────────────────────────────────────────────────┐
   │ RERA SYNC REVIEW — Rustomjee Elements                          │
   │ Fetched: 28 April 2025 15:32 IST                               │
   │                                                                 │
   │ FIELD              CURRENT (DB)        FETCHED (MahaRERA)       │
   │ Status             REGISTERED      →   EXTENDED  ⚠️ CHANGED    │
   │ Current Expiry     31 Dec 2024     →   30 Jun 2026 ⚠️ CHANGED  │
   │ Works Done %       68%             →   72%        📈 CHANGED   │
   │ Violations         None            →   None       ✅ Same      │
   │                                                                 │
   │ ⚠️ Red Flag Candidate Auto-detected:                            │
   │   "RERA Extension Obtained — OC Still Pending"                  │
   │   Severity: Warning | [✅ Publish this flag] [❌ Dismiss]       │
   │                                                                 │
   │ Admin Notes: [______________________________________]           │
   │                                                                 │
   │ [✅ Approve & Commit]    [❌ Discard]                           │
   └─────────────────────────────────────────────────────────────────┘

3. Admin clicks [Approve & Commit]:
   — Staged data committed to DB
   — Project cache invalidated (Redis)
   — ProjectUpdateLog entry created
   — If red flag approved: published to project page
   — Affected verified buyers notified via SMS/email (async queue)
```

### 5.3 Bulk Sync

Admin can select multiple projects and trigger sync in sequence. Backend processes them one-by-one (not parallel, to avoid MahaRERA rate limiting). Results queued for admin review — one review per project.

### 5.4 Data Issue Reports

Buyers can click "Report Data Issue" on any RERA data field. Reports appear in a sub-queue within RERA Sync:

```
REPORTED ISSUES (3)
├── Lodha Palava — "Works done shows 72% but site shows 40% actual" — [Review] [Dismiss]
├── Rustomjee Elements — "OC applied in March 2025, not reflected" — [Review] [Dismiss]
└── Kalpataru Summit — "RERA number is wrong, correct is P51900XXXXX" — [Review] [Dismiss]
```

---

## 6. Grievance Management

**URL:** `/admin/grievances`

### 6.1 Grievance Queue

```
Filter: Status (Submitted | Acknowledged | Escalated | Resolved | All)
        Severity (Critical | High | Medium | Low)
        Age (>1 day | >3 days | >7 days)
        Project · Builder

Sort: Oldest first (default) · Newest first · Severity

Table columns:
  Reference ID | Project | Category | Severity | Status | Filed | Days since filed
```

### 6.2 Grievance Detail (Admin View)

```
GRIEVANCE #GRV-2025-0891
Project: Rustomjee Elements | Filed: 25 Apr 2025 (3 days ago)
Category: POSSESSION_DELAY | Severity: HIGH | Status: SUBMITTED

BUYER (admin only): Rahul M. (+91 98765XXXXX) | Verified Owner ✅
Anonymous to public: Yes (shown as "Verified Buyer")

TITLE: Possession delayed 14 months, no update from builder

DESCRIPTION (private — not shown publicly):
  "Builder promised possession in Dec 2024 per agreement. It is now
   May 2025 and there has been no communication despite 6 follow-up
   emails (all unanswered). Demand letter received in Jan 2025 for
   maintenance charges despite no possession given."

EVIDENCE FILES:
  📎 email-chain-oct-2024.jpg (2.1MB) — [View (5min link)]
  📎 demand-letter-jan-2025.pdf (847KB) — [View (5min link)]

ADMIN ACTIONS:
  [→ Set Status: Acknowledged] [→ Escalated] [→ Resolved] [→ Closed Unresolved]
  Admin Notes: [_________________________________________________]
  
  Escalation target (if escalating): 
    ○ RERA Maharashtra  ○ District Consumer Forum  ○ State Commission  ○ Legal NGO

ACTIVITY LOG:
  25 Apr 2025 14:22 — Grievance submitted by buyer
  27 Apr 2025 09:11 — Reviewed by admin (admin@rewebportal.in)
```

### 6.3 Mass Complaint Detection

System auto-flags when ≥15 grievances of the same category are filed against the same project within 30 days:

```
🚨 MASS COMPLAINT ALERT
Project: Rustomjee Elements
Category: POSSESSION_DELAY
Count: 23 grievances in last 30 days (threshold: 15)

SUGGESTED ACTION: Publish "Mass Complaint" red flag
[✅ Create Red Flag]  [Review Grievances]  [Dismiss Alert]
```

---

## 7. Red Flag Management

**URL:** `/admin/red-flags`

### 7.1 Active Red Flags

```
Filter: Project · Severity · Status (Active | Resolved | All)

Table: Project | Flag Type | Severity | Title | Detected | Status | Actions
```

### 7.2 Create Red Flag

**Manually triggered (or auto-suggested from RERA sync / mass complaint):**

```
Project: [Select project]
Flag Type: rera_lapsed | rera_nearing_expiry | stalled | mass_complaint | 
           oc_delayed | rera_violation | construction_halted | custom
Severity: Warning | Critical
Title: [max 100 chars]
Description: [max 500 chars — factual, not editorial]
Link text + URL: [optional — links to RERA page, legal article]
```

**Auto-detection triggers (system creates candidate, admin approves):**

| Trigger | Condition | Suggested Severity |
|---|---|---|
| RERA lapsed | reraStatus = LAPSED | Critical |
| RERA nearing expiry | expiryDate within 60 days | Warning |
| Project stalled | <30% works done + no update 18+ months | Critical |
| Mass complaints | ≥15 grievances same category in 30 days | Critical |
| OC overdue | 12+ months past RERA expiry, no OC | Warning |
| RERA violation | New violation synced | Warning |

### 7.3 Resolve Red Flag

Admin marks flag resolved with:
- Resolution date
- Evidence note (e.g., "OC certificate obtained on [date]")
- Resolution is logged; flag removed from public project page

---

## 8. Buyer Verification Queue

**URL:** `/admin/verification`

### 8.1 Verification Queue

```
Filter: Status (Pending | Approved | Rejected) | Project | Date range

Table: Buyer | Project | BHK Type | Submitted | Days Pending | Actions

Pending items sorted oldest first (SLA: review within 2 business days)
```

### 8.2 Verification Review

```
OWNERSHIP VERIFICATION REQUEST
Buyer: Rahul M. (+91 98765XXXXX) | Submitted: 25 Apr 2025

Project: Rustomjee Elements (Thane West)
Unit type claimed: 3BHK

SUBMITTED DOCUMENT:
  📋 agreement-to-sale.pdf (3.4MB) — [Open Secure Viewer (5min)]
  ⚠️ This link expires in 5 minutes. Do not download or share.

VERIFICATION CHECKLIST:
  □ Document is an Agreement to Sale (ATS) / Sale Deed / Allotment Letter
  □ Property address matches the claimed project
  □ Buyer name on document can be matched to account (first name check only)
  □ Document is not clearly forged/edited
  □ BHK type claimed is consistent with document

DECISION:
  [✅ Approve — Verified Owner]
  [❌ Reject — Document unclear]  Reason: [_____________________]
  [🔄 Request better document]   Note: [__________________________]

On approval:
  → BuyerProjectLink.isVerified = true
  → User.verificationStatus = VERIFIED_OWNER
  → SMS to buyer: "Verified! ✅"
  → Agreement PDF flagged for deletion (30-day countdown)
```

---

## 9. Content Moderation

**URL:** `/admin/moderation`

### 9.1 Moderation Queue

Reports from community "Report" button. Auto-queued when:
- 3+ different users report same post
- Auto-keyword match (phone number, address pattern, profanity)

```
Filter: Reason type | Date | Project

Table: Reported Content | Reporter | Reason | Report Count | Actions

Actions: [Keep Visible] [Hide Post] [Warn User] [Delete + Warn] [Suspend User]
```

### 9.2 Moderation Review Detail

```
REPORT #MOD-2025-00123
Reported by: 4 users (3 reports required for queue)
Reasons: "Personal information exposed" (3), "Harassment" (1)

CONTENT:
  Type: Forum Reply | Thread: "Anyone got possession update?"
  Author: Verified Buyer (admin sees: Suresh P., +91 97654XXXXX)
  
  "Builder's director lives at [ADDRESS]. Let's go protest at his home."

PREVIOUS WARNINGS: 0

DECISION OPTIONS:
  [✅ Keep Visible — No Violation]
  [🙈 Hide Post — With Reason]     Reason: [Personal address exposed]
  [⚠️ Hide + Warn User (1st)]
  [🚫 Delete + Final Warning]
  [🔒 Suspend User 30 days]

Note to user (shown if hide/delete/warn): [____________________]
```

### 9.3 User Management (Moderation Context)

Admin can view warning history per user and take account-level actions:
- View all posts by user
- Issue warning (SMS notification)
- Temporary suspension (1d / 7d / 30d / permanent)
- Lift suspension

**3 warnings → auto-suggestion to suspend (admin still confirms)**

---

## 10. Legal Resource Management

**URL:** `/admin/legal`

### 10.1 Article Management

Create, edit, publish, and archive legal library articles.

**Article fields:**
- Title
- Category (RERA_RIGHTS | CONSUMER_FORUM | SAMPLE_NOTICES | COURT_PROCEDURES | GLOSSARY | FAQ)
- Summary (1–2 sentences — shown in card view)
- Body (Markdown editor with preview)
- Reading time (auto-computed from word count)
- Reviewed by (advocate name + Bar Council ID)
- Review date
- Published / Draft toggle

### 10.2 Expert Directory

Add, edit, and remove legal experts from the directory.

**Expert fields:**
- Full name + designation
- Specializations (multi-select)
- Location (district)
- Bar Council ID (admin verifies before listing)
- Experience years
- Pro bono availability toggle
- Platform contact email (used for buyer inquiry form — expert's personal email not exposed)
- Website URL (optional)

**Annual review reminder:** System flags experts whose listing is >12 months old for re-verification.

---

## 11. Analytics (Admin View)

**URL:** `/admin/analytics`

Extends the public analytics dashboard with platform operations data:

```
PLATFORM OPERATIONS METRICS

USER METRICS
├── Registered users: 8,432 (MAU: 3,241 — 38.4%)
├── Verified buyers: 2,109 (25.0% of registered)
├── Registration trend: [sparkline — last 90 days]
└── Top projects by engagement: [top 5]

DATA QUALITY
├── Projects with all required fields: 437/487 (89.7%)
├── Projects with RERA sync <30 days: 326/487 (66.9%)
├── Builder profiles with logo: 13/15 (86.7%)
└── Legal articles published: 24 | Needing review: 3

GRIEVANCE SLA TRACKER
├── Filed in last 7 days: 34
├── Acknowledged within 2 days: 28/34 (82.4%)  ← target: >90%
├── Currently unacknowledged >2 days: 6  [Action]
└── Escalated this month: 18 | Resolved this month: 89

MODERATION EFFICIENCY
├── Reports reviewed within 24h: 91%
├── False positive rate (kept visible): 24%
└── User suspensions active: 3
```

---

## 12. Admin Audit Log

**URL:** `/admin/audit-log`

Immutable log of all admin actions. Read-only — no admin can delete or modify entries.

```
Filter: Admin user · Action type · Entity type · Date range

Table:
  Timestamp | Admin | Action | Entity Type | Entity ID | Summary

Click any row → see full before/after JSON diff
```

**Exportable as CSV** for compliance purposes.

---

## 13. Admin Navigation Structure

```
/admin
├── 📊 Dashboard (overview + action items)
├── 🏗️ Projects
│   ├── All Projects
│   ├── Create Project
│   └── Publish Queue (drafted but ready)
├── 🏢 Builders
│   ├── All Builders
│   └── Create Builder
├── 📋 RERA Sync
│   ├── Sync Queue (priority)
│   └── Data Issue Reports
├── ⚖️ Grievances
│   ├── Queue (unacknowledged)
│   ├── Escalated
│   └── All Grievances
├── 🚩 Red Flags
│   ├── Active Flags
│   ├── Pending Approval (auto-detected)
│   └── Resolved History
├── ✅ Verification
│   └── Pending Queue
├── 🛡️ Moderation
│   ├── Report Queue
│   └── User Management
├── 📚 Legal Resources
│   ├── Articles
│   └── Expert Directory
├── 📈 Analytics (admin view)
└── 📜 Audit Log
```

---

## 14. Admin Panel Technology Notes

- **Framework:** Same Next.js 14 app router, under `/admin` route group
- **Auth guard:** Admin layout checks JWT role claim = ADMIN or MODERATOR at layout level
- **Protected by:** Separate login at `/admin/login` — no link from public nav
- **Forms:** react-hook-form + zod validation (same as buyer-facing forms)
- **Tables:** TanStack Table v8 for sortable/filterable admin tables
- **Date handling:** All admin timestamps shown in IST (Indian Standard Time) — UTC stored in DB
- **Moderation queue:** Polling every 60 seconds (no WebSocket needed at this scale)
