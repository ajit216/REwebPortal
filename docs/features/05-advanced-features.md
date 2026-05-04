# Advanced & Innovative Features — REwebPortal

These features go beyond existing real estate portals and directly serve the buyer-protection mission.

---

## 1. Legal Resource Library

**URL:** `/legal`

A **free, plain-language legal knowledge base** built specifically for Mumbai/Thane residential buyers.

### 1.1 Content Categories

| Category | Example Articles |
|---|---|
| **RERA Rights** | "What is Section 18 — your right to refund or interest", "How to file a RERA complaint in Maharashtra", "RERA complaint vs Consumer Forum — when to choose what" |
| **Consumer Forum** | "How to file a consumer complaint for property fraud", "Documents you need for a consumer forum case", "Cost of filing vs potential remedy — is it worth it?" |
| **Sample Notices** | "Legal Notice to Builder for Possession Delay (Template)", "Response to Demand Letter (Template)", "RTI Application for Project Status (Template)" |
| **Court Procedures** | "What happens in RERA hearings", "Timeline for RERA case resolution in Maharashtra", "Interim stay of possession — when and how" |
| **Glossary** | Plain-English definitions: IOD, CC, BCC, OC, Carpet Area, Built-up Area, RERA Registration, Promoter |
| **FAQ** | "Builder refusing to give OC — what can I do?", "I signed ATS but builder delays agreement — help?", "Can I transfer my flat before OC?" |

### 1.2 Article Design

```
ARTICLE: How to File a RERA Complaint in Maharashtra
Category: RERA Rights | Reading time: 8 min
Reviewed by: Advocate [Name], RERA Specialist | Last updated: March 2025

[Table of Contents — clickable]

[Article body — plain language, no legal jargon without explanation]

KEY TAKEAWAY BOX:
┌──────────────────────────────────────────────────────┐
│ ✅ You CAN file RERA complaint without a lawyer      │
│ ✅ Filing fee: ₹5,000 (residential complaints)       │
│ ⚠️ Time limit: Within 5 years of cause of action    │
│ ⚠️ RERA cannot award >10% of project cost in fines │
└──────────────────────────────────────────────────────┘

RESOURCES IN THIS ARTICLE:
[🔗 MahaRERA Complaint Portal]  [📄 Download Sample RERA Complaint Form]

RELATED ARTICLES:
[What RERA Remedies Can You Get?] [Finding a RERA Lawyer]

Was this helpful? [Yes] [No] [Suggest an edit]
```

### 1.3 Template Downloads

Free downloadable legal templates:
- RERA Complaint (Maharashtra) — Word + PDF
- Legal Notice to Builder (Possession Delay)
- Legal Notice to Builder (Construction Defects)
- RTI Application to Competent Authority
- Consumer Forum Complaint

Templates have `[PLACEHOLDER]` fields for buyers to fill in. Each template has a disclaimer:
> *"This is a reference template. Consult a qualified advocate before sending legal notices."*

---

## 2. Legal Expert Network

**URL:** `/legal/experts`

A vetted directory of lawyers and legal advisors specializing in real estate, RERA, and consumer matters in Mumbai/Thane.

### 2.1 Expert Profile

```
ADVOCATE SUNITA SHARMA
Specialization: RERA, Consumer Forum, Property Law
Location: Thane West
Bar Council ID: MH/123/2005
Experience: 18 years
Pro Bono: Available for group/mass complaints

Handles:
✅ RERA complaints (Maharashtra)
✅ Consumer Forum cases
✅ Property title disputes
✅ Builder fraud cases

📧 [Contact via Platform]   🌐 [Website]

[Disclaimer: Listing here is not an endorsement. Independently verify credentials.]
```

### 2.2 Expert Vetting Process
- Admin manually verifies Bar Council registration
- Annual review of expert listings
- Platform does NOT intermediate fee payments — direct contact only
- Expert removed if any complaint received + verified

---

## 3. Project Update Alerts (Buyer Notifications)

### 3.1 Alert Types

| Alert | Trigger | Channel |
|---|---|---|
| 🔴 Red Flag Added | New critical/warning flag on linked project | SMS + Email |
| 📋 RERA Data Updated | Admin synced new RERA data for project | Email |
| ⚖️ Grievance Status Changed | Your complaint status changed | SMS + Email |
| 📢 New Pinned Post | New pinned thread in your project's community | Email |
| 🏗️ Milestone Update | Project timeline milestone added/changed | Email |
| 📅 RERA Expiry Approaching | Linked project RERA expiring in 60 days | SMS + Email |
| ✅ Verification Approved | Your ownership verification approved | SMS |

