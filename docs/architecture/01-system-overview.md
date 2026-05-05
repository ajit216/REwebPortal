# System Overview — REwebPortal

## 1. Architecture Style

REwebPortal uses a **Monorepo with Modular Monolith** backend pattern. This avoids premature microservices complexity while keeping modules cleanly separated for future extraction.

```
REwebPortal (Turborepo Monorepo)
├── apps/
│   ├── web/          ← Next.js 14 frontend
│   └── api/          ← NestJS backend
├── packages/
│   ├── ui/           ← Shared component library (shadcn/ui base)
│   ├── types/        ← Shared TypeScript types/DTOs
│   └── config/       ← Shared ESLint, Prettier, TSConfig
└── docs/             ← This documentation
```

---

## 2. High-Level Component Map

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USERS (Browser)                             │
│           Homebuyers / Prospective Buyers / Moderators              │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ HTTPS
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    NEXT.JS FRONTEND (Vercel)                        │
│                                                                     │
│  ┌─────────────┐ ┌──────────────┐ ┌───────────────┐ ┌───────────┐  │
│  │ Project     │ │ Builder      │ │ Community     │ │ Grievance │  │
│  │ Directory   │ │ Profiles     │ │ Forum         │ │ Center    │  │
│  └─────────────┘ └──────────────┘ └───────────────┘ └───────────┘  │
│                                                                     │
│  ┌─────────────┐ ┌──────────────┐ ┌───────────────┐ ┌───────────┐  │
│  │ RERA        │ │ Transparency │ │ Legal         │ │ Analytics │  │
│  │ Tracker     │ │ Scorecards   │ │ Library       │ │ Dashboard │  │
│  └─────────────┘ └──────────────┘ └───────────────┘ └───────────┘  │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ REST API (HTTPS/JSON)
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    NESTJS API (Railway)                             │
│                                                                     │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌────────────────┐   │
│  │ Auth      │  │ Projects  │  │ Builders  │  │ Community      │   │
│  │ Module    │  │ Module    │  │ Module    │  │ Module         │   │
│  └───────────┘  └───────────┘  └───────────┘  └────────────────┘   │
│                                                                     │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌────────────────┐   │
│  │ Grievance │  │ RERA      │  │ Analytics │  │ Admin          │   │
│  │ Module    │  │ Module    │  │ Module    │  │ Module         │   │
│  └───────────┘  └───────────┘  └───────────┘  └────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │              Shared: Guards | Interceptors | Pipes          │    │
│  └─────────────────────────────────────────────────────────────┘    │
└──────┬───────────────┬──────────────────┬──────────────────┬────────┘
       │               │                  │                  │
       ▼               ▼                  ▼                  ▼
┌──────────┐  ┌────────────────┐  ┌───────────────┐  ┌──────────────┐
│PostgreSQL│  │  Redis Cache   │  │ Cloudflare R2 │  │ External     │
│(Supabase)│  │  (Sessions,    │  │ (Documents,   │  │ Services     │
│          │  │   Rate Limits) │  │  Images)      │  │ (MSG91,      │
│Primary DB│  │                │  │               │  │  Resend,     │
│          │  │                │  │               │  │  Mapbox)     │
└──────────┘  └────────────────┘  └───────────────┘  └──────────────┘
```

---

## 3. Data Flow Patterns

### 3.1 Public Browse Flow (No Auth Required)
```
User → Next.js Page (SSR) → API /projects → PostgreSQL
                                          → Redis Cache (TTL 10min)
                          ← JSON Response
     ← Rendered HTML + Hydration
```

### 3.2 Authenticated User Flow (Verified Buyer)
```
User → Login (Phone + OTP) → MSG91 OTP → API /auth/verify
                           ← JWT Access Token (15min) + Refresh Token (30d)
     → Subsequent requests with Bearer token
     → API validates JWT → Checks Redis blacklist → Process request
```

### 3.3 Grievance Submission Flow
```
Verified Buyer → POST /grievances (with evidence upload)
              → API validates buyer ownership (project-unit match)
              → Evidence → Cloudflare R2 (encrypted)
              → Grievance record → PostgreSQL
              → Notification → Admin queue
              → Aggregated count updated on project profile
              → Email confirmation → Resend API
