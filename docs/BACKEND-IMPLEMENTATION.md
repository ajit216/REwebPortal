# REwebPortal — Backend Implementation Plan

## Summary

Reviewed all 15+ documentation files in `/docs`. The REwebPortal backend is a **NestJS modular monolith** serving a Mumbai & Thane homebuyer protection platform. The existing codebase had a solid foundation (main.ts, app.module.ts, global exception filter, guards, Prisma service) but all feature modules were empty stubs. The Prisma schema was also incomplete — missing ~30 fields documented in the architecture specs.

This implementation closes all gaps, adding 40+ source files across 10+ modules.

---

## Architecture Implemented

```
NestJS API (apps/api/)
├── common/
│   ├── redis/            ← NEW: Global Redis service (OTP, JWT blacklist, cache)
│   ├── guards/           ← EXISTING: JwtAuthGuard, RolesGuard
│   ├── decorators/       ← EXISTING: @Public(), @Roles()
│   ├── filters/          ← EXISTING: GlobalExceptionFilter
│   └── interceptors/     ← EXISTING: TransformResponseInterceptor
├── modules/
│   ├── auth/             ← IMPLEMENTED: OTP login, JWT, admin login, refresh, logout
│   ├── projects/         ← IMPLEMENTED: 7 endpoints (list, detail, RERA, grievances, threads, timeline, analytics)
│   ├── builders/         ← IMPLEMENTED: list, detail, projects, scorecard
│   ├── grievances/       ← IMPLEMENTED: create, my-grievances, get, upvote, admin status update
│   ├── community/        ← IMPLEMENTED: groups, threads, replies, upvotes, WhatsApp requests
│   ├── analytics/        ← IMPLEMENTED: market overview, delays, grievances, builder comparison
│   ├── legal/            ← IMPLEMENTED: resources list, article by slug, experts directory
│   ├── users/            ← IMPLEMENTED: /me, profile update, ownership verification, alerts
│   ├── admin/            ← IMPLEMENTED: dashboard, project CRUD, builder CRUD, red flags, verification, moderation, audit log
│   ├── rera/             ← FIXED: stage fetch, commit diff, red flag auto-detection
│   └── notifications/    ← EXISTING (complete): SMS via MSG91, email via Resend
└── prisma/
    ├── schema.prisma     ← UPDATED: Aligned with docs (40+ fields added)
    └── seed.ts           ← UPDATED: Fixed to match new schema
```

---

## Database Schema Changes

Updated `schema.prisma` to match `docs/architecture/03-database-schema.md`:

| Model | Fields Added/Fixed |
|---|---|
| `Builder` | `legalEntityName`, `cinNumber`, `headquartersCity`, `websiteUrl`, `contactEmail`, `contactPhone`, `description`, `totalProjects`, `activeProjects`, `completedProjects`, `delayedProjects`, `totalGrievances`, `avgDelayMonths`, `scoreLastComputedAt`, `isPublished` |
| `Project` | `reraNumber`, `subLocality`, `pincode`, `completedUnits`, `totalTowers`, `floorsPerTower`, `projectAreaSqFt`, `amenities[]`, `nearbyLandmarks[]`, `reraRegistrationDate`, `reraExpiryDate`, `revisedCompletionDate`, `actualCompletionDate`, `approxPricePerSqFt`, `priceRangeLow`, `priceRangeHigh`, `imageUrls[]`, `delayMonths`, `totalGrievances`, `openGrievances`, `verifiedBuyerCount`, `googleMapsUrl`, renamed `lat/lng` → `latitude/longitude` |
| `RERARecord` | Renamed fields to match docs, added `extensionGranted`, `extensionReason`, `rawData`, `syncedByAdminId`, composite unique `@@unique([projectId, reraNumber])` |
| `Grievance` | Added `isVerifiedBuyer`, `isPubliclyVisible`, `adminNotes`, `builderResponse`, `resolutionNotes`, `resolvedAt`, `escalatedAt`, `escalatedTo`, renamed `upvotes` → `upvoteCount` |
| `Thread` | Added `isLocked`, `replyCount`, `isVerifiedBuyer`, `isVisible`, renamed `upvotes` → `upvoteCount` |
| `ProjectRedFlag` | Added `flagType`, `detectedAt` |
| `AdminAction` | Added `metadata` (Json), renamed `performedAt` |
| `LegalResource` | Added `tags[]`, `readTimeMin`, `authorName` |

