# Deployment Guide — REwebPortal

---

## 1. Infrastructure Overview

```
┌─────────────────────────────────────────────────────────────┐
│  DNS: rewebportal.in (Cloudflare — proxy + DDoS protection) │
│                                                             │
│  ┌──────────────────────┐  ┌──────────────────────────────┐ │
│  │  Vercel (Frontend)   │  │  Railway (Backend API)       │ │
│  │  Next.js             │  │  NestJS (Docker container)   │ │
│  │  Regions: Mumbai     │  │  Region: ap-south-1 (Mumbai) │ │
│  └──────────────────────┘  └──────────────────────────────┘ │
│                                        │                    │
│            ┌───────────────────────────┼──────────────┐     │
│            │                           │              │     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌───────────────┐│
│  │Supabase (DB)    │  │Upstash (Redis)  │  │Cloudflare R2  ││
│  │PostgreSQL 16    │  │Sessions/Cache   │  │File Storage   ││
│  │Mumbai region    │  │Mumbai region    │  │Global CDN     ││
│  └─────────────────┘  └─────────────────┘  └───────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Environment Variables

### Frontend (`apps/web/.env.local`)
```env
# API
NEXT_PUBLIC_API_URL=https://api.rewebportal.in/v1

# NextAuth
NEXTAUTH_URL=https://rewebportal.in
NEXTAUTH_SECRET=<random-32-char-secret>

# Maps
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ...

# Analytics (optional, privacy-respecting)
NEXT_PUBLIC_UMAMI_WEBSITE_ID=<id>
NEXT_PUBLIC_UMAMI_URL=https://analytics.rewebportal.in
```

### Backend (`apps/api/.env`)
```env
# Database
DATABASE_URL=postgresql://user:password@db.supabase.co:5432/rewebportal

# Redis
REDIS_URL=rediss://default:password@region.upstash.io:6379

# JWT
JWT_PRIVATE_KEY=<RSA-2048 private key PEM>
JWT_PUBLIC_KEY=<RSA-2048 public key PEM>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=30d

# Cloudflare R2
R2_ACCOUNT_ID=<cloudflare-account-id>
R2_ACCESS_KEY_ID=<key-id>
R2_SECRET_ACCESS_KEY=<secret>
R2_BUCKET_NAME=rewebportal-files
R2_PUBLIC_URL=https://files.rewebportal.in

# Encryption (for agreement docs)
ENCRYPTION_KEY=<32-byte-hex-key>

# MSG91 (OTP / SMS)
MSG91_AUTH_KEY=<key>
MSG91_TEMPLATE_ID_OTP=<template-id>
MSG91_TEMPLATE_ID_ALERT=<template-id>
MSG91_SENDER=RWPTL

# Resend (email)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@rewebportal.in

# CORS
ALLOWED_ORIGINS=https://rewebportal.in,https://www.rewebportal.in

# Environment
NODE_ENV=production
PORT=3001
```

---

## 3. Local Development Setup

### Prerequisites
- Node.js 20+
- pnpm 9+
- Docker Desktop (for local PostgreSQL + Redis)
- Git

### Step-by-step

```bash
# 1. Clone repo
git clone https://github.com/ajit216/REwebPortal.git
cd REwebPortal

# 2. Install dependencies (all workspaces)
pnpm install

# 3. Start local services (PostgreSQL + Redis via Docker)
docker compose up -d

# 4. Set up environment variables
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
# Fill in local values

# 5. Run database migrations
cd apps/api && pnpm prisma migrate dev

# 6. Seed development data
pnpm prisma db seed

# 7. Start development servers (both in parallel)
pnpm dev
# Frontend: http://localhost:3000
# API:      http://localhost:3001
# Swagger:  http://localhost:3001/api/docs
```

### Docker Compose (Local Services)
```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: rewebportal_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

---

## 4. Database Migrations

