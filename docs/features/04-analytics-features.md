# Analytics & Trend Reporting — REwebPortal

---

## 1. Purpose

Analytics transforms raw project data into actionable intelligence for:
- **Prospective buyers:** "Which builders have the best track record?"
- **Existing buyers:** "Is my delay normal, or is my project an outlier?"
- **RERA/Regulators:** "Which projects/builders need intervention?"
- **Media/Journalists:** "What are the systemic trends in Mumbai real estate?"

---

## 2. Public Analytics Dashboard

**URL:** `/analytics`

### 2.1 Market Overview (Mumbai + Thane Snapshot)

```
MUMBAI & THANE RESIDENTIAL REAL ESTATE — PLATFORM SNAPSHOT
Updated: May 2025

┌──────────────────────────────────────────────────────────────────┐
│   487 Projects     │  89 Delayed    │  ₹72.4 Avg Score  │  15 Builders │
│   Under Scope      │  (18.3%)       │  Transparency     │  Tracked      │
└──────────────────────────────────────────────────────────────────┘

PROJECT STATUS DISTRIBUTION
●●●●●●●●● Under Construction: 234 (48%)
●●●●       Nearing Completion: 89 (18%)
●●●        Ready to Move: 97 (20%)
●●         Delayed: 67 (14%)
           Stalled: 14 (3%)
           Completed: 86 (18%)  [historical]

GRIEVANCE OVERVIEW
Total Filed: 1,243  |  Open: 389  |  Resolved: 712  |  Escalated: 142

TOP GRIEVANCE CATEGORIES (All Projects)
1. Possession Delay        — 42% of all complaints
2. Construction Quality    — 28%
3. Amenities Not Delivered — 16%
4. OC Certificate Delay    — 9%
5. Financial Discrepancy   — 5%
```

### 2.2 Delay Analysis

```
POSSESSION DELAY ANALYSIS

AVERAGE DELAY BY BUILDER (months)
Builder A ████████████████ 16.2 months
Builder B ██████████ 10.8 months
Builder C ████████ 8.4 months
Builder D ██████ 6.1 months
Builder E ████ 4.2 months
[Show all builders]

DELAY DISTRIBUTION — ALL PROJECTS
No delay:          ■■■■■■■■■■■■■ 43%
1–6 months:        ■■■■■■■ 24%
7–12 months:       ■■■■■ 17%
13–24 months:      ■■■■ 12%
24+ months:        ■■ 4%

WORST DELAYED PROJECTS (Currently Active)
1. [Project Name] — Builder — 38 months delay  [View]
2. [Project Name] — Builder — 31 months delay  [View]
3. [Project Name] — Builder — 28 months delay  [View]
4. [Project Name] — Builder — 24 months delay  [View]
5. [Project Name] — Builder — 22 months delay  [View]
```

### 2.3 Complaint Trend Chart

```
GRIEVANCES FILED — LAST 12 MONTHS
[Line chart with month on X-axis, count on Y-axis]
Filterable by: builder, project, category

SEASONAL PATTERNS noted:
- Spike in Jan (buyers back from holidays, following up)
- Spike in June (RERA fiscal year pressure)
```

### 2.4 Builder Comparison Tool

**URL:** `/analytics/compare`

Select up to 3 builders → side-by-side comparison:

```
                   Builder A    Builder B    Builder C
Transparency Grade    B+           B             A
Avg Delay (months)   12.4         8.1           3.2
Projects Delayed      8 (32%)     5 (20%)       2 (8%)
RERA Compliance       91%         87%           96%
Grievances/Project    4.2         3.1           1.8
OC Obtained Rate      72%         81%           94%
Buyer Sentiment       6.8/10      7.2/10        8.4/10
```

---

## 3. Per-Project Analytics

Accessible from the "Overview" and "Grievances" tabs of each project:

### 3.1 Delay Accumulation Chart

```
[Line chart]
X-axis: Quarters since project registration
Y-axis: Delay months accumulated
Red threshold line: RERA deadline

Shows: How delay has grown over time — flat line = stable, 
steep slope = accelerating delay
```

### 3.2 Grievance Breakdown (Project Level)

```
[Donut chart — grievances by category]

CATEGORY BREAKDOWN
Possession Delay    ████████ 54%
Construction Quality ████ 28%
OC Delay            ██ 12%
Other               ■ 6%

STATUS BREAKDOWN
Submitted  ████████ 52%
Acknowledged ████ 28%
Escalated   ██ 12%
Resolved    ■ 8%
```

### 3.3 Timeline Deviation Chart

```
[Gantt-style chart]
Shows each milestone with:
- Planned date (blue)
- Actual date (green if on time, red if delayed)
- Cumulative delay indicator
```

---

## 4. Transparency Scorecard Detail

### 4.1 Per-Builder Scorecard Breakdown

**URL:** `/builders/[slug]/scorecard`

```
TRANSPARENCY SCORECARD — [BUILDER NAME]
Overall: 72/100 — Grade B

┌─────────────────────────────────────────────────────────┐
│ RERA Compliance                           87/100   30%  │
│ ████████████████████░░░░░░                              │
│ Based on: 12/15 projects with valid RERA, 0 violations │
│                                                         │
│ Delivery Track Record                     58/100   25%  │
│ █████████████░░░░░░░░░░░░░░░░                           │
│ Based on: Avg 12.4 months delay across active projects │
│                                                         │
│ Grievance Resolution                      75/100   20%  │
│ ████████████████████░░░░░░░                             │
│ Based on: 68% grievances resolved, 4.2/project avg    │
│                                                         │
│ Information Disclosure                    80/100   15%  │
│ ████████████████████████░░░░                            │
│ Based on: Profile completeness, timeline updates       │
│                                                         │
│ Buyer Sentiment                           65/100   10%  │
│ ████████████████░░░░░░░░░░░                             │
│ Based on: Forum upvotes, grievance categories          │
└─────────────────────────────────────────────────────────┘

Disclaimer: Scores computed from RERA data and platform-reported 
grievances. Not a financial rating or legal assessment.
```

### 4.2 Score History Chart

```
[Line chart — Transparency Score over last 8 quarters]
Shows if builder is improving or declining
```

---

## 5. Data Export

### 5.1 What Can Be Exported (Public Data Only)

| Export | Format | Who Can Access |
|---|---|---|
| Project list with scores | CSV | Anyone |
| Builder comparison table | CSV | Anyone |
| Delay statistics (aggregated) | CSV | Anyone |
| Grievance summary by project | CSV | Anyone |
| My own grievances | PDF | Authenticated buyer (own data only) |

### 5.2 What Cannot Be Exported
- Individual buyer data
- Raw grievance descriptions
- Evidence files

---

## 6. Admin Analytics Dashboard

**URL:** `/admin/analytics`

Gives platform operators insight into platform health:

```
PLATFORM HEALTH — ADMIN VIEW

User Metrics:
├── Registered users: 8,432
├── Verified buyers: 2,109 (25%)
├── MAU (Monthly Active Users): 3,241
└── New registrations (this month): 234

Data Quality:
├── Projects with complete profiles: 89%
├── Projects with RERA synced in last 30 days: 67%
├── Projects needing RERA sync: 23
└── Verification queue pending: 47

Grievance Operations:
├── Avg time to acknowledgement: 2.3 days
├── Unacknowledged >5 days: 12 (action needed)
└── Escalated this month: 18

Moderation:
├── Reports pending review: 8
├── Posts hidden this month: 14
└── User suspensions active: 3
```
