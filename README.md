# REwebPortal — Thane Lodha Buyer Protection Platform

> **Empowering defrauded and at-risk homebuyers in Thane through project transparency, community connection, and grievance amplification — focused exclusively on Lodha Group projects.**

---

## What Is This?

REwebPortal is a consumer-advocacy web platform focused exclusively on **residential real estate projects in Thane city** developed by **Lodha Group (Macrotech Developers Ltd.)**. It bridges the information gap between homebuyers and the builder by aggregating project data, enabling community formation, and surfacing compliance and delay signals before they become crises.

> **Scope rationale:** Lodha is Thane's dominant residential developer with 15+ active projects ranging from affordable townships (Palava, Upper Thane) to premium towers (Amara, Sterling, Luxuria). The scale and buyer population of Lodha's Thane portfolio makes focused advocacy more impactful than spreading across all builders.

---

## Core Problems Solved

| Problem | Solution |
|---|---|
| Builders control project narrative | Verified project profiles with RERA-sourced data |
| Buyers are isolated | Community groups, forums, co-buyer discovery |
| No unified knowledge base | Searchable project + builder wiki |
| Grievances go unheard | Structured complaint logging + aggregation dashboard |
| No early warning signals | Transparency scorecards + red-flag alerts |

---

## Documentation Index

### Architecture
- [`docs/architecture/01-system-overview.md`](docs/architecture/01-system-overview.md) — High-level architecture, component map
- [`docs/architecture/02-tech-stack.md`](docs/architecture/02-tech-stack.md) — Full technology decisions with rationale
- [`docs/architecture/03-database-schema.md`](docs/architecture/03-database-schema.md) — All data models, relationships, indexes
- [`docs/architecture/04-api-design.md`](docs/architecture/04-api-design.md) — REST API contracts, request/response shapes
- [`docs/architecture/05-security-model.md`](docs/architecture/05-security-model.md) — Auth, data privacy, encryption strategy

### Features
- [`docs/features/01-core-features.md`](docs/features/01-core-features.md) — Project profiles, RERA tracker, builder pages
- [`docs/features/02-community-features.md`](docs/features/02-community-features.md) — Buyer forums, WhatsApp orchestration, co-buyer finder
- [`docs/features/03-grievance-system.md`](docs/features/03-grievance-system.md) — Complaint logging, aggregation, escalation
- [`docs/features/04-analytics-features.md`](docs/features/04-analytics-features.md) — Delay trends, cost overrun patterns, scorecards
- [`docs/features/05-advanced-features.md`](docs/features/05-advanced-features.md) — Early warning system, legal library, expert network

### Design
- [`docs/design/01-design-system.md`](docs/design/01-design-system.md) — Color palette, typography, spacing, tokens
- [`docs/design/02-component-library.md`](docs/design/02-component-library.md) — All UI components with props and states
- [`docs/design/03-user-flows.md`](docs/design/03-user-flows.md) — User journeys for 4 buyer personas
- [`docs/design/04-information-architecture.md`](docs/design/04-information-architecture.md) — IA, navigation, content hierarchy

### Features (continued)
- [`docs/features/06-admin-panel.md`](docs/features/06-admin-panel.md) — Admin workflows: RERA sync, buyer verification, moderation

### Deployment & Security
- [`docs/deployment/01-deployment-guide.md`](docs/deployment/01-deployment-guide.md) — Infrastructure, environments, CI/CD
- [`docs/security/01-security-model.md`](docs/security/01-security-model.md) — Developer security checklist, DPDP compliance, threat model

---

## Target Scope

| Dimension | Scope |
|---|---|
| **Geography** | Thane city (Thane Municipal Corporation limits + Thane district periphery — Dombivli, Bhiwandi, Anjur, Kolshet belt) |
| **Property Type** | Residential only (apartments, townships, plotted developments) |
| **Builder** | **Lodha Group (Macrotech Developers Ltd.)** — all residential projects in Thane |
| **User Type** | Existing Lodha homebuyers, prospective buyers, RERA observers |
| **Platform** | Web (desktop-first, mobile-responsive) |

### Known Lodha Projects in Scope (Thane Geography)

| Project | Micro-Location | Type |
|---|---|---|
| Lodha Palava City | Dombivli East (Thane dist.) | Integrated Township |
| Lodha Amara | Kolshet Road, Thane | Premium Towers |
| Lodha Sterling | Thane West | Premium Residential |
| Lodha Upper Thane | Anjur Phata, Bhiwandi | Mid-segment Township |
| Lodha Splendora | Thane | Mid-segment Apartments |
| Lodha Belmondo | Thane–Pune Expressway | Luxury Riverside |
| Lodha Majiwada | Majiwada, Thane | Premium Towers |
| Lodha Luxuria | Majiwada, Thane | Luxury Apartments |
| Lodha Crown | Thane West | Premium Residential |
| Lodha Casa Bella | Dombivli | Affordable Homes |
| Lodha Casa Bella Gold | Dombivli | Mid-segment |
| Lodha Crest | Upper Thane | Luxury |
| Lodha Vista | Thane | Mid-segment |
| Lodha Acenza | Thane | Luxury Towers |
| Lodha Divino | Thane | Premium Apartments |

> This list is seed data; the admin panel will maintain the authoritative project registry.

---

## Technology at a Glance

```
Frontend   →  Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
Backend    →  NestJS (Node.js) + TypeScript + REST API
Database   →  PostgreSQL 16 (primary) + Redis 7 (cache/sessions)
Storage    →  Cloudflare R2 (documents, images)
Auth       →  JWT (access + refresh tokens) + OTP via SMS
Search     →  PostgreSQL Full-Text Search → migrate to Typesense
Maps       →  Mapbox GL JS
Email      →  Resend
SMS/OTP    →  MSG91 (India)
Deployment →  Vercel (frontend) + Railway (backend) + Supabase (managed PG)
```

---

## Getting Started (for Developers)

> Full setup instructions: [`docs/deployment/01-deployment-guide.md`](docs/deployment/01-deployment-guide.md)

```bash
# Clone
git clone https://github.com/ajit216/REwebPortal.git
cd REwebPortal

# Frontend
cd apps/web && npm install && npm run dev

# Backend
cd apps/api && npm install && npm run start:dev
```

---

## Design Principles

1. **Buyer-first** — Every feature decision starts with "does this help a buyer?"
2. **Trust through verification** — No unverified data shown without clear labelling
3. **Privacy by default** — Personal buyer data never exposed without explicit consent
4. **Factual, not defamatory** — Platform shows data and patterns, not editorial opinions
5. **Accessible** — WCAG 2.1 AA minimum for all interfaces

---

---

## Additional Documentation

- [`docs/features/07-lodha-thane-scope.md`](docs/features/07-lodha-thane-scope.md) — Lodha-specific features: corporate tracker, cross-project analysis, promise vs delivery

---

*Architecture version: v1.1 | Platform: REwebPortal | Region: Thane | Builder Focus: Lodha Group*