---

## Implementation Steps

### Step 1 — Environment Setup
1. Install added dependencies: `passport`, `passport-jwt`, `@nestjs/passport`, `@nestjs/axios`, `cheerio`
2. Start local Docker services: `docker compose up -d` (PostgreSQL + Redis)
3. Copy `.env.example` → `.env` and configure:
   - `DATABASE_URL` (PostgreSQL connection string)
   - `REDIS_URL` (Redis connection string)
   - `JWT_SECRET` (development secret; use RS256 keys in production)
   - `MSG91_AUTH_KEY` (optional for dev — OTP logs to console if unset)
   - `RESEND_API_KEY` (optional for dev — emails logged if unset)

### Step 2 — Database Initialization
```bash
cd apps/api
npx prisma migrate dev --name "full-schema-v1"
npx prisma db seed
```

### Step 3 — Run Development Server
```bash
pnpm install
pnpm --filter api dev
# API: http://localhost:3001
# Swagger: http://localhost:3001/api/docs
```

### Step 4 — Verify Key Endpoints
```bash
# Health check
curl http://localhost:3001/api/v1/health

# Projects (public)
curl http://localhost:3001/api/v1/projects

# Builders
curl http://localhost:3001/api/v1/builders

# Analytics
curl http://localhost:3001/api/v1/analytics/market-overview

# Auth — OTP send
curl -X POST http://localhost:3001/api/v1/auth/otp/send \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210"}'

# Admin login
curl -X POST http://localhost:3001/api/v1/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@rewebportal.in", "password": "Admin@REwebPortal2025!"}'
```

### Step 5 — File Upload / Evidence (Cloudflare R2)
The `/users/me/verify-ownership` and `/grievances/:id/evidence` endpoints accept a `docKey` (R2 object key). In the current implementation, the frontend generates a presigned upload URL directly to R2 and passes the resulting `docKey` to the API. Configure R2 credentials in `.env` when implementing file upload in the frontend.

### Step 6 — Production Deployment
1. Set all production env vars in Railway (API) and Vercel (frontend)
2. Run `prisma migrate deploy` as part of Railway deploy
3. Use RSA-2048 keys for JWT (`JWT_PRIVATE_KEY` + `JWT_PUBLIC_KEY`) instead of `JWT_SECRET`

---

## API Endpoints Implemented

### Auth (5 endpoints)
- `POST /auth/otp/send` — Send OTP to India mobile
- `POST /auth/otp/verify` — Verify OTP, receive JWT tokens
- `POST /auth/token/refresh` — Refresh access token
- `POST /auth/logout` — Invalidate tokens
- `POST /auth/admin/login` — Admin email+password login

### Projects (7 endpoints)
- `GET /projects` — List with 12 filters + pagination + sorting
- `GET /projects/:slug` — Full detail (builder, RERA, timeline, red flags)
- `GET /projects/:slug/rera` — RERA compliance data
- `GET /projects/:slug/grievances` — Public grievance listing
- `GET /projects/:slug/community/threads` — Forum threads
- `GET /projects/:slug/timeline` — Construction milestones
- `GET /projects/:slug/analytics` — Per-project grievance analytics

### Builders (4 endpoints)
- `GET /builders` — List with grade/search filters
- `GET /builders/:slug` — Detail + recent projects
- `GET /builders/:slug/projects` — All projects
- `GET /builders/:slug/scorecard` — Weighted transparency breakdown

### Grievances (5 endpoints)
- `POST /grievances` — File grievance (auth)
- `GET /grievances/my` — My grievances (auth)
- `GET /grievances/:id` — Get one (owner or admin)
- `PATCH /grievances/:id/upvote` — Upvote (verified buyer of same project)
- `GET /grievances/project/:projectId/summary` — Aggregated public summary

