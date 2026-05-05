# Security Model — REwebPortal

> **Cross-reference:** The full security specification lives in `docs/architecture/05-security-model.md`.
> This document provides a standalone entry point and adds implementation guidance for developers.

---

## Quick Reference: Security Responsibilities by Layer

| Layer | Owner | Key Controls |
|---|---|---|
| DNS / DDoS | Cloudflare | Proxy enabled, WAF rules, rate limiting at edge |
| Frontend (Next.js) | FE team | CSP headers, input sanitisation, CSRF protection |
| API (NestJS) | BE team | JWT validation, role guards, request validation, rate limiting |
| Database (PostgreSQL) | DevOps | SSL, least-privilege DB user, RLS, audit triggers |
| File Storage (R2) | BE team | Private bucket, presigned URLs, app-layer encryption |
| Auth | BE team | OTP bcrypt, JWT RS256, refresh rotation, blacklist |
| Content | Moderation | Markdown sanitisation, defamation policy enforcement |

---

## 1. Threat Model Summary

### Critical Assets

| Asset | Classification | Risk if Compromised |
|---|---|---|
| Buyer phone numbers | Confidential | Spam, targeted harassment |
| Agreement to Sale PDFs | Restricted | Identity fraud, property disputes |
| Unit number associations | Confidential | Buyer targeting |
| Grievance evidence files | Confidential | Legal exposure, privacy violation |
| Admin credentials | Critical | Full platform takeover |
| JWT private keys | Critical | Token forgery, impersonation |

### Attack Vectors & Mitigations

| Threat | Vector | Mitigation |
|---|---|---|
| Account takeover | OTP brute force | 3-attempt limit → OTP invalidated; 1-min resend cooldown |
| Data scraping | Bulk API requests | Rate limiting (120 req/min/IP public; 30 req/min/user POST) |
| Unauthorised file access | Guessing R2 object keys | Private bucket; CUID object keys; presigned URLs only |
| SQL injection | API inputs | Prisma ORM parameterised queries exclusively |
| XSS via forum posts | Markdown → HTML | Server-side DOMPurify sanitisation before storage |
| CSRF | State-changing requests | SameSite=Strict cookies + CSRF token on sensitive forms |
| Defamatory content | Unmoderated posts | Grievance descriptions private; aggregated stats public only |
| Admin impersonation | Stolen JWT | 15-minute access token TTL; RS256 asymmetric signing |
| Secrets in code | Developer error | All secrets in env vars; Dependabot on repo |

---

## 2. Authentication Implementation

### OTP Flow (Buyer Login)

```
POST /api/v1/auth/otp/send
  ↓
  1. Validate phone format (+91XXXXXXXXXX)
  2. Check rate limit: max 3 OTP requests per phone per 10 minutes (Redis counter)
  3. Generate OTP: crypto.randomInt(100000, 999999)  — NOT Math.random()
  4. Hash OTP: await bcrypt.hash(otp, 10)
  5. Store OTPRecord { phone, otpHash, expiresAt: now+5min, attempts: 0 }
  6. Dispatch SMS via MSG91 (async, fire-and-forget with retry queue)
  7. Return: { expiresIn: 300 }  — never echo back the OTP

POST /api/v1/auth/otp/verify
  ↓
  1. Find OTPRecord by phone where NOT used AND expiresAt > now
  2. Check attempts < 3; else: invalidate and return OTP_MAX_ATTEMPTS
  3. await bcrypt.compare(submittedOtp, otpHash)
  4. If mismatch: increment attempts, return OTP_INVALID
  5. If match:
     a. Mark OTPRecord as used (or delete it)
     b. Upsert User { phone, phoneVerified: true }
     c. Issue JWT access token (15min) + refresh token (30d)
     d. Store refresh token in Redis: refresh:{userId}:{tokenId} → TTL 30d
  6. Return tokens + user profile
```

### JWT Configuration

```typescript
// RS256 — asymmetric signing
// Private key: signs tokens (API server only)
// Public key: verifies tokens (can be shared with other services)

// Access Token payload:
{
  sub: userId,          // user ID
  role: UserRole,       // BUYER | ADMIN | MODERATOR
  vs: VerificationStatus,  // UNVERIFIED | PENDING_REVIEW | VERIFIED_OWNER
  jti: tokenId,         // unique token ID for blacklist
  iat: issuedAt,
  exp: issuedAt + 15min
}

// Refresh Token payload:
{
  sub: userId,
  jti: tokenId,         // unique per rotation
  exp: issuedAt + 30d
}
```

