# Technology Stack — REwebPortal

## Decision Rationale Summary

All stack decisions prioritize: India-readiness, developer productivity, low operational cost at launch, and clear upgrade paths. No over-engineering for a v1 platform.

---

## 1. Frontend — Next.js 14 (App Router)

**Choice:** `Next.js 14` with App Router + TypeScript + Tailwind CSS + shadcn/ui

### Why Next.js 14
- Server-side rendering (SSR) for project/builder pages ensures Google indexing — critical for organic discovery
- App Router enables granular loading states and streaming for slow RERA data
- Static generation for legal library and help pages (zero runtime cost)
- Vercel deployment is zero-config
- Strong ecosystem with Indian developer talent pool

### Why Tailwind CSS + shadcn/ui
- shadcn/ui gives us production-quality, accessible components we own (not a dependency)
- Tailwind eliminates CSS drift across team members
- Component library is copy-paste → fully customizable for our design system
- No licensing costs

### Key Frontend Libraries

| Library | Version | Purpose |
|---|---|---|
| `next` | 14.x | Framework |
| `react` | 18.x | UI library |
| `typescript` | 5.x | Type safety |
| `tailwindcss` | 3.x | Styling |
| `@radix-ui/*` | latest | Accessible primitives (via shadcn) |
| `lucide-react` | latest | Icons |
| `mapbox-gl` | 3.x | Interactive project maps |
| `react-map-gl` | 7.x | React wrapper for Mapbox |
| `recharts` | 2.x | Analytics charts and trend graphs |
| `@tanstack/react-query` | 5.x | Server state management, caching, refetch |
| `react-hook-form` | 7.x | Form state + validation |
| `zod` | 3.x | Schema validation (shared with backend) |
| `next-auth` | 5.x | Session handling (custom JWT strategy) |
| `date-fns` | 3.x | Date formatting (timeline, delays) |
| `@uploadthing/react` | 6.x | File upload UI (documents/evidence) |
| `nuqs` | 1.x | URL search param state (filters) |
| `sonner` | 1.x | Toast notifications |

### Frontend Structure
```
apps/web/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                    ← Landing page
│   │   ├── projects/
│   │   │   ├── page.tsx                ← Project directory
│   │   │   └── [slug]/
│   │   │       ├── page.tsx            ← Project detail
│   │   │       ├── rera/page.tsx       ← RERA compliance tab
│   │   │       ├── community/page.tsx  ← Community forum tab
│   │   │       └── grievances/page.tsx ← Grievance summary tab
│   │   ├── builders/
│   │   │   ├── page.tsx                ← Builder directory
│   │   │   └── [slug]/page.tsx         ← Builder profile + scorecard
│   │   ├── legal/page.tsx              ← Legal resource library
│   │   └── about/page.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── my-projects/page.tsx        ← Buyer's linked projects
│   │   ├── my-grievances/page.tsx      ← Buyer's complaints
│   │   └── alerts/page.tsx             ← Red-flag notifications
│   └── admin/
│       ├── projects/page.tsx
│       ├── rera-sync/page.tsx
│       └── moderation/page.tsx
├── components/
│   ├── ui/                             ← shadcn/ui components
│   ├── project/                        ← Project-specific components
│   ├── builder/                        ← Builder-specific components
│   ├── grievance/                      ← Grievance flow components
│   ├── community/                      ← Forum components
│   └── shared/                         ← Layout, nav, footer
├── lib/
│   ├── api.ts                          ← API client (react-query wrappers)
│   ├── auth.ts                         ← NextAuth config
│   └── utils.ts
└── public/
```

---

## 2. Backend — NestJS

**Choice:** `NestJS` with TypeScript + Prisma ORM

### Why NestJS
- Opinionated structure prevents architecture drift as team grows
- Built-in DI container, module system, guards, interceptors match our needs
- Excellent TypeScript support — shares types with frontend via `packages/types`
- Guards for role-based access control out of the box
- Swagger/OpenAPI generation from decorators — live API docs
- Strong Indian developer hiring pool (Node.js expertise widespread)

### Key Backend Libraries

