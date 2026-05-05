# Lodha Thane Scope — Platform Specialisation

> **Scope decision:** REwebPortal covers exclusively **Lodha Group (Macrotech Developers Ltd.)** residential projects in **Thane** (TMC limits + Dombivli, Bhiwandi, Anjur, Kolshet belt).

This document specifies features and data models that are unique to the single-builder focus and would not apply in a multi-builder portal.

---

## 1. Why Lodha + Thane?

| Factor | Detail |
|---|---|
| **Market dominance** | Lodha is Thane's largest residential developer with 15+ active projects and an estimated 50,000+ units across all phases |
| **Buyer population** | A single builder's buyer base in one city is large enough to form a self-sustaining advocacy community |
| **Public company** | Macrotech Developers Ltd. (NSE: LODHA, BSE: 543287) — quarterly results, annual reports, investor presentations are all public, enabling financial transparency features |
| **Cross-project pattern power** | When all projects share one builder, delays, quality issues, and RERA extensions reveal systemic patterns rather than isolated events |
| **Known RERA footprint** | Lodha's Thane projects are well-catalogued in MahaRERA — 15+ RERA registrations available as seed data |

---

## 2. Lodha Project Catalog (Seed Data)

The following projects are seeded at launch. Admin panel maintains the authoritative registry.

| Project Name | Micro-Location | Project Type | Approx. RERA Status |
|---|---|---|---|
| Lodha Palava City — Phase 1/2 | Dombivli East | Integrated Township (100+ towers) | Multiple RERA registrations |
| Lodha Amara | Kolshet Road, Thane West | Premium Towers (5 towers) | RERA registered |
| Lodha Sterling | Thane West | Premium Residential | RERA registered |
| Lodha Upper Thane | Anjur Phata, Bhiwandi | Mid-segment Township | Multiple RERA registrations |
| Lodha Splendora | Thane West | Mid-segment Apartments | RERA registered |
| Lodha Belmondo | Thane–Pune Expressway | Luxury Riverside Resort Homes | RERA registered |
| Lodha Majiwada Tower (1, 2, 3) | Majiwada, Thane | Premium Towers | RERA registered |
| Lodha Luxuria | Majiwada, Thane | Luxury Apartments | RERA registered |
| Lodha Crown | Thane West | Premium Residential | RERA registered |
| Lodha Casa Bella | Dombivli East | Affordable Homes | RERA registered |
| Lodha Casa Bella Gold | Dombivli East | Mid-segment | RERA registered |
| Lodha Crest | Upper Thane | Luxury | RERA registered |
| Lodha Vista | Thane | Mid-segment | RERA registered |
| Lodha Acenza | Thane | Luxury Towers | RERA registered |
| Lodha Divino | Thane | Premium Apartments | RERA registered |

> **Note on Palava:** Palava City (Dombivli) is technically in Thane district (Kalyan-Dombivli). It is included because it represents Lodha's largest single-project buyer community. Phase-level tracking is critical as Palava has 100+ sub-towers with varying RERA registrations.

---

## 3. Builder Corporate Tracker

**URL:** `/builder/lodha`

A dedicated Lodha Group profile page that combines:
1. Project-level RERA data (aggregated from all Thane projects)
2. Corporate financial health indicators (from public filings)
3. Transparency scorecard (platform-computed)
4. Complaint patterns across all projects

### 3.1 Corporate Financial Health Panel

