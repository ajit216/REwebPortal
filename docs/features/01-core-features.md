# Core Features — REwebPortal

---

## 1. Project Directory & Detail Pages

### 1.1 Project Directory (Browse)

**URL:** `/projects`

**What it shows:**
- Searchable, filterable list of all published residential projects
- Each project card shows: cover image, project name, builder name, locality, status badge, transparency score, delay indicator, grievance count

**Filters (URL param-based, shareable links):**
| Filter | Type | Options |
|---|---|---|
| Locality | Multi-select | Thane West, Thane East, Dombivli, Majiwada, Kolshet, Bhiwandi, Anjur, Upper Thane |
| Status | Multi-select | Under Construction, Near Completion, Ready to Move, Delayed, Stalled |
| BHK Type | Multi-select | 1BHK, 2BHK, 3BHK, 4BHK, 5BHK |
| Price Range | Range slider | ₹X – ₹Y lakhs |
| Project Tier | Select | Affordable, Mid-segment, Premium, Luxury (Lodha internal tiering) |
| Transparency Score | Slider | 0–100 minimum |
| Has Red Flags | Toggle | |
| RERA Status | Select | Active, Extended, Lapsed |

> **Note:** Builder filter is removed — all projects on this platform are Lodha Group projects.

**Sort options:** Most Grievances, Lowest Score, Most Delayed, Recently Added, Alphabetical

**Map View Toggle:** Mapbox map showing all project pins, clickable to project detail

---

### 1.2 Project Detail Page

**URL:** `/projects/[slug]`

**Page Tabs:**
1. **Overview** (default)
2. **RERA & Compliance**
3. **Community Forum**
4. **Grievances**
5. **Timeline**

#### Tab 1: Overview

```
┌─────────────────────────────────────────────────────────────┐
│  [Cover Image Gallery]                                       │
│                                                             │
│  PROJECT NAME                           [Status Badge]      │
│  by BUILDER NAME                        Score: 78/100 [B]   │
│                                                             │
│  📍 Locality, City | 📋 RERA: P51900012345                  │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  Total   │  │ Delay    │  │Grievances│  │ Verified │    │
│  │  Units   │  │ Months   │  │  Open    │  │ Buyers   │    │
│  │   487    │  │  14 mo.  │  │   23     │  │   89     │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
│                                                             │
│  ⚠️ RED FLAGS: RERA Extension Obtained | OC Pending         │
│                                                             │
│  ABOUT THIS PROJECT                                         │
│  [Description, amenities, nearby landmarks]                 │
│                                                             │
│  UNIT TYPES                                                 │
│  [2BHK: 750 sqft, ₹85-95L] [3BHK: 1100 sqft, ₹1.2-1.4Cr] │
│                                                             │
│  LOCATION MAP                                               │
│  [Mapbox embed - project pin + locality]                    │
└─────────────────────────────────────────────────────────────┘
```

#### Tab 2: RERA & Compliance

```
RERA REGISTRATION
├── RERA Number: P51900012345        [Copy] [View on MahaRERA ↗]
├── Registration Date: 12 Jan 2020
├── Original Completion: 31 Dec 2024
├── Current Deadline: 31 Jun 2026 (Extended)
├── Status: EXTENDED ⚠️
└── Works Completed: 72%

APPROVALS TRACKER
├── ✅ IOD (Intimation of Disapproval)       — Obtained 2020
├── ✅ Commencement Certificate (CC)         — Obtained 2021
├── ⏳ Building Completion Certificate (BCC) — Pending
├── ⏳ Occupancy Certificate (OC)            — Pending
└── ❌ Full OC                               — Not Applied

VIOLATIONS
└── No RERA violations recorded ✅

Data last synced: 28 Apr 2025 | [Report Data Issue]
```

#### Tab 3: Community Forum
- See Community Features doc

#### Tab 4: Grievances Summary
- Aggregated view (not individual complaint text)
- Bar chart: complaints by category
- Status breakdown: Submitted / Acknowledged / Resolved
- "File a Grievance" button (requires login)