| Library | Version | Purpose |
|---|---|---|
| `@nestjs/core` | 10.x | Framework |
| `@nestjs/common` | 10.x | Decorators, pipes, guards |
| `@nestjs/jwt` | 10.x | JWT generation/validation |
| `@nestjs/throttler` | 5.x | Rate limiting |
| `@nestjs/swagger` | 7.x | OpenAPI docs auto-generation |
| `@nestjs/schedule` | 4.x | Cron jobs (notification dispatch) |
| `prisma` | 5.x | ORM + migrations |
| `@prisma/client` | 5.x | DB client |
| `ioredis` | 5.x | Redis client |
| `zod` | 3.x | Validation (shared with frontend) |
| `bcryptjs` | 2.x | Password hashing (admin accounts) |
| `class-validator` | 0.14.x | DTO validation decorators |
| `class-transformer` | 0.5.x | DTO transformation |
| `@aws-sdk/client-s3` | 3.x | Cloudflare R2 (S3-compatible) |
| `resend` | 3.x | Email sending |
| `axios` | 1.x | HTTP client for external services |
| `cheerio` | 1.x | HTML parsing for RERA scrape |
| `helmet` | 7.x | Security headers |
| `compression` | 1.x | Response compression |

### Backend Structure
```
apps/api/
├── src/
│   ├── main.ts                  ← Bootstrap, Swagger setup
│   ├── app.module.ts            ← Root module
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/      ← JWT strategy
│   │   │   └── guards/          ← Auth guard, roles guard
│   │   ├── projects/
│   │   ├── builders/
│   │   ├── rera/
│   │   ├── community/
│   │   ├── grievances/
│   │   ├── analytics/
│   │   ├── legal/
│   │   ├── notifications/
│   │   └── admin/
│   ├── common/
│   │   ├── decorators/
│   │   ├── filters/             ← Global exception filter
│   │   ├── interceptors/        ← Logging, transform response
│   │   ├── pipes/               ← Validation pipe
│   │   └── types/
│   ├── config/                  ← Config module (env vars)
│   └── prisma/
│       ├── prisma.service.ts
│       └── schema.prisma        ← Single source of truth for DB
└── test/
```

---

## 3. Database — PostgreSQL 16 via Supabase

**Choice:** `PostgreSQL 16` hosted on `Supabase` + `Redis 7` via `Upstash`

### Why PostgreSQL
- JSONB columns for flexible RERA data fields without schema migration per new field
- Full-text search with `tsvector` for project/builder search (no Elasticsearch needed at launch)
- Strong consistency for grievance records and financial disclosures
- Row-level security (RLS) available for future direct client access
- Supabase provides managed hosting, backups, point-in-time recovery in India region

### Why Supabase (not raw AWS RDS)
- Managed backups, connection pooling (PgBouncer), dashboard UI
- Mumbai region available (ap-south-1 equivalent)
- Free tier sufficient for development; paid tier affordable for production
- Can use Supabase Storage as R2 fallback for small files

### Why Redis via Upstash
- Serverless Redis: pay-per-request, no idle cost
- Used for: JWT refresh token storage, rate limiting counters, API response cache, OTP code storage (TTL 5min)
- Upstash has Mumbai region

---

## 4. Storage — Cloudflare R2

**Choice:** `Cloudflare R2`

- S3-compatible API (works with `@aws-sdk/client-s3`)
- **Zero egress fees** — critical for document-heavy platform
- Stores: grievance evidence files, builder documents, profile images
- File types: PDF, JPG, PNG, max 10MB per file
- Presigned URLs for secure, time-limited direct access
- Worker-based image optimization for profile photos

---

## 5. Authentication Strategy

### Buyer Authentication (Primary)
```
Phone Number (India mobile) → OTP via MSG91 → Verified
                           → JWT Access Token (15 min TTL)
                           → Refresh Token (30 days, stored in Redis)
```

### Admin Authentication
```
Email + Password (bcrypt) → JWT Access Token (8 hour TTL)
                          → Admin role claim in JWT payload
```

