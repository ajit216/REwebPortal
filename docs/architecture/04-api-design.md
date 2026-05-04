# API Design — REwebPortal

> Base URL: `https://api.rewebportal.in/v1`
> Format: REST, JSON
> Auth: Bearer JWT in `Authorization` header
> Docs: Auto-generated Swagger at `/api/docs` (non-production only)

---

## Authentication

### Public Endpoints (No auth required)
GET requests for projects, builders, RERA data, legal resources — read-only public data.

### Protected Endpoints
Require `Authorization: Bearer <access_token>` header.

### Roles
| Role | Access |
|---|---|
| `BUYER` (unverified) | Read all public data, submit grievances, post in community |
| `BUYER` (verified) | Above + verified badge on posts, join WhatsApp groups |
| `MODERATOR` | Above + hide posts, flag content |
| `ADMIN` | Full access including RERA sync, project management |

---

## Response Envelope

All API responses use a consistent envelope:

```json
// Success
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "limit": 20, "total": 145 }   // pagination (list endpoints)
}

// Error
{
  "success": false,
  "error": {
    "code": "GRIEVANCE_NOT_FOUND",
    "message": "Grievance with ID xyz not found",
    "statusCode": 404
  }
}
```

---

## Auth Endpoints

```
POST /auth/otp/send
Body: { "phone": "+919876543210" }
Response: { "success": true, "data": { "expiresIn": 300 } }
Rate limit: 3 requests per phone per 10 minutes

POST /auth/otp/verify
Body: { "phone": "+919876543210", "otp": "482910" }
Response: { 
  "data": { 
    "accessToken": "eyJ...", 
    "refreshToken": "eyJ...",
    "user": { "id": "...", "role": "BUYER", "verificationStatus": "UNVERIFIED" }
  }
}

POST /auth/token/refresh
Body: { "refreshToken": "eyJ..." }
Response: { "data": { "accessToken": "eyJ..." } }

POST /auth/logout
Auth: Required
Response: { "success": true }

POST /auth/admin/login
Body: { "email": "admin@rewebportal.in", "password": "..." }
Response: { "data": { "accessToken": "...", "user": { "role": "ADMIN" } } }
```

---

## Project Endpoints

```
GET /projects
Query params:
  - city: "Mumbai" | "Thane"
  - locality: string (partial match)
  - status: ProjectStatus
  - builderId: string
  - minScore: number (transparency score filter)
  - hasRedFlags: boolean
  - bhkType: "1BHK" | "2BHK" | "3BHK" | "4BHK"
  - priceMin: number (in lakhs)
  - priceMax: number
  - q: string (full-text search)
  - page: number (default: 1)
  - limit: number (default: 20, max: 50)
  - sortBy: "name" | "score" | "delay" | "grievances" | "reraExpiry"
  - sortOrder: "asc" | "desc"

Response: {
  "data": [ProjectSummary],
  "meta": { "page", "limit", "total", "filters": {...applied} }
}

GET /projects/:slug
Response: { "data": ProjectDetail }

ProjectDetail includes:
  - All project fields
  - Builder (name, logo, transparencyGrade)
  - UnitTypes[]
  - RERARecord (current)
  - Timeline milestones
  - RedFlags (active)
  - Stats: { grievanceSummary, verifiedBuyerCount, delayMonths }

GET /projects/:slug/rera
Response: { "data": { reraRecords: RERARecord[], approvals: [], violations: [] } }

GET /projects/:slug/grievances
Query: status, category, page, limit
Response: { "data": [GrievanceSummary], "meta": {...} }
Note: Anonymous grievances show "Verified Buyer" not buyer name

GET /projects/:slug/community/threads
Query: page, limit, sortBy (recent | popular)
Response: { "data": [ThreadSummary], "meta": {...} }

GET /projects/:slug/timeline
Response: { "data": { milestones: ProjectTimeline[], delayMonths: number } }

GET /projects/:slug/analytics
Response: {
  "data": {
    "grievancesByCategory": [{ category, count }],
    "grievancesTrend": [{ month, count }],  // last 12 months
    "delayTrend": { originalDate, currentDate, delayMonths }
  }
}
```