```
MACROTECH DEVELOPERS LTD. — FINANCIAL HEALTH TRACKER
NSE: LODHA | BSE: 543287 | Listed: April 2021

⚠️ This section uses PUBLICLY AVAILABLE data from NSE/BSE filings.
   It is informational only and does not constitute financial advice.

QUARTERLY SNAPSHOT (Last Published Quarter)
┌─────────────────────────────────────────────────────────────────┐
│  Pre-sales:      ₹X,XXX Cr  │  Collections:   ₹X,XXX Cr      │
│  Net Debt:       ₹XX,XXX Cr │  Debt/Equity:   X.X             │
│  Operating CF:   ₹X,XXX Cr  │  Cash & Equiv:  ₹X,XXX Cr      │
└─────────────────────────────────────────────────────────────────┘

DEBT TREND (last 8 quarters)
[Line chart — net debt trajectory]

PRE-SALES VELOCITY TREND (last 8 quarters)
[Bar chart — quarterly pre-sales in Cr]

WHY THIS MATTERS FOR BUYERS:
• High net debt → risk of fund diversion from project to debt servicing
• Declining collections → cash flow stress → construction slowdown
• Pre-sales slowdown → builder prioritizes new launches over completing existing projects
```

**Data source:** Manually updated by admin from NSE/BSE quarterly filings. Not automated. Displayed with filing date and quarter label.

**Data field in DB:**
```prisma
model BuilderFinancialSnapshot {
  id              String   @id @default(cuid())
  builderId       String
  quarter         String   // "Q4 FY25"
  preSalesCr      Decimal
  collectionsCr   Decimal
  netDebtCr       Decimal
  cashEquivCr     Decimal
  operatingCfCr   Decimal
  sourceUrl       String   // NSE filing URL
  filedAt         DateTime
  createdAt       DateTime @default(now())

  builder         Builder  @relation(fields: [builderId], references: [id])
}
```

### 3.2 Promise vs Delivery Tracker

A structured record of Lodha's **publicly stated promises** across marketing materials, RERA filings, and press releases — tracked against actual delivery.

```
LODHA PROMISE TRACKER — THANE PROJECTS

DELIVERY COMMITMENTS
┌────────────────────────────────────────────────────────────────────────┐
│ Project       │ Promised OC Date  │ Actual / Current    │ Status       │
├────────────────────────────────────────────────────────────────────────┤
│ Amara T1      │ Dec 2023          │ OC Pending (May 25) │ ⚠️ 17mo late │
│ Sterling Twrs │ Jun 2024          │ Dec 2025 (extended) │ ⚠️ Extended  │
│ Palava Ph2 B  │ Mar 2024          │ Jun 2025 (extended) │ ⚠️ Extended  │
│ Splendora     │ Mar 2023          │ Delivered Dec 2023  │ ✅ On time   │
└────────────────────────────────────────────────────────────────────────┘

AMENITY PROMISES vs DELIVERY
(What was promised in marketing materials at time of sale vs what exists)
[Table: Amenity | Promised Date | Status | Evidence links]

RERA EXTENSIONS PATTERN (All Thane Projects)
Total RERA extensions filed: XX
Projects with multiple extensions: XX
Avg extension period requested: XX months
```

**DB model:**
```prisma
model BuilderPromise {
  id              String   @id @default(cuid())
  builderId       String
  projectId       String?  // null = builder-level promise
  promiseType     PromiseType  // POSSESSION_DATE | AMENITY | SPECIFICATION | OTHER
  promisedValue   String   // "OC by Dec 2023"
  actualValue     String?  // "OC obtained Jun 2025" — filled when resolved
  sourceType      String   // "MARKETING_BROCHURE" | "RERA_FILING" | "PRESS_RELEASE" | "AGREEMENT"
  sourceUrl       String?
  status          PromiseStatus // PENDING | DELIVERED_ON_TIME | DELIVERED_LATE | UNFULFILLED
  evidenceUrls    String[]
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  builder         Builder  @relation(fields: [builderId], references: [id])
  project         Project? @relation(fields: [projectId], references: [id])
}

enum PromiseType {
  POSSESSION_DATE
  AMENITY
  SPECIFICATION
  PRICING
  OTHER
}

enum PromiseStatus {
  PENDING
  DELIVERED_ON_TIME
  DELIVERED_LATE
  UNFULFILLED
  DISPUTED
}
```

