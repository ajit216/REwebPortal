# Architecture Review Summary

This document is the review entry point for the complete REwebPortal system architecture.

## What Was Designed

### Problem Being Solved
Defrauded and at-risk residential homebuyers in **Mumbai and Thane** who:
- Have no transparent view of project compliance and delivery status
- Are isolated from other buyers in the same project
- Have no unified knowledge base to challenge builder narratives
- Lack accessible grievance channels

### Scope Applied — v1.1 Refined
- **Geography:** Thane city (TMC limits + Thane district belt: Dombivli, Bhiwandi, Anjur, Kolshet)
- **Builder:** **Lodha Group (Macrotech Developers Ltd.)** exclusively — the dominant Thane residential developer
- **Why single-builder focus:** Lodha has 15+ active residential projects in Thane covering ~50,000+ units. A single-builder portal enables deeper cross-project analysis, builder-level promise tracking, and a tightly scoped buyer community that can coordinate more effectively.
- **Property type:** Residential only (apartments, integrated townships, plotted)
- **Platform:** Standard web — desktop-first, mobile-responsive. No native app, no real-time streaming.

### Builder Entity: Macrotech Developers Ltd.
- **Publicly listed:** BSE: 543287 | NSE: LODHA (listed April 2021)
- **Registered:** Maharashtra
- **Promoter:** Abhishek Lodha (Managing Director)
- **Key advantage:** As a listed company, Macrotech's quarterly results, annual reports, DRHP, and investor presentations are public record — enabling financial health tracking alongside project-level RERA data.

---

## Architecture Files Index

```
docs/
├── architecture/
│   ├── 01-system-overview.md          ← Component map, data flows, scalability
│   ├── 02-tech-stack.md               ← Tech decisions with rationale
│   ├── 03-database-schema.md          ← Prisma schema, 25+ models, indexes
│   ├── 04-api-design.md               ← REST API contracts
│   └── 05-security-model.md           ← Auth, DPDP Act, threat model (technical)
├── features/
│   ├── 01-core-features.md            ← Projects, RERA, builders, scorecards
│   ├── 02-community-features.md       ← Forum, WhatsApp, co-buyer tools
│   ├── 03-grievance-system.md         ← Complaint filing, aggregation, escalation
│   ├── 04-analytics-features.md       ← Trends, delay analysis, comparisons
│   ├── 05-advanced-features.md        ← Legal library, calculator, due-diligence
│   └── 06-admin-panel.md              ← Admin workflows: RERA sync, moderation, verification
├── design/
│   ├── 01-design-system.md            ← Tokens, typography, color, accessibility
│   ├── 02-component-library.md        ← 25+ React component specs
│   ├── 03-user-flows.md               ← 4 persona journey maps
│   └── 04-information-architecture.md ← Site map, navigation, IA
├── security/
│   └── 01-security-model.md           ← Developer security checklist + DPDP compliance guide
└── deployment/
    └── 01-deployment-guide.md         ← Infrastructure, CI/CD, launch checklist
```

## Infrastructure Files

```
.github/
└── workflows/
    └── ci-cd.yml              ← GitHub Actions: type-check → lint → test → deploy
docker-compose.yml             ← Local dev: PostgreSQL 16 + Redis 7
```

## Backend Code Structure (Key Added Files)

```
apps/api/src/
├── modules/
│   ├── rera/
│   │   ├── rera.module.ts     ← RERA module (HttpModule for MahaRERA fetch)
│   │   ├── rera.service.ts    ← stageFetch(), commitStagedDiff(), diff computation
│   │   └── rera.controller.ts ← Admin sync endpoints + public RERA data endpoint
│   └── notifications/
│       ├── notifications.module.ts
│       └── notifications.service.ts ← SMS (MSG91) + Email (Resend) service
├── common/
│   ├── filters/global-exception.filter.ts    ← Normalises all errors to API envelope
│   ├── interceptors/transform-response.interceptor.ts ← Wraps all responses in { success, data }
│   ├── guards/jwt-auth.guard.ts              ← JWT validation + Redis blacklist check
│   ├── guards/roles.guard.ts                 ← RBAC: @Roles() decorator enforcement
│   ├── decorators/roles.decorator.ts
│   └── decorators/public.decorator.ts        ← @Public() to skip JWT guard
├── health/
│   └── health.controller.ts   ← GET /api/v1/health — DB connectivity check
└── prisma/
    └── seed.ts                 ← Development seed: 10 builders, 3 projects, legal articles
```

## Admin Panel Pages (Web)

```
apps/web/src/app/admin/
├── layout.tsx            ← Admin sidebar + auth gate
├── page.tsx              ← Dashboard: action items + platform stats
├── login/page.tsx        ← Admin email+password login (noindex)
├── projects/page.tsx     ← Project management table
├── rera-sync/page.tsx    ← RERA sync queue + data issue reports
├── grievances/page.tsx   ← Grievance review + acknowledgement
├── verification/page.tsx ← Buyer ownership verification queue
└── moderation/page.tsx   ← Community report queue
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

| Team | Start Here |
|---|---|
| **Frontend** | `docs/design/` — design system, component library, user flows, IA |
| **Backend** | `docs/architecture/03-database-schema.md` — Prisma schema; then `04-api-design.md` for contracts |
| **Full-stack** | `docs/architecture/04-api-design.md` — complete API contracts for integration |
| **DevOps** | `docs/deployment/01-deployment-guide.md` + `.github/workflows/ci-cd.yml` + `docker-compose.yml` |
| **Product** | `docs/features/` — all 6 feature specs including admin panel |
| **Security** | `docs/security/01-security-model.md` — developer checklist + DPDP compliance |

## Local Development Quickstart

```bash
# 1. Clone
git clone https://github.com/ajit216/REwebPortal.git && cd REwebPortal

# 2. Start local PostgreSQL + Redis
docker compose up -d

# 3. Install all dependencies
pnpm install

# 4. Set up env files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# 5. Run migrations + seed
pnpm --filter api prisma migrate dev
pnpm --filter api prisma db seed

# 6. Start dev servers (both in parallel via Turborepo)
pnpm dev
# Frontend → http://localhost:3000
# API      → http://localhost:3001
# Swagger  → http://localhost:3001/api/docs
# Admin    → http://localhost:3000/admin/login
```

---

*Outcome: architecture_complete | Version: v1.1 | Last updated: May 2025*