### Token Rotation & Invalidation

```
On refresh (/auth/token/refresh):
  1. Validate incoming refresh token (signature + expiry)
  2. Check Redis key refresh:{userId}:{jti} exists (one-time use)
  3. Delete old Redis key
  4. Issue new access token + new refresh token
  5. Store new refresh token in Redis

On logout (/auth/logout):
  1. Add access token jti to Redis blacklist: blacklist:{jti} → TTL = remaining access token lifetime
  2. Delete refresh token from Redis
  3. All future requests with old access token: rejected at guard level
```

---

## 3. Role-Based Access Control (RBAC)

### Role Definitions

| Role | How Granted | Scope |
|---|---|---|
| `BUYER` (unverified) | Auto-assigned on OTP login | Read all public data; post in forum; file grievances |
| `BUYER` (verified owner) | Admin approves ownership doc | Above + verified badge; WhatsApp group join; upvote grievances |
| `MODERATOR` | Admin elevation | BUYER access + hide/flag posts |
| `ADMIN` | Manual provisioning only | Full access including RERA sync, data management |

### Guard Implementation (NestJS)

```typescript
// apps/api/src/common/guards/jwt-auth.guard.ts
// Validates JWT on every protected route
// Checks Redis blacklist for revoked tokens

// apps/api/src/common/guards/roles.guard.ts
// Checks @Roles() decorator against JWT role claim
// Example usage:
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Patch('/admin/projects/:id/publish')
```

### Verified Buyer Gate

For actions requiring verified ownership (WhatsApp group join, grievance upvote):

```typescript
// Check in service layer — not just role, but verificationStatus
if (user.verificationStatus !== VerificationStatus.VERIFIED_OWNER) {
  throw new ForbiddenException('NOT_VERIFIED_OWNER')
}
// Additionally check: buyer is linked to the specific project
const link = await prisma.buyerProjectLink.findUnique({
  where: { buyerProfileId_projectId: { buyerProfileId, projectId } }
})
if (!link?.isVerified) throw new ForbiddenException('NOT_VERIFIED_FOR_PROJECT')
```

---

## 4. Data Privacy — DPDP Act 2023 Compliance

### Personal Data Inventory

| Data Element | Collected | Purpose | Retention | Encryption |
|---|---|---|---|---|
| Mobile phone | Yes | OTP auth (primary ID) | Account lifetime | In transit (TLS) |
| Display name | Yes (first + last initial) | Forum identity | Account lifetime | At rest (PG) |
| Unit type (BHK) | Yes | Community context | Account lifetime | At rest (PG) |
| Unit number | Hash only (SHA-256) | Uniqueness check | Account lifetime | Hash (irreversible) |
| Agreement to Sale PDF | Yes (temporary) | Ownership verification | Deleted within 30d of admin review | AES-256-GCM + TLS |
| Grievance description | Yes | Core feature | Grievance lifetime + 2 years | At rest (PG) |
| Evidence files | Yes (optional) | Support grievance | Same as grievance | AES-256-GCM + R2 SSE |
| IP address | Logs only | Rate limiting, abuse | 30 days (log rotation) | N/A |

### What We Deliberately Do Not Collect

- Full legal name
- Aadhaar, PAN, or any government ID number
- Complete agreement to sale terms or financial figures
- Exact floor/unit number in plaintext
- Loan account details or EMI information
- Device identifiers or browser fingerprints

### Data Subject Rights Implementation

| Right | Endpoint | Implementation |
|---|---|---|
| Access | `GET /api/v1/users/me` | Returns all personal data held |
| Correction | `PATCH /api/v1/users/me/profile` | Updates display name, preferences |
| Erasure | `DELETE /api/v1/users/me` | Soft-delete account; anonymise forum posts; queue R2 file deletion (30d) |
| Withdrawal of consent | Revoke ownership verification | Breaks buyer-project link; deletes agreement doc |

### Anonymisation Rules

```typescript
// When user deletes account:
// 1. User record: isActive = false, phone = hashed, email = null
// 2. BuyerProfile: displayName = "Deleted User", verificationDocKey = null (file deleted)
// 3. Grievances: userId replaced with null (grievance kept for aggregate stats)
// 4. Forum posts: authorId replaced with null; displayName = "Former Member"
// 5. BuyerProjectLink: deleted
// 6. Queue R2 deletion job for any files associated with this user
```