---

## 4. Cross-Project Pattern Analysis

Since all projects are from the same builder, cross-project analysis is uniquely powerful.

### 4.1 "Is This Normal for Lodha?" Widget

On every project detail page, display a contextual widget:

```
HOW DOES THIS PROJECT COMPARE TO OTHER LODHA THANE PROJECTS?

Possession delay (this project): 14 months
Avg delay across all Lodha Thane projects: 11.2 months
Projects with longer delay: 4 of 15 (27%)

RERA extensions: 2 extensions obtained
Avg RERA extensions per Lodha Thane project: 1.3

Open grievances: 23
Avg grievances per Lodha project in Thane: 18

[See full cross-project comparison →]
```

### 4.2 Systemic Red Flags

Flags triggered at the **builder level** (not project level) when patterns emerge across projects:

| Flag | Trigger Condition |
|---|---|
| `MASS_DELAY_EVENT` | >50% of Lodha Thane projects show delay increase in same 90-day window |
| `RERA_EXTENSION_SURGE` | >3 Lodha projects file RERA extensions in the same quarter |
| `GRIEVANCE_SPIKE` | Grievance count across all Lodha projects increases >40% month-over-month |
| `FINANCIAL_STRESS_INDICATOR` | Admin flags declining collections or rising debt in corporate tracker |
| `OC_CLUSTER_DELAY` | >5 projects pending OC beyond 12 months |

```
⚠️ BUILDER-LEVEL ALERT — Lodha Group
"4 of 15 Lodha Thane projects obtained RERA extensions in Q1 2025.
This may indicate a systemic delivery challenge. See project comparison."
[View affected projects] [Read our analysis]
```

---

## 5. Lodha Customer Care Escalation Matrix

A structured guide specific to Lodha's internal complaint channels, before buyers escalate to RERA.

**URL:** `/builder/lodha/escalation`

```
LODHA GROUP — BUYER ESCALATION GUIDE
(Platform-curated from public information — not an official Lodha document)

STEP 1: Lodha Customer Care (Internal)
  Email: customercare@lodhagroup.com (public domain)
  Lodha iCare App: Lodha's official buyer app — raise service requests
  Response SLA: 72 hours (as stated in agreement)
  ⚠️ Always communicate in writing. Keep all email records.

STEP 2: Lodha Senior Management Escalation
  Regional Head escalation — request via email with STEP 1 reference number
  MD Office complaint: Only if Step 1 and 2 have 15+ day no-response

STEP 3: MahaRERA Conciliation Forum
  URL: mahareraconciliation.maharera.mahaonline.gov.in
  Free mediation. Lodha is obligated to participate.
  Template: [Download RERA Conciliation Request — pre-filled for Lodha projects]

STEP 4: MahaRERA Complaint
  URL: mahareracomplaints.maharera.mahaonline.gov.in
  Fee: ₹5,000 (residential)
  Template: [Download RERA Complaint — Lodha-specific template]

STEP 5: Consumer Forum / NCDRC
  For financial remedy beyond RERA's scope
  Template: [Download Consumer Forum Complaint template]
```

**DB model — No sensitive data stored. This is static content managed by admin.**

---

## 6. Palava City Special Handling

Lodha Palava City (Dombivli East) deserves special treatment because:
- It is a 4,500-acre integrated township with **100+ individual towers**
- Each wing/tower phase has a **separate RERA registration**
- Buyers in Palava identify by tower/phase/wing, not just "project name"
- The community is segmented: Palava Phase 1 buyers ≠ Palava Phase 2 buyers ≠ Palava Codename buyers

### 6.1 Palava Sub-Project Registry