### Buyer Verification (Ownership Proof)
```
After OTP login → Submit: Agreement to Sale copy (PDF) + Flat/unit number
               → Admin reviews document → Marks buyer as "verified_owner"
               → Verified badge appears on forum posts / grievances
```

> **Privacy:** Agreement to Sale document is stored encrypted, accessible only to admin. Buyer's unit number is hashed before storage to prevent cross-buyer exposure.

---

## 6. Search Strategy

### Phase 1 (Launch): PostgreSQL Full-Text Search
```sql
-- tsvector index on projects
CREATE INDEX idx_projects_search ON projects
USING GIN(to_tsvector('english', name || ' ' || locality || ' ' || builder_name));
```
- Handles: project name, locality, builder name, RERA number search
- Sufficient for ~500 projects

### Phase 2 (>5000 projects or search latency >500ms): Typesense
- Self-hosted Typesense on Railway
- Sync via Prisma middleware on write
- Typo tolerance, faceted filtering, instant search (<50ms)

---

## 7. Caching Strategy

| Cache Layer | What | TTL | Invalidation |
|---|---|---|---|
| Redis | Project list API response | 10 min | On admin project update |
| Redis | Builder scorecard | 1 hour | On new grievance/RERA update |
| Redis | RERA compliance data | 30 min | On admin RERA sync |
| Next.js ISR | Project detail pages | 5 min revalidation | On data change webhook |
| Browser | Static assets | 1 year (CDN) | Content hash in filename |
| Browser | API responses | Via react-query staleTime | User-triggered refetch |

---

## 8. Monorepo Tooling

**Choice:** `Turborepo` + `pnpm workspaces`

```
turborepo
├── pnpm workspaces
├── shared ESLint config (packages/config)
├── shared TypeScript config
├── shared Zod schemas (packages/types) — used in both frontend and backend
└── Pipeline: lint → test → build (parallel where possible)
```

### Shared Types Package (`packages/types`)
```typescript
// Shared between frontend and backend
export type ProjectStatus = 'under_construction' | 'ready_to_move' | 'delayed' | 'stalled' | 'completed'
export type GrievanceStatus = 'submitted' | 'acknowledged' | 'escalated' | 'resolved' | 'closed'
export type BuilderTier = 'platinum' | 'gold' | 'silver' // based on transparency score
```

---

## 9. Deployment Stack

| Layer | Service | Cost Model |
|---|---|---|
| Frontend | Vercel (Pro) | ~$20/month |
| Backend API | Railway (Starter) | ~$10/month |
| Database | Supabase (Pro) | ~$25/month |
| Redis | Upstash (Pay-per-request) | ~$5/month |
| File Storage | Cloudflare R2 | ~$5/month (10GB) |
| Email | Resend (free tier) | Free (3000/mo) |
| SMS/OTP | MSG91 | ~₹0.18/SMS |
| Maps | Mapbox | Free (50k loads/mo) |
| **Total** | | **~$65/month at launch** |

---

## 10. CI/CD Pipeline

```yaml
# GitHub Actions — .github/workflows/ci.yml
Trigger: Push to main / PR to main

Steps:
  1. pnpm install (cached)
  2. Type check (tsc --noEmit)
  3. Lint (ESLint)
  4. Unit tests (Vitest)
  5. Build (turbo build)
  6. Deploy frontend → Vercel (auto on merge to main)
  7. Deploy backend → Railway (auto on merge to main)
  8. Run DB migrations → Prisma migrate deploy
  9. Notify Slack on failure
```

---

## Rejected Alternatives

| Alternative | Rejected Because |
|---|---|
| **Firebase / Supabase Realtime** | No real-time features needed; adds complexity |
| **GraphQL** | REST is simpler for this data model; team familiarity higher |
| **MongoDB** | PostgreSQL JSONB gives flexibility without sacrificing ACID |
| **Microservices** | Premature for v1; adds DevOps overhead |
| **React Native / Flutter** | No mobile app at launch; responsive web sufficient |
| **Elasticsearch** | PG full-text handles 500 projects; Typesense when needed |
| **AWS full stack** | Operational complexity > benefit at this scale |