---

## 5. File Storage Security

### R2 Bucket Configuration

```
Bucket policy: PRIVATE — no public access
Server-side encryption: AES-256 (R2 managed keys)
Object key format: {module}/{entityId}/{cuid}.{ext}
  Examples:
    grievances/clxyz123/cldef456.pdf
    verification/clbuy789/clabc123.pdf

CORS policy (R2 bucket):
  AllowedOrigins: https://rewebportal.in, https://api.rewebportal.in
  AllowedMethods: PUT (direct upload only)
  AllowedHeaders: Content-Type, Content-Length
  MaxAgeSeconds: 3600
```

### Presigned URL Strategy

| File Type | TTL | Who Can Generate | Who Can Access |
|---|---|---|---|
| Grievance evidence | 15 minutes | Admin only | Admin only |
| Agreement to Sale | 5 minutes | Admin only | Admin only |
| Builder logos | 24 hours | Backend (cache result) | Public via CDN |
| Project images | 24 hours | Backend | Public via CDN |

### Application-Layer Encryption (Agreement Docs)

```typescript
// Additional encryption ON TOP of R2's built-in SSE
// Used for: Agreement to Sale PDFs only

import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

// Encrypt before upload to R2:
const iv = randomBytes(16)
const cipher = createCipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY, 'hex'), iv)
// ENCRYPTION_KEY: 32-byte hex string from environment variable

// Store iv alongside the R2 object key in DB (not the key itself)
// Decrypt only during admin verification review
```

---

## 6. API Security Checklist for Developers

When adding a new endpoint, verify:

- [ ] Public endpoint? Add to allow-list in auth guard
- [ ] Mutating state? Requires authentication + CSRF token header
- [ ] Accessing user data? Verify ownership (`user.id === resource.userId`)
- [ ] File upload? Validate MIME by magic bytes, not extension; enforce size limit
- [ ] Admin only? Apply `@Roles(UserRole.ADMIN)` decorator
- [ ] Rate limiting? Add to throttler config if custom limit needed
- [ ] Logging sensitive data? Remove before merge (no phone/OTP in logs)
- [ ] DTO validates all inputs? `class-validator` decorators on every DTO field

---

## 7. Content Security Policy (CSP) Headers

```typescript
// Set via Helmet.js in main.ts
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],   // unsafe-inline needed for Next.js inline scripts
      styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
      fontSrc: ["'self'", 'fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', '*.cloudflare.com', 'api.mapbox.com'],
      connectSrc: ["'self'", 'api.rewebportal.in', '*.mapbox.com'],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
)
```

---

## 8. Admin Security

### Provisioning Process

Admin accounts are manually provisioned — no self-registration path exists.

```bash
# Create admin account (run once by existing admin or via DB migration)
# Admin password: bcrypt(cost=12), minimum 12 chars, complexity required
INSERT INTO users (phone, email, password_hash, role)
VALUES ('RESERVED', 'admin@rewebportal.in', bcrypt('strong-pass', 12), 'ADMIN');
```

### Admin Audit Log (Immutable)

Every admin action is recorded in `admin_actions` table. The table has:
- A PostgreSQL trigger preventing `DELETE` on any row
- No `DELETE` privilege granted to the application DB user
- Retained indefinitely for compliance

```typescript
// AdminAction record example:
{
  adminUserId: 'clxyz...',
  actionType: 'RERA_SYNC_APPROVED',
  entityType: 'Project',
  entityId: 'clabc...',
  before: { status: 'REGISTERED', expiryDate: '2024-12-31' },
  after: { status: 'EXTENDED', expiryDate: '2026-06-30' },
  note: 'Verified against MahaRERA portal',
  performedAt: '2025-04-28T10:30:00Z'
}
```

### Failed Login Lockout

```
5 failed admin login attempts → account locked for 30 minutes
Lockout state tracked in Redis: admin_lockout:{userId} → TTL 30min
On each failed attempt: increment counter, update TTL
Admin can be unlocked by another admin via /admin/users/:id/unlock
```

---

*See also: `docs/architecture/05-security-model.md` for the full threat model and data flow diagrams.*
*Security architecture version: v1.0 | Last reviewed: May 2025*
