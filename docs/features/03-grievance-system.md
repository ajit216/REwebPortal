# Grievance System — REwebPortal

---

## 1. Purpose

The grievance system is the **backbone of buyer protection** on this platform. It enables:
1. Individual buyers to formally document their complaints
2. Platform to aggregate patterns (50+ complaints about same issue = systemic signal)
3. Evidence preservation for potential legal action
4. Pressure mechanism on builders via public aggregated stats
5. Data for RERA authorities (patterns visible to regulators)

---

## 2. Grievance Categories

| Category | Examples |
|---|---|
| `POSSESSION_DELAY` | Flat not handed over on promised/RERA date |
| `CONSTRUCTION_QUALITY` | Seepage, cracks, poor finishing |
| `AMENITIES_NOT_DELIVERED` | Promised gym/pool/club not built |
| `FINANCIAL_DISCREPANCY` | Extra charges, GST issues, demand letters |
| `LEGAL_TITLE_ISSUE` | Clear title not obtained, encumbrances |
| `POOR_COMMUNICATION` | Builder not responding to calls/emails |
| `OC_CERTIFICATE_DELAY` | OC not obtained despite possession |
| `RERA_VIOLATION` | Specific RERA rule violation by builder |
| `OTHER` | Doesn't fit above |

---

## 3. Filing a Grievance — User Flow

```
Prerequisites: Registered account (OTP-verified phone)
  └─ Unverified buyers CAN file. Verified buyers get a ✅ badge.

Step 1: Find project page → "File a Grievance" button
Step 2: Select category (required)
Step 3: Set severity: Low / Medium / High / Critical
Step 4: Write title (max 100 chars) + description (max 1500 chars)
  ├── Guidance text: "Describe what happened, when, and what you've already tried"
  ├── Placeholder: "Example: Builder promised possession in Dec 2024 per agreement. 
  │    It's now May 2025 and no update has been given despite multiple emails."
  └── Character counter
Step 5: Attach evidence (optional but encouraged):
  ├── Upload PDFs / JPGs (max 3 files, 10MB each)
  ├── Label each file: "Payment receipt", "Email to builder", "Demand letter"
  └── Files stored encrypted in R2; visible only to you and platform admin
Step 6: Privacy choice:
  ├── Show as "Verified Buyer" (recommended) — identity visible to admin, public sees badge
  └── Show as "Community Member" — fully anonymous in public view
Step 7: Review + Submit
Step 8: Confirmation screen + email/SMS:
  "Your grievance #GRV-2025-0423 has been submitted. 
   It will appear in the project's aggregated grievance summary within 24 hours."
```

---

## 4. Grievance Visibility Rules