### Community (6 endpoints)
- `GET /community/groups/:projectId` — Group info
- `GET /community/threads` — Thread list by project
- `POST /community/threads` — Create thread (auth)
- `GET /community/threads/:threadId` — Thread + nested replies
- `POST /community/threads/:threadId/replies` — Post reply (auth)
- `PATCH /community/threads/:threadId/upvote` — Upvote thread
- `POST /community/groups/:projectId/whatsapp-request` — WhatsApp join (verified buyer)

### Analytics (4 endpoints, all public)
- `GET /analytics/market-overview`
- `GET /analytics/delays`
- `GET /analytics/grievances`
- `GET /analytics/builders/comparison`

### Users (4 endpoints, all authenticated)
- `GET /users/me` — Profile + linked projects
- `PATCH /users/me/profile` — Update display name, localities
- `POST /users/me/verify-ownership` — Submit ownership document
- `GET /users/me/alerts` — Red flags + grievance updates

### Legal (3 endpoints, all public)
- `GET /legal/resources` — Article list by category
- `GET /legal/resources/:slug` — Full article content
- `GET /legal/experts` — Legal expert directory

### Admin (20+ endpoints, ADMIN/MODERATOR role)
- `GET /admin/dashboard`
- Project CRUD + publish/delete
- Builder CRUD
- RERA sync: trigger, get staged diff, approve
- Grievances: list all, update status
- Red flags: create, resolve
- Verification: queue, approve, reject
- Moderation: queue, hide thread, hide reply
- Audit log (immutable, read-only)

---

## Security Implemented

Per `docs/security/01-security-model.md`:

| Control | Implementation |
|---|---|
| JWT access tokens | 15-minute TTL, HS256 (configurable to RS256) |
| JWT refresh tokens | 30-day TTL, stored in Redis, rotated on use |
| Token blacklist | Redis-based, on logout |
| OTP security | bcrypt hash, 5-min TTL, max 3 attempts, crypto.randomInt() |
| Role-based access | JwtAuthGuard + RolesGuard on all protected routes |
| Anonymous posts | Identity hidden in public responses, stored in DB for admin |
| Privacy rules | Grievance descriptions never exposed publicly |
| Unit number hashing | SHA-256 hash stored, plaintext discarded |
| Admin audit log | Every admin action recorded (immutable) |
| Input validation | class-validator DTOs on all mutation endpoints |
| ORM injection prevention | Prisma parameterized queries throughout |
| Helmet security headers | Applied globally in main.ts |
| Rate limiting | ThrottlerModule (120 req/min public, 3 OTP/10min) |
| CORS | Configured to frontend URL only |

---

## Blockers / Notes

1. **MahaRERA HTML selectors** — The RERA scraper uses placeholder CSS selectors (`.rera-status-label`, etc.) that must be updated by inspecting the live MahaRERA portal DOM. The scraping framework is complete; only selectors need adjustment.

2. **Cloudflare R2 presigned URLs** — File upload (evidence, verification docs) uses a client-side direct upload pattern. The `docKey` is passed to the API after upload. The presigned URL generation endpoint needs to be added as a small additional endpoint once R2 credentials are configured.

3. **JWT RS256 upgrade** — Current implementation uses `JWT_SECRET` (HS256) for simplicity. For production, set `JWT_PRIVATE_KEY` and `JWT_PUBLIC_KEY` (RSA-2048) and update the JwtModule configuration in `auth.module.ts`.

4. **MSG91 DLT registration** — All SMS templates must be pre-registered with India's TRAI DLT system before production. Template IDs go in `.env` (see `.env.example`).

5. **Transparency score computation** — Builder/project scores are currently stored as denormalized fields updated by admin. A cron job to recompute scores automatically (using `@nestjs/schedule`) can be added to the analytics module.

---

## Status: `ready_to_code` → Implementation Complete

All modules documented in the architecture have been implemented. The backend is ready for:
- Database migration and seeding
- Local development and testing
- Integration with the existing Next.js frontend (mock data → real API)
- Deployment to Railway
