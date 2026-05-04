# Information Architecture — REwebPortal

---

## 1. Site Map

```
rewebportal.in/
│
├── /                              ← Landing Page
│   ├── Hero: Search bar (project/builder/locality)
│   ├── Market snapshot stats
│   ├── Featured delayed projects (urgent)
│   ├── Builder scorecards preview
│   └── How it works + CTA to register
│
├── /projects                      ← Project Directory
│   ├── /projects?city=&status=... ← Filtered results
│   └── /projects/[slug]           ← Project Detail
│       ├── /overview              ← Default tab
│       ├── /rera                  ← RERA compliance tab
│       ├── /community             ← Forum tab
│       ├── /grievances            ← Aggregated complaints tab
│       ├── /timeline              ← Construction timeline tab
│       └── /buyer-check           ← Due diligence tool
│
├── /builders                      ← Builder Directory
│   ├── /compare?ids=...           ← Side-by-side comparison
│   └── /builders/[slug]           ← Builder Profile
│       ├── /overview
│       ├── /projects
│       ├── /scorecard
│       └── /track-record
│
├── /analytics                     ← Public Analytics
│   ├── /analytics/delays
│   ├── /analytics/grievances
│   └── /analytics/compare
│
├── /legal                         ← Legal Resource Library
│   ├── /legal/rera-rights
│   ├── /legal/consumer-forum
│   ├── /legal/templates           ← Downloadable templates
│   ├── /legal/glossary
│   ├── /legal/faq
│   └── /legal/experts             ← Expert directory
│
├── /tools
│   └── /tools/delay-calculator    ← RERA delay compensation calc
│
├── /login                         ← OTP Login
├── /register                      ← Registration
│
├── /dashboard                     ← Authenticated buyer area
│   ├── /dashboard/my-projects     ← Linked projects
│   ├── /dashboard/my-grievances   ← Filed complaints
│   ├── /dashboard/alerts          ← Notifications/alerts
│   ├── /dashboard/verify          ← Ownership verification
│   └── /dashboard/profile         ← Account settings
│
└── /admin                         ← Admin area (authenticated, ADMIN role)
    ├── /admin/projects            ← Manage projects
    ├── /admin/builders            ← Manage builders
    ├── /admin/rera-sync           ← RERA data sync queue
    ├── /admin/grievances          ← Grievance management
    ├── /admin/verification        ← Buyer verification queue
    ├── /admin/moderation          ← Content moderation queue
    ├── /admin/red-flags           ← Red flag management
    └── /admin/analytics           ← Platform health dashboard
```

---

## 2. Navigation Structure

### Primary Navigation (Topbar)
```
[Logo / REwebPortal]  Projects  Builders  Analytics  Legal  Tools   [Login] [Register]
                                                               ↑ authenticated: [My Dashboard ▼]
```

**Dropdown under "My Dashboard":**
- My Projects
- My Grievances
- Alerts
- Profile
- Logout

### Secondary Navigation (Project Detail Page — Tabs)
```
[Overview]  [RERA & Compliance]  [Community]  [Grievances]  [Timeline]  [Buyer Check]
```

### Footer
```
Column 1: Platform
  About, How it Works, Contact, Press

Column 2: Projects & Builders
  Browse Projects, Builder Directory, Compare Builders

Column 3: Legal & Tools
  Legal Library, RERA Calculator, Templates, Expert Network

Column 4: Help
  FAQ, Community Guidelines, Privacy Policy, Terms, Report a Bug

Bottom bar: © 2025 REwebPortal | DPDP Act Compliance | Disclaimer
```

---

## 3. Content Hierarchy for Project Detail

Priority order within project detail page (based on user needs):