### 3.2 Alert Preferences

Users can customize:
- Which alert types to receive
- Which channels (email / SMS / both)
- Frequency for non-urgent alerts: immediate / daily digest / weekly digest

---

## 4. "Should I Buy Here?" Decision Support

A buyer-facing tool that surfaces all relevant data about a project in a single decision support view.

**URL:** `/projects/[slug]/buyer-check`

```
BUYER'S DUE DILIGENCE CHECKLIST
Project: [Name] | Builder: [Name]

RERA STATUS              ✅ Valid — Expires Dec 2026
DELAY HISTORY            ⚠️ Currently 14 months behind schedule
APPROVALS                ⚠️ OC not yet obtained
GRIEVANCE RATE           ⚠️ 67 complaints (13.7 per 100 units — high)
BUILDER TRACK RECORD     ⚠️ Grade B — some delivery concerns
RED FLAGS                🔴 1 Critical: Mass complaint on possession delay
COMMUNITY SENTIMENT      Mixed — active forum, many unresolved issues

OVERALL RISK ASSESSMENT
[Risk-O-Meter: Medium-High]

⚠️ We recommend you:
1. Physically visit the site before committing
2. Consult a RERA lawyer before signing final agreement
3. Read the 23 open grievances summary in this category
4. Verify OC status before paying any possession charges

[View Full RERA Details] [Read Community Forum] [Find a Lawyer]
```

> **Important disclaimer:** "This is an information aggregation tool. REwebPortal does not provide financial, legal, or investment advice. The risk assessment is computed from platform data and may not reflect all relevant factors."

---

## 5. Possession Delay Calculator

A simple calculator that helps buyers understand their financial rights under RERA Section 12/18.

**URL:** `/tools/delay-calculator`

```
RERA DELAY COMPENSATION CALCULATOR

Agreement Date:       [____________]
Agreed Possession:    [____________]
Actual Possession:    [Still pending — today's date used]
Principal Amount Paid: ₹ [____________]

[Calculate My Entitlement]

RESULTS:
Delay: 14 months
Estimated Interest @ SBI MCLR (approx 9%):
  ₹85,00,000 × 9% ÷ 12 × 14 = ₹8,92,500

This is an ESTIMATE. Actual entitlement depends on your agreement terms,
RERA jurisdiction, and other factors. [Consult a Lawyer to File]

[Download Calculation Summary] [Find RERA Lawyer]
```

---

## 6. Construction Photo Evidence Wall (Community Contributed)

Buyers and platform admins can upload **verified site visit photos** to document actual construction progress vs. builder claims.

**Rules:**
- Only verified buyers of that project (or platform admin) can upload
- Photo must be taken at site (GPS metadata checked by platform, then metadata stripped for privacy)
- No photos of other residents or private spaces
- Admin reviews before publishing to project timeline

**Display:** Chronological photo gallery with upload date, tagged milestone (e.g., "Site Visit — April 2025").

**Purpose:** Creates an objective, community-verified visual record of construction progress, independent of builder's marketing materials.

---

## 7. Builder Accountability Tracker (Across Projects)

**URL:** `/builders/[slug]/track-record`

Aggregates the builder's history across ALL projects in scope:

```
[BUILDER NAME] — ACCOUNTABILITY TRACK RECORD

POSSESSION DELIVERY:
Out of 22 completed projects:
  → 14 delivered within RERA deadline (64%)
  → 6 delivered 1-12 months late (27%)
  → 2 delivered 12+ months late (9%)

RERA COMPLIANCE HISTORY:
  → RERA violations: 3 (2020, 2022, 2023) — [View details]
  → RERA extensions taken: 7 across projects
  → Projects with lapsed RERA: 1 (resolved)

GRIEVANCE RESOLUTION RATE:
  → Total grievances: 234
  → Resolved: 168 (72%)
  → Avg resolution time: 4.2 months

OC HISTORY:
  → Projects with OC obtained: 19/22 completed (86%)
  → OC pending despite possession: 3 projects [View]

DATA SOURCES: MahaRERA, Platform Grievances
Last updated: April 2025
```