---

## Builder Endpoints

```
GET /builders
Query: city, transparencyGrade, q, page, limit, sortBy (score | projects | name)
Response: { "data": [BuilderSummary] }

BuilderSummary: {
  id, slug, name, logoUrl, transparencyGrade, transparencyScore,
  totalProjects, activeProjects, delayedProjects, avgDelayMonths,
  totalGrievances
}

GET /builders/:slug
Response: { "data": BuilderDetail }

BuilderDetail includes:
  - All builder fields
  - Recent projects (5, with status)
  - Transparency scorecard breakdown
  - Grievance distribution by category
  - Delay statistics across projects

GET /builders/:slug/projects
Query: status, page, limit
Response: { "data": [ProjectSummary] }

GET /builders/:slug/scorecard
Response: {
  "data": {
    "overallScore": 78,
    "grade": "B",
    "breakdown": {
      "rerapCompliance": { score: 90, weight: 0.30, label: "RERA Compliance" },
      "deliveryTrack": { score: 60, weight: 0.25, label: "On-time Delivery" },
      "grievanceRate": { score: 80, weight: 0.20, label: "Grievance Resolution" },
      "transparency": { score: 75, weight: 0.15, label: "Information Disclosure" },
      "buyerSentiment": { score: 70, weight: 0.10, label: "Buyer Sentiment" }
    },
    "lastUpdated": "2025-04-01T00:00:00Z"
  }
}
```

---

## Grievance Endpoints

```
POST /grievances
Auth: Required (BUYER role)
Body: {
  "projectId": "clxyz123",
  "category": "POSSESSION_DELAY",
  "severity": "HIGH",
  "title": "Possession delayed by 18 months",
  "description": "...",
  "isAnonymous": false
}
Response: { "data": { "grievanceId": "...", "status": "SUBMITTED" } }

POST /grievances/:id/evidence
Auth: Required (owner of grievance)
Content-Type: multipart/form-data
Body: file (PDF/JPG/PNG, max 10MB)
Response: { "data": { "fileId": "...", "uploadedAt": "..." } }
Note: Files stored encrypted in R2; admin-only access to raw files

GET /grievances/my
Auth: Required
Query: status, page, limit
Response: { "data": [GrievanceFull] }

GET /grievances/:id
Auth: Required (owner or admin)
Response: { "data": GrievanceFull }

PATCH /grievances/:id/upvote
Auth: Required (verified buyer of same project only)
Response: { "data": { "upvoteCount": 23 } }

// Admin only
PATCH /admin/grievances/:id/status
Auth: Required (ADMIN | MODERATOR)
Body: { "status": "ACKNOWLEDGED", "note": "Reviewing with builder" }
Response: { "data": GrievanceFull }
```

---

## Community Endpoints

```
GET /community/groups/:projectId
Response: { "data": CommunityGroup }

GET /community/threads
Query: projectId (required), page, limit, sortBy
Response: { "data": [ThreadSummary] }

POST /community/threads
Auth: Required
Body: { 
  "communityGroupId": "...", 
  "title": "Possession update from site visit",
  "body": "...",
  "isAnonymous": false
}
Response: { "data": Thread }

GET /community/threads/:threadId
Response: { "data": ThreadDetail } // includes replies

POST /community/threads/:threadId/replies
Auth: Required
Body: { "body": "...", "parentReplyId": null, "isAnonymous": false }
Response: { "data": Reply }

PATCH /community/threads/:threadId/upvote
Auth: Required
Response: { "data": { "upvoteCount": 15 } }

// WhatsApp group join request — does NOT return link directly
POST /community/groups/:projectId/whatsapp-request
Auth: Required (must be verified buyer of that project)
Response: {
  "data": {
    "message": "Your request has been noted. The group admin will contact you on your registered number within 24 hours.",
    "requestId": "..."
  }
}
```

---

## User / Buyer Endpoints

