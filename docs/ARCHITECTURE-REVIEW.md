# Architecture Review Summary

This document is the review entry point for the complete REwebPortal system architecture.

## What Was Designed

### Problem Being Solved
Defrauded and at-risk residential homebuyers in **Mumbai and Thane** who:
- Have no transparent view of project compliance and delivery status
- Are isolated from other buyers in the same project
- Have no unified knowledge base to challenge builder narratives
- Lack accessible grievance channels

### Scope Applied
- **Geography:** Mumbai (all suburbs) + Thane district
- **Builders:** Reputed branded builders only (Lodha, Godrej Properties, Oberoi Realty, L&T Realty, Kalpataru, Rustomjee, Hiranandani, Mahindra Lifespaces, Piramal Realty, Raymond Realty, Tata Housing, Runwal, Shapoorji Pallonji, Wadhwa, Ekta World)
- **Property type:** Residential only (apartments, townships)
- **Platform:** Standard web — desktop-first, mobile-responsive. No native app, no real-time streaming.

---

## Architecture Files Index

```
docs/
├── architecture/
│   ├── 01-system-overview.md          ← Component map, data flows, scalability
│   ├── 02-tech-stack.md               ← Tech decisions with rationale
│   ├── 03-database-schema.md          ← Prisma schema, 25+ models, indexes
│   ├── 04-api-design.md               ← REST API contracts
│   └── 05-security-model.md           ← Auth, DPDP Act, threat model
├── features/
│   ├── 01-core-features.md            ← Projects, RERA, builders, scorecards
│   ├── 02-community-features.md       ← Forum, WhatsApp, co-buyer tools
│   ├── 03-grievance-system.md         ← Complaint filing, aggregation, escalation
│   ├── 04-analytics-features.md       ← Trends, delay analysis, comparisons
│   └── 05-advanced-features.md        ← Legal library, calculator, due-diligence
├── design/
│   ├── 01-design-system.md            ← Tokens, typography, color, accessibility
│   ├── 02-component-library.md        ← 25+ React component specs
│   ├── 03-user-flows.md               ← 4 persona journey maps
│   └── 04-information-architecture.md ← Site map, navigation, IA
└── deployment/
    └── 01-deployment-guide.md         ← Infrastructure, CI/CD, launch checklist
```

---

## Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| Frontend | Next.js 14 + TypeScript + Tailwind + shadcn/ui | SSR for SEO, ISR for performance, accessible components |
| Backend | NestJS + TypeScript + Prisma | Structured, DI container, Swagger auto-docs |
| Database | PostgreSQL 16 (Supabase, Mumbai region) | ACID, JSONB, full-text search, managed backups |
| Cache | Redis 7 (Upstash, pay-per-request) | Sessions, rate limiting, API response cache |
| Storage | Cloudflare R2 | Zero egress fees, encrypted, presigned URLs |
| Auth | JWT RS256 + OTP via MSG91 | India-first, phone-based, no password burden |
| Maps | Mapbox GL JS | Flexible styling, generous free tier |
| Monorepo | Turborepo + pnpm workspaces | Shared types frontend↔backend |
| Deployment | Vercel (web) + Railway (API) | Zero-config, Mumbai-adjacent regions |
| **Launch Cost** | | **~$65/month** |

---

## Key Architecture Decisions

### 1. No Automated RERA Scraping
Admin-triggered only. MahaRERA has no public API; automated scraping risks blocked access and publishing unreviewed data. Human review step ensures data quality before any public update.

### 2. WhatsApp Groups — Platform Facilitates, Never Stores
Platform registers that a group exists and facilitates verified buyer introductions via SMS. Invite links are never stored (they expire and create security risks). Buyers manage their own groups.

### 3. Grievance Descriptions Are Private
Raw complaint text is visible only to the filer and platform admins. Public view shows only aggregated counts by category. This eliminates defamation risk while still showing systemic patterns.

### 4. Privacy By Design (DPDP Act 2023)
- Unit numbers stored as SHA-256 hash only
- Agreement to Sale PDFs encrypted at application layer, deleted after admin review + 30 days
- Anonymous posting supported throughout
- Full data subject rights implemented (access, correction, erasure)

### 5. Modular Monolith (Not Microservices)
All backend logic in one NestJS app with clean module boundaries. Avoids premature infrastructure complexity. Modules (Community, Grievance, RERA, etc.) can be extracted to services when load justifies it.

---

## What's Ready For Development

| Team | Can Start With |
|---|---|
| **Frontend** | `docs/design/` — design system, components, user flows |
| **Backend** | `docs/architecture/03-database-schema.md` — Prisma schema to scaffold from |
| **Full-stack** | `docs/architecture/04-api-design.md` — API contracts for integration |
| **DevOps** | `docs/deployment/01-deployment-guide.md` — infrastructure setup |
| **Product** | `docs/features/` — complete feature specs |

---

*Outcome: architecture_complete | Version: v1.0*