```
Project: Lodha Palava City
├── Phase 1 — Boulevard  [RERA: P51600000XXX] [Community] [Grievances]
├── Phase 1 — Casa Bella [RERA: P51600000XXX] [Community] [Grievances]
├── Phase 1 — Central Park [RERA: ...]
├── Phase 2 — Aquaville  [RERA: ...]
├── Phase 2 — Beau Monde [RERA: ...]
├── Palava — Codename Crown [RERA: ...]
└── ... (admin-maintained list)
```

Each sub-project is a `Project` record in the DB with `parentProjectId` pointing to the Palava umbrella.

**DB addition:**
```prisma
model Project {
  // ... existing fields ...
  parentProjectId String?   // For sub-projects like Palava phases
  isSubProject    Boolean   @default(false)
  subProjectLabel String?   // "Phase 1 — Boulevard Wing B"

  parentProject   Project?  @relation("SubProjects", fields: [parentProjectId], references: [id])
  subProjects     Project[] @relation("SubProjects")
}
```

### 6.2 Palava Directory Page

**URL:** `/projects/lodha-palava`

A dedicated landing page for Palava showing:
- Township overview map (Mapbox) with individual tower pins
- Phase-by-phase RERA status grid
- Aggregated grievance count across all Palava phases
- "Find your tower" search (residents enter tower/wing to find their sub-project)
- Links to individual sub-project pages

---

## 7. Buyer Verification — Lodha-Specific Documents

The buyer verification flow is tailored to Lodha's document naming conventions:

| Document Type | Lodha-Specific Name | Accepted For Verification |
|---|---|---|
| Agreement for Sale | "Agreement for Sale" / "ATS" | ✅ Primary |
| Allotment Letter | "Allotment Letter" | ✅ Secondary |
| Booking Confirmation | "Provisional Allotment Letter" | ✅ Accepted with note |
| Sub-Lease Deed | Lodha Palava sub-lease | ✅ For Palava freehold converts |
| Demand Letter | Lodha demand notice | ❌ Not accepted alone (proves payment, not ownership) |

Verification admin sees document type hint based on project selected — reduces admin review friction.

---

## 8. Admin — Lodha RERA Sync Strategy

With ~15 projects (and Palava having 50+ RERA registrations), a sync checklist is critical.

```
RERA SYNC DASHBOARD — LODHA THANE

Priority queue (auto-sorted by days since last sync):
┌──────────────────────────────────────────────────────────────────┐
│ Lodha Amara           — Last synced: 45 days ago  🔴 [Sync Now] │
│ Lodha Palava Ph2-B    — Last synced: 38 days ago  🔴 [Sync Now] │
│ Lodha Upper Thane     — Last synced: 22 days ago  🟡 [Sync Now] │
│ Lodha Sterling        — Last synced: 15 days ago  🟡 [Sync Now] │
│ Lodha Splendora       — Last synced: 8 days ago   🟢 [Sync]     │
└──────────────────────────────────────────────────────────────────┘

BULK SYNC: [Sync All Overdue (>30 days)] — queues all in background

MahaRERA base URL for Lodha Thane projects:
https://maharera.maharashtra.gov.in/
Promoter search: "Macrotech Developers" or "Lodha"
```

---

## 9. Scope Exclusions (What We Do NOT Cover)

| Excluded | Reason |
|---|---|
| Lodha Mumbai projects (Worli, Lower Parel, Byculla) | Out of geographic scope — Thane only |
| Lodha commercial projects | Platform is residential-only |
| Other Thane builders (Godrej, Runwal, Hiranandani) | Out of builder scope — Lodha only |
| Lodha plotted developments outside TMC limits | TBD — admin decision per project |
| Lodha international projects (London, Dubai) | Irrelevant to Thane buyer advocacy |

> **Future scope expansion:** If the platform succeeds for Lodha Thane, additional builders or geographies can be added in v2. The single-builder architecture does NOT prevent this — the `Builder` model already supports multiple builders in the schema. Expanding scope is a data/operational decision, not an architectural one.

---

*Document version: v1.0 | Scope: Thane + Lodha | Created: May 2025*