```
LEVEL 1 — Critical decision signals (always above fold)
├── Project status (badge)
├── Transparency score (visual gauge)
├── Red flags (if any — cannot be missed)
└── Key stats: Delay months, Open grievances

LEVEL 2 — Verification signals (second viewport)
├── RERA number + status
├── RERA deadline vs current date
└── Builder name + grade

LEVEL 3 — Project context
├── About description
├── Unit types + price range
└── Location map

LEVEL 4 — Depth content (tabs)
├── RERA Approvals checklist
├── Community forum
├── Grievance summary charts
└── Construction timeline

LEVEL 5 — Action items (persistent/sticky)
├── File a Grievance (CTA)
├── Join Community
└── Verify Ownership
```

---

## 4. Landing Page Information Hierarchy

```
SECTION 1: Hero (Above Fold)
  Headline: "Know the truth about your Mumbai & Thane builder"
  Sub: "RERA compliance, delivery track records, and buyer experiences — in one place."
  Search bar: [Search project, builder, or RERA number...]
  Trust signals: "X projects tracked | Y verified buyers | Z complaints logged"

SECTION 2: Alert Banner (if any critical platform-wide news)
  e.g., "14 projects in Thane have RERA expiring in next 60 days → View them"

SECTION 3: Featured — Most Delayed Projects
  3 project cards showing critical delay situations
  Headline: "These projects need attention"

SECTION 4: Builder Scorecards Preview
  Row of 5-6 builder logos with their grade badge
  CTA: "See all builder scores →"

SECTION 5: How It Works (3 steps)
  1. Search your project
  2. See real RERA data + buyer experiences
  3. Take action — file complaint, join community, consult lawyer

SECTION 6: Legal Resource Highlight
  "Know your rights as a homebuyer in Maharashtra"
  Teaser cards for 3 top articles

SECTION 7: Analytics Snapshot
  "The State of Mumbai Real Estate (2025)"
  Key stat cards with CTA to analytics page

SECTION 8: Community Testimonial Strip
  3 anonymized buyer quotes (with permission)
  "Verified Buyer, Thane" format — no names

SECTION 9: Footer
```

---

## 5. Mobile Responsive Behavior

| Component | Desktop | Mobile |
|---|---|---|
| Project Directory | 3-column grid | 1-column list |
| Filter Panel | Left sidebar (fixed) | Bottom sheet (slide up) |
| Project Detail Tabs | Horizontal tab row | Scroll tabs → horizontal scroll |
| Scorecard Breakdown | Full breakdown table | Collapsed accordion |
| Map View | Inline map | Full-screen toggle |
| Admin Dashboard | Full sidebar + content | Tab-based mobile nav |
| Grievance Form | Multi-step on single page | Full-screen step flow |

---

## 6. Search Experience Design

### Global Search (Topbar)
- Triggers on: 2+ characters typed
- Debounce: 300ms
- Shows categorized results:
  ```
  PROJECTS (top 5)
  ├── Lodha Palava City — Thane
  ├── Lodha Crown — Mulund
  └── [See all project results →]
  
  BUILDERS (top 3)
  └── Lodha Group
  
  RERA NUMBER
  └── P51900012345 → Lodha Palava City
  ```
- Keyboard navigable (arrow keys + enter)
- Mobile: full-screen search overlay

### Project Directory Search + Filters
- Search within filtered results
- URL params updated → links shareable
- "Clear all filters" one-click reset
- Active filter count badge on filter button
- Results count: "34 projects match your filters"

---

## 7. Error States & Empty States

| Scenario | Display |
|---|---|
| No projects match filters | "No projects found for these filters. [Clear filters]" |
| RERA data not yet synced | "RERA data for this project is being collected. [Report a data issue]" |
| Forum has no threads | "Be the first to start a discussion. [Post a Thread]" |
| User has no grievances | "You haven't filed any grievances yet. [How to file a grievance]" |
| Search no results | "No results for '[query]'. Try searching by RERA number or builder name." |
| 404 Project not found | "This project is not in our database yet. [Suggest a project]" |
| API error | "Something went wrong loading this data. [Try again]" |