#### Tab 5: Timeline
```
CONSTRUCTION MILESTONES
├── ✅ Foundation Complete       — Planned: Mar 2020 | Actual: Mar 2020
├── ✅ Structure: Floor 15       — Planned: Dec 2021 | Actual: Feb 2022 (+2mo)
├── ✅ Structure: Terrace         — Planned: Jun 2022 | Actual: Nov 2022 (+5mo)
├── ✅ Plastering Complete       — Planned: Dec 2022 | Actual: Apr 2023 (+4mo)
├── 🔄 Internal Finishing        — Planned: Jun 2023 | Current Status: In Progress
├── ⏳ BCC Application           — Planned: Sep 2023 | Status: Not yet
└── ⏳ OC + Possession           — Planned: Dec 2024 | Revised: Jun 2026

DELAY ACCUMULATION CHART
[Line chart showing delay growth over time]
```

---

## 2. Builder Profiles

### 2.1 Builder Directory

**URL:** `/builders`

Displays all reputed builders in Mumbai & Thane scope.

**Featured Reputed Builders (Initial Data Set):**
| Builder | Projects | Grade |
|---|---|---|
| Lodha Group | 25+ | TBD on data |
| Oberoi Realty | 10+ | TBD |
| Godrej Properties | 15+ | TBD |
| Hiranandani Group | 8+ | TBD |
| L&T Realty | 10+ | TBD |
| Mahindra Lifespaces | 8+ | TBD |
| Kalpataru Group | 12+ | TBD |
| Rustomjee | 10+ | TBD |
| Piramal Realty | 8+ | TBD |
| Raymond Realty | 5+ | TBD |
| Tata Housing | 8+ | TBD |
| Runwal Group | 12+ | TBD |
| Shapoorji Pallonji RE | 10+ | TBD |
| Wadhwa Group | 8+ | TBD |
| Ekta World | 10+ | TBD |

### 2.2 Builder Detail Page

**URL:** `/builders/[slug]`

**Sections:**
1. **Header:** Logo, name, established year, CIN, website
2. **Transparency Scorecard** (see Analytics doc)
3. **Active Projects** (cards with status + score)
4. **Performance Stats:** Avg delay, complaint rate per project, RERA compliance %
5. **Builder Response** (optional): Builder can submit a platform statement (moderated)

---

## 3. Buyer Authentication & Verification

### 3.1 Registration Flow

```
Step 1: Enter India mobile number
Step 2: OTP sent via SMS (MSG91) → 6-digit, 5-minute TTL
Step 3: Enter OTP → Account created
Step 4: Choose display name (format enforced: "FirstName L.")
Step 5: Optional: Select preferred localities (for alert personalization)
```

### 3.2 Ownership Verification Flow

```
Step 1: Navigate to a project page → "Are you a buyer here?"
Step 2: Enter tower + unit type (e.g., Tower B, 3BHK) — NO floor/unit number
Step 3: Upload Agreement to Sale (PDF, max 10MB)
        [Platform note: "We verify only that you are a buyer. Your unit number
        and agreement details will NOT be displayed or shared."]
Step 4: Admin reviews document within 2-3 business days
Step 5: Buyer gets SMS: "You're now a Verified Buyer at [Project Name]"
        → Green checkmark badge on all future posts
```

**Privacy Rules Enforced in Code:**
- Unit number entered → SHA-256 hashed immediately → original discarded
- Agreement PDF → encrypted with AES-256-GCM before R2 upload → decrypted only for admin review
- After admin verification: original PDF flagged for deletion within 30 days

### 3.3 Buyer Dashboard

**URL:** `/my-projects`

```
MY LINKED PROJECTS
├── [Project Name] — Verified Owner ✅ | Status: Delayed 14 months
│   ├── 3 active grievances filed by you
│   ├── Latest forum: "Anyone got possession update?" (2 days ago)
│   └── [Go to Project] [My Grievances]
└── ...

ALERTS & NOTIFICATIONS
├── 🔴 New Red Flag: [Project] — RERA expired, not renewed
├── 🟡 Grievance Update: Your complaint on [Project] acknowledged
└── 📢 Community: 12 new posts since your last visit
```

---

## 4. RERA Compliance Tracker