| What | Who Can See |
|---|---|
| Grievance title | Public (anonymous or display name based on user's choice) |
| Grievance description | **Not public.** Only: filer + platform admin |
| Evidence files | **Not public.** Only: filer + platform admin |
| Upvote count | Public |
| Status (Submitted/Acknowledged/Resolved) | Public |
| Aggregated stats by category | Public (no individual attribution) |
| Builder response (if provided) | Public |

**Why description is private:** This prevents forum-style complaints from crossing into defamation territory. The platform publishes *patterns* and *counts*, not raw allegations.

---

## 5. Grievance Status Lifecycle

```
DRAFT ──► SUBMITTED ──► ACKNOWLEDGED ──► RESOLVED
                    │               │
                    └──► ESCALATED ─┘
                              │
                              └──► CLOSED_UNRESOLVED
```

| Status | Who Sets | Meaning |
|---|---|---|
| `DRAFT` | System (auto) | Saved but not submitted |
| `SUBMITTED` | System (on submit) | In platform queue |
| `ACKNOWLEDGED` | Admin | Admin reviewed; may have contacted builder |
| `ESCALATED` | Admin | Forwarded to RERA / Consumer Forum / Legal |
| `RESOLVED` | Admin | Builder addressed the issue (buyer may confirm) |
| `CLOSED_UNRESOLVED` | Admin | No resolution after escalation |

**Buyer actions on status change:**
- On `ACKNOWLEDGED`: Buyer gets SMS notification
- On `RESOLVED`: Buyer can confirm resolution (adds credibility to resolution record)
- On `CLOSED_UNRESOLVED`: Buyer shown legal resource links

---

## 6. Grievance Aggregation (Public View)

The public-facing grievance summary on project pages shows aggregated, anonymized data:

```
GRIEVANCE SUMMARY — [PROJECT NAME]
Total Complaints: 89 | Open: 23 | Resolved: 51 | Escalated: 7 | Closed Unresolved: 8

BY CATEGORY:
■■■■■■■■■■ Possession Delay          42 complaints (47%)
■■■■■■      Construction Quality      27 complaints (30%)
■■■          Amenities Not Delivered   12 complaints (14%)
■             OC Certificate Delay      8 complaints (9%)

TREND (Last 12 months): [Bar chart — monthly grievance count]

Most Recent Activity: 3 new complaints in last 30 days
```

---

## 7. Evidence Management

### Storage
- Evidence files stored in Cloudflare R2 under path: `grievances/{grievanceId}/{fileId}.{ext}`
- Additional application-layer AES-256-GCM encryption for sensitive documents
- Admin access via time-limited presigned URLs (5 min TTL)

### What Can Be Uploaded
| Type | Max Size | Purpose |
|---|---|---|
| PDF | 10MB | Agreement, demand letters, legal notices |
| JPG/PNG | 5MB | Photos of construction defects |
| PDF | 10MB | Email screenshots, WhatsApp chat exports |

### Retention Policy
- Evidence files retained for: active grievance lifetime + 2 years after closure
- After retention period: file flagged for deletion, admin confirms
- Deleted: removed from R2 and fileKey nulled in DB

---

## 8. Builder Response Mechanism

Builders in our reputed builder list have the option to submit an official platform response:

**Process (Admin-mediated):**
1. Platform admin reaches out to builder's registered contact
2. Builder submits response to `admin@rewebportal.in`
3. Admin reviews for compliance (factual, no buyer harassment, no threats)
4. Approved response posted on project grievance page:

```
🏗️ BUILDER RESPONSE — [Builder Name] — Submitted 28 April 2025
"Regarding the concerns raised about possession delays at [Project], we wish to 
clarify that the delay is attributable to... [builder statement]"
[Verified by REwebPortal platform on [date]]
```

**Rules for builder responses:**
- Maximum 500 words
- No personal attacks on specific buyers
- Must be factual
- Platform adds disclaimer: "This is an unverified builder statement. Verify claims independently."

---

## 9. Escalation Support

When a grievance is escalated, the platform provides contextual resources:

### RERA Escalation
```
📋 ESCALATING TO RERA?
This complaint appears suitable for RERA filing.
RERA Number: P51900012345 (pre-filled)

Resources:
├── [MahaRERA Complaint Portal ↗]
├── [Sample RERA Complaint Letter — Download]
├── [What Remedies Can RERA Grant? — Article]
└── [Find a RERA Lawyer — Expert Network]
```

### Consumer Forum
```
📋 ESCALATING TO CONSUMER FORUM?
Consumer disputes under ₹50L → District Forum
₹50L to ₹2Cr → State Commission
Above ₹2Cr → National Commission

Resources:
├── [Consumer Portal ↗]
├── [Sample Consumer Complaint — Download]
└── [Calculate Your Entitlement — Calculator]
```

---

## 10. Anti-Abuse Controls

### Duplicate Prevention
- Same buyer + same project + same category within 30 days → blocked with message:
  "You've already submitted a complaint in this category. Track your existing complaint or wait 30 days to file a new one."

### False/Malicious Complaint Detection
- Admin review triggered for complaints marked "Critical" by unverified buyers
- Pattern detection: same IP filing many complaints across projects → admin flag

### Upvote Integrity
- Only **verified buyers of the same project** can upvote a grievance
- Prevents coordinated upvote manipulation from outsiders
- One upvote per user per grievance