```bash
# Create a new migration (development)
pnpm prisma migrate dev --name add_project_red_flags

# Apply migrations in production
pnpm prisma migrate deploy

# Reset dev database (WARNING: destroys data)
pnpm prisma migrate reset

# Generate Prisma client after schema change
pnpm prisma generate

# Open Prisma Studio (DB GUI)
pnpm prisma studio
```

---

## 5. CI/CD Pipeline

### GitHub Actions Workflow
```yaml
# .github/workflows/ci-cd.yml

name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm type-check
      - run: pnpm lint
      - run: pnpm test

  deploy-frontend:
    needs: quality
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: apps/web

  deploy-backend:
    needs: quality
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Railway
        uses: berviantoleo/railway-deploy@v1
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: api
      - name: Run migrations
        run: pnpm prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

---

## 6. Monitoring & Observability

### Error Tracking
- **Sentry** (free tier sufficient at launch)
  - Frontend: `@sentry/nextjs`
  - Backend: `@sentry/nestjs`
  - Alerts: Slack channel on new errors

### Uptime Monitoring
- **Better Uptime** (free): Monitors `api.rewebportal.in/health` every 1 minute
- Alerts: SMS to admin on downtime

### API Health Check
```typescript
// GET /health
{
  "status": "ok",
  "timestamp": "2025-05-01T00:00:00Z",
  "version": "1.0.0",
  "db": "connected",
  "redis": "connected"
}
```

### Performance (Frontend)
- Vercel Analytics for Core Web Vitals (LCP, CLS, FID)
- Alert if LCP > 3s on mobile

### Logging (Backend)
- NestJS + Pino logger → structured JSON logs
- Railway log shipping to Papertrail (searchable)
- Log levels: ERROR (alert), WARN (review), INFO (standard)

---

## 7. Backup Strategy

| Data | Backup | Retention |
|---|---|---|
| PostgreSQL | Supabase auto-backup (daily) + point-in-time recovery | 30 days |
| R2 Files | Cloudflare R2 object versioning (enabled) | 90 days versions |
| Environment secrets | Railway/Vercel secret managers (HA by default) | Permanent |
| Code | GitHub (primary) + mirrored | Permanent |

---

## 8. Scaling Triggers

| Metric | Threshold | Action |
|---|---|---|
| API response p95 > 500ms | Sustained 1 hour | Scale up Railway container |
| DB connections > 80% pool | Any time | Increase PgBouncer pool size |
| Redis memory > 80% | Any time | Upgrade Upstash plan |
| Vercel function invocations > 500k/day | Monthly bill | Review ISR strategy |

---

## 9. Launch Checklist

```
Infrastructure:
  □ Domain configured: rewebportal.in + www.rewebportal.in
  □ SSL certificates active (Cloudflare auto)
  □ Cloudflare proxy enabled (DDoS protection)
  □ R2 bucket created with correct CORS policy
  □ Supabase project created in Mumbai region
  □ Upstash Redis created in Mumbai region

Backend:
  □ All environment variables set in Railway
  □ Database migrations applied to production
  □ Admin account created (email + strong password)
  □ Rate limiting tested
  □ /health endpoint responding

Frontend:
  □ All environment variables set in Vercel
  □ Production deployment successful
  □ Open Graph meta tags set for social sharing

Data:
  □ All 15 reputed builders seeded with accurate data
  □ Minimum 50 projects seeded with RERA data
  □ Legal articles published (minimum 20)
  □ Downloadable templates live

Testing:
  □ OTP flow tested with real MSG91 number
  □ Grievance filing end-to-end tested
  □ File upload to R2 tested
  □ Admin RERA sync tested
  □ Mobile responsive tested on Android + iOS

Legal/Compliance:
  □ Privacy Policy published
  □ Terms of Service published
  □ DPDP Act compliance checklist completed
  □ Content disclaimer on scorecard pages
  □ Defamation review of initial content
```