```

### 3.4 Community Group Request Flow
```
Verified Co-Buyer → Request to join project group
                 → API checks: same project, verified buyer
                 → WhatsApp group invite link generated (WhatsApp Business API)
                 → Link delivered via SMS (MSG91) — NOT stored in DB
                 → User joins group independently
```

### 3.5 RERA Data Sync Flow (Admin-Triggered, Not Automated)
```
Admin → POST /admin/rera/sync/{projectId}
      → Backend fetches MahaRERA project page (server-side scrape)
      → Parsed data staged for review
      → Admin reviews diff and approves
      → Data committed to PostgreSQL
      → Cache invalidated
      → Project profile updated
```
> **Note:** No fully automated RERA sync to prevent stale/incorrect data from being published without human review.

---

## 4. Module Responsibilities

| Module | Responsibility | Key Entities |
|---|---|---|
| **Auth** | Registration, OTP login, JWT lifecycle, role management | User, Session, OTPRecord |
| **Projects** | Project CRUD, unit types, timeline, status | Project, ProjectUnit, ProjectTimeline |
| **Builders** | Builder profiles, scorecard computation | Builder, BuilderDocument |
| **RERA** | RERA filing records, approval tracking, violations | RERARecord, RERAApproval, Violation |
| **Community** | Forum threads, replies, WhatsApp group registry | Thread, Reply, CommunityGroup |
| **Grievance** | Complaint submission, status tracking, aggregation | Grievance, GrievanceEvidence, GrievanceStatus |
| **Analytics** | Trend computation, delay stats, complaint patterns | (read-only views on above tables) |
| **Legal** | Resource articles, expert directory | LegalResource, LegalExpert |
| **Notifications** | Email/SMS dispatch queue | NotificationQueue |
| **Admin** | Moderation, data management, RERA sync | AdminAction, ModerationQueue |

---

## 5. Environments

| Environment | Purpose | URL Pattern |
|---|---|---|
| **Development** | Local dev, individual features | `localhost:3000` / `localhost:3001` |
| **Staging** | Integration testing, UAT | `staging.rewebportal.in` |
| **Production** | Live platform | `rewebportal.in` |

---

## 6. Scalability Considerations

### Current Scale (Launch — Thane + Lodha Focus)
- **1 builder** (Lodha Group / Macrotech Developers Ltd.), **~15–20 active projects**, ~5,000–15,000 registered buyers
- Thane-only scope significantly reduces data volume at launch; PostgreSQL handles all load with headroom
- Redis for session management and hot-path caching
- Vercel auto-scales frontend, Railway scales API horizontally
- Single-builder focus enables deeper per-project data without indexing complexity of multi-builder catalog

### Growth Levers (When Needed)
| Trigger | Action |
|---|---|
| Search latency >500ms | Introduce Typesense for project/builder search |
| DB queries slow on analytics | Materialize views or add read replica |
| Forum at >100k posts | Extract Community Module to separate service |
| File storage costs spike | Move to tiered storage (hot/cold on R2) |
| API >1000 req/sec sustained | Add API Gateway (Cloudflare Workers) |

---

## 7. Third-Party Integration Map

| Service | Purpose | Integration Type | Fallback |
|---|---|---|---|
| **MahaRERA** | Project compliance data | Admin-triggered server-side fetch | Manual data entry |
| **MSG91** | OTP delivery (India) | REST API | Fallback to email OTP |
| **Resend** | Transactional email | REST API | Queue + retry |
| **Mapbox GL JS** | Project location maps | Client-side SDK | Static map image |
| **Cloudflare R2** | Document/image storage | S3-compatible SDK | None (required) |
| **WhatsApp Business API** | Community group invites | REST API (Meta) | Manual WhatsApp link sharing |
| **Razorpay** *(future)* | Premium membership | REST API | N/A |

---

## 8. Key Non-Functional Requirements

| NFR | Target |
|---|---|
| **Availability** | 99.5% uptime (excluding planned maintenance) |
| **Page Load (LCP)** | < 2.5 seconds on 4G mobile |
| **API Response (p95)** | < 300ms for cached, < 800ms for DB queries |
| **Security** | OWASP Top 10 compliance, HTTPS everywhere |
| **Accessibility** | WCAG 2.1 AA |
| **Data Privacy** | DPDP Act 2023 (India) compliant |
| **Mobile** | Responsive web, no native app at launch |