### 4.1 What We Track

For each project, the following RERA data is maintained:

| Field | Source | Update Frequency |
|---|---|---|
| RERA registration number | Admin entry | Once |
| Registration + expiry dates | Admin / MahaRERA sync | Per sync |
| Promoter name | Admin / MahaRERA sync | Per sync |
| Works done % | Admin / MahaRERA sync | Monthly |
| Carpet area sold % | Admin / MahaRERA sync | Monthly |
| OC status | Admin entry | As received |
| Violations record | Admin / MahaRERA sync | Per sync |
| Extension details | Admin / MahaRERA sync | As applicable |

### 4.2 MahaRERA Integration (Admin-Triggered)

```
Admin Portal → "Sync RERA Data" for project
→ Backend fetches: https://maharera.mahaonline.gov.in (server-side)
→ Parses HTML with Cheerio
→ Extracts: status, dates, works %, violations
→ Creates staged diff for admin review
→ Admin approves → data committed
→ If data changed significantly → auto-generate red flag candidate
```

> **Why admin-triggered only?** MahaRERA portal has no official API. Automated scraping risks being blocked and publishing stale/incorrect data. Admin review ensures data quality.

### 4.3 RERA Status Badges

| Badge | Colour | Meaning |
|---|---|---|
| Registered | Green | Valid, within deadline |
| Extended | Yellow | Deadline extended, valid |
| Nearing Expiry | Orange | <3 months to RERA expiry |
| Lapsed | Red | RERA expired, not renewed |
| Completed | Blue | OC obtained, RERA closed |
| Cancelled | Dark Red | RERA cancelled |

---

## 5. Transparency Scorecards

### 5.1 Project Score (0–100)

| Component | Weight | Measures |
|---|---|---|
| RERA Compliance | 30% | Status active, no violations, approvals obtained |
| Delivery Track Record | 25% | Delay months vs. RERA deadline |
| Grievance Rate | 20% | Open grievances per 100 units |
| Information Completeness | 15% | % of profile fields filled, timeline entries |
| Buyer Sentiment | 10% | Upvotes on grievances, forum activity tone |

**Grade mapping:**
- A+ (90–100): Exemplary
- A (80–89): Good
- B (65–79): Acceptable
- C (50–64): Concerning
- D (0–49): Poor

### 5.2 Builder Score (0–100)

Weighted average of all active + recently completed projects' transparency scores, with extra weight on recently delayed or stalled projects.

### 5.3 Disclaimer on Scorecards

```
⚠️ Transparency scores are computed from publicly available RERA data 
and buyer-reported information. They reflect data transparency and 
compliance patterns — not an editorial opinion or financial recommendation. 
Last updated: [date].
```

---

## 6. Red Flag Early Warning System

### 6.1 Auto-Detection Triggers

The system auto-generates a **red flag candidate** (pending admin approval) when:

| Trigger | Condition | Severity |
|---|---|---|
| RERA lapsed | reraStatus = LAPSED | Critical |
| RERA nearing expiry | expiryDate within 60 days | Warning |
| Stalled project | No timeline updates + <30% works done + >18 months past reg | Critical |
| Mass complaints | >15 grievances in same category within 30 days | Critical |
| OC overdue | 12+ months past RERA expiry, no OC | Warning |
| RERA violation recorded | New violation in sync | Warning |
| Construction halted | Admin marks milestone "halted" | Critical |

### 6.2 Red Flag Display

On project pages:
```
⛔ CRITICAL: RERA Registration Lapsed
  This project's RERA registration expired on [date] and has not been renewed.
  Buyers have legal rights under Section 18 of RERA. [Learn More]

⚠️ WARNING: Occupancy Certificate Pending
  OC has not been obtained despite possession date of [date] passing.
  Buyers cannot register their flat without OC. [Learn More]
```

On builder pages: red flags across all their projects aggregated.

On buyer dashboard: push-style alert for red flags on buyer's linked projects.

### 6.3 Red Flag Resolution

Admin marks flag as resolved when the triggering condition is remedied. Resolution is logged with date and evidence (e.g., "OC obtained on [date]").