```
GET /users/me
Auth: Required
Response: { "data": { user, buyerProfile, linkedProjects[] } }

PATCH /users/me/profile
Auth: Required
Body: { "displayName": "Ramesh K.", "preferredLocalities": ["Thane West"] }
Response: { "data": BuyerProfile }

POST /users/me/verify-ownership
Auth: Required
Content-Type: multipart/form-data
Body: { 
  "projectId": "...", 
  "unitNumber": "B-1203",   // Stored as hash only
  "agreementDoc": <file>    // PDF only, max 10MB
}
Response: { 
  "data": { 
    "status": "PENDING_REVIEW",
    "message": "Your document is under review. Expect response in 2-3 business days."
  }
}

GET /users/me/alerts
Auth: Required
Response: { "data": [Alert] }
// Alerts: new red flag on linked project, grievance status change, RERA update
```

---

## Analytics & Trends Endpoints (Public)

```
GET /analytics/delays
Query: city, builderId, year
Response: {
  "data": {
    "avgDelayByBuilder": [{ builderId, builderName, avgDelayMonths }],
    "delayDistribution": [{ range: "0-6m", count: 45 }, ...],
    "worstDelayedProjects": [ProjectSummary × 5]
  }
}

GET /analytics/grievances
Query: city, category, year
Response: {
  "data": {
    "topCategories": [{ category, count, percentage }],
    "trendByMonth": [{ month, count }],
    "topProjectsByComplaints": [ProjectSummary × 5]
  }
}

GET /analytics/builders/comparison
Query: builderIds[] (max 3)
Response: { "data": [BuilderScorecard] }

GET /analytics/market-overview
Response: {
  "data": {
    "totalProjects": 487,
    "byStatus": { UNDER_CONSTRUCTION: 234, DELAYED: 67, ... },
    "byCity": { Mumbai: 312, Thane: 175 },
    "avgTransparencyScore": 72.4,
    "totalGrievances": 1243,
    "activeGrievances": 389
  }
}
```

---

## Admin Endpoints

```
// RERA Sync (manual trigger)
POST /admin/rera/sync/:projectId
Auth: ADMIN
Response: { "data": { "staged": RERARecord, "diff": {...} } }

POST /admin/rera/sync/:projectId/approve
Auth: ADMIN
Body: { "notes": "Verified against MahaRERA portal" }
Response: { "data": { "applied": true } }

// Project management
POST /admin/projects
PATCH /admin/projects/:id
POST /admin/projects/:id/publish
DELETE /admin/projects/:id (soft delete)

// Builder management
POST /admin/builders
PATCH /admin/builders/:id

// Moderation
GET /admin/moderation/queue
PATCH /admin/moderation/threads/:id/hide
PATCH /admin/moderation/replies/:id/hide

// Red flags
POST /admin/projects/:id/red-flags
Body: { "flagType": "stalled", "severity": "critical", "title": "...", "description": "..." }
PATCH /admin/projects/:id/red-flags/:flagId/resolve

// Buyer verification
GET /admin/verification/queue
PATCH /admin/verification/:linkId/approve
PATCH /admin/verification/:linkId/reject
Body: { "reason": "Document unclear" }
```

---

## Rate Limiting

| Endpoint Group | Limit |
|---|---|
| `POST /auth/otp/send` | 3 per phone per 10 min |
| All `POST` endpoints | 30 per user per minute |
| All `GET` public endpoints | 120 per IP per minute |
| Admin endpoints | 60 per user per minute |
| File upload | 5 per user per hour |

---

## Error Codes

| Code | HTTP Status | Description |
|---|---|---|
| `UNAUTHORIZED` | 401 | No valid JWT |
| `FORBIDDEN` | 403 | Insufficient role/ownership |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 422 | Request body validation failed |
| `OTP_EXPIRED` | 400 | OTP past 5-minute TTL |
| `OTP_MAX_ATTEMPTS` | 429 | Too many wrong OTP attempts |
| `NOT_VERIFIED_OWNER` | 403 | Action requires verified buyer status |
| `DUPLICATE_GRIEVANCE` | 409 | Same user, same project, same category within 30 days |
| `RATE_LIMITED` | 429 | Rate limit exceeded |
| `INTERNAL_ERROR` | 500 | Unexpected server error |
