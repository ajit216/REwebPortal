# Community Features — REwebPortal

---

## 1. Design Philosophy

Community features solve **buyer isolation** — the problem of homebuyers in the same project having no way to find and connect with each other. Our approach:

- **Project-scoped:** Every community feature is anchored to a specific project
- **Verified-first:** Verified buyers get visual trust signals ("Verified Buyer" badge)
- **Anonymous-safe:** Buyers can engage without revealing identity to other buyers
- **Moderated:** All content subject to platform community guidelines

---

## 2. Project Community Forum

### 2.1 Forum Structure

Each project has one `CommunityGroup` which contains multiple `Thread`s.

```
Project: Lodha Palava — City (Community)
├── 📌 PINNED: Welcome to the Lodha Palava Community
├── 📌 PINNED: How to raise a RERA complaint — step-by-step
├── 🔥 POPULAR: Anyone got possession update for Tower B?         [45 replies]
├── 🆕 NEW: Construction noise complaints from residents         [3 replies]
├── Site visit report — April 2025                               [12 replies]
├── Car parking allocation process — confused?                   [8 replies]
└── Club membership fees — higher than promised                  [19 replies]
```

### 2.2 Thread Features

**Creating a thread:**
- Title (max 120 chars)
- Body (max 2000 chars, Markdown supported — bold, lists, no HTML)
- Anonymous toggle (shows "Verified Buyer" instead of display name)
- Requires login (any registered user can post; unregistered can only read)

**Thread metadata shown publicly:**
- Author: "Ramesh K." or "Verified Buyer" (if anonymous)
- Verified Buyer badge: green checkmark if ownership verified
- Reply count, upvote count
- Timestamp

**Thread actions:**
- Upvote (registered users)
- Reply
- Report (sends to moderation queue)
- Share (copy link)

### 2.3 Reply Threading

One level of nesting supported:
```
Thread post
├── Reply 1 (top-level)
│   ├── Reply 1a (nested under Reply 1)
│   └── Reply 1b
├── Reply 2
└── Reply 3
```

### 2.4 Content Rules (Enforced + Moderation)

**Enforced automatically:**
- No external links in posts (prevents spam and phishing) — URLs auto-stripped
- No phone numbers or email addresses in posts (prevents off-platform contact/harassment)
- Max 3 images per thread (embedded from R2 only, uploaded via platform)

**Moderated (community report + admin review):**
- No personal addresses of builder employees or homebuyers
- No unverified financial fraud claims presented as fact
- No defamatory statements about specific individuals

---

## 3. WhatsApp Community Orchestration

### 3.1 Problem & Solution

Buyers naturally form WhatsApp groups, but they face challenges:
- Hard to find others in the same project
- Groups often lack structure
- Platform has no visibility into group health

**Our approach:** The platform **facilitates introductions** but does NOT manage or store WhatsApp groups directly. This keeps communication under buyer control.

### 3.2 Community Group Registry

Admin creates a `CommunityGroup` entry per project indicating:
```json
{
  "projectId": "...",
  "hasWhatsAppGroup": true,
  "whatsAppAdminNote": "Contact the group admin by clicking 'Request to Join' — a platform admin will connect you via SMS within 24 hours."
}
```

**What is NOT stored:**
- WhatsApp group invite links (these expire and create security/privacy risks)
- WhatsApp group member list
- WhatsApp message content

### 3.3 Join Request Flow

```
[Verified Buyer only — must have verified ownership of this project]

1. Buyer clicks "Join WhatsApp Group" on project community page
2. Platform shows: "This connects verified buyers in [Project]. Your registered 
   phone will be shared with the group admin so they can add you."
3. Buyer confirms consent explicitly
4. Backend:
   a. Verifies buyer owns a unit in this project (verified status)
   b. Logs consent record
   c. Sends SMS to buyer: "Your request has been forwarded to the [Project] 
      community admin. You'll be added within 24 hours."
   d. Notifies community group admin (a trusted verified buyer) via SMS
5. Group admin manually adds the new buyer on WhatsApp
6. Platform never holds the invite link
```

**Privacy safeguard:** Phone number sharing is consent-gated and one-directional — the admin gets the number to add the buyer, but this isn't a general broadcast.

### 3.4 Community Admin Role

For each project with an active WhatsApp group:
- One verified buyer is nominated as "Community Admin" (by platform moderator)
- Community admin receives join requests via SMS
- Community admin does NOT get any platform privilege — they manage the off-platform group only
- Can be replaced by platform admin if unresponsive

---

## 4. Co-Buyer Discovery

### 4.1 Problem

Buyers in the same project may want to find others for:
- Coordinated grievance filing (stronger collectively)
- Sharing legal cost for RERA complaint
- Practical help (site visit coordination)

### 4.2 Feature: Project Buyer Directory (Opt-In)

**Completely opt-in.** Buyers can choose to appear in the project's buyer directory.

**What's shown (never more):**
```
Verified Buyers in Lodha Palava (visible to other verified buyers of this project only)

├── Ramesh K.    ✅ Verified Owner  | Joined: Jan 2024 | BHK: 2BHK
├── Priya M.     ✅ Verified Owner  | Joined: Mar 2024 | BHK: 3BHK
└── Anil P.      ✅ Verified Owner  | Joined: Feb 2024 | BHK: 2BHK
```

**What's never shown:**
- Full name
- Unit/floor number
- Phone number
- Email

**Contact mechanism:** In-platform message request (like LinkedIn connection request), not direct message. Message request goes via platform notification → user decides to share contact.

### 4.3 "Raise Together" Feature

For grievances with >3 upvotes from verified buyers of the same project:

```
📣 RAISE TOGETHER
23 verified buyers upvoted this concern about possession delay.
Want to file a joint RERA complaint? [Join the Group Action]
```

Clicking "Join Group Action" adds the buyer to a private group thread visible only to participants. Platform provides a **RERA complaint template** pre-filled with project RERA number and common complaint fields. Buyers fill in their individual details and file separately (platform doesn't file on their behalf).

---

## 5. Moderation System

### 5.1 Moderation Queue (Admin + Moderator)

```
Admin → /admin/moderation/queue

Reasons for queue entry:
├── Community report (3+ reports on same post)
├── Auto-flag (keyword match: phone number, personal address, explicit content)
└── Manual escalation by moderator

Actions available:
├── Keep Visible (dismiss report)
├── Hide Post (hidden but not deleted — audit trail)
├── Warn User (SMS notification)
├── Delete Post (permanent, with reason recorded)
└── Suspend User (3 warnings → 30-day suspension)
```

### 5.2 Content Reporting

Any logged-in user can report a post:
- Reason options: Harassment, False information, Spam, Personal information exposed, Off-topic
- 3+ reports from different users → auto-queued for moderation
- Reporter notified when action taken

### 5.3 Appeal Process

Hidden posts can be appealed by the author:
- One appeal per post
- Admin reviews and overrides moderation if warranted
- Final decision binding
