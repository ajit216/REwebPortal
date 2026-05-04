# User Flows — REwebPortal

Four primary buyer personas, each with distinct goals and journeys.

---

## Persona 1: The Worried Existing Buyer

**Profile:** Rahul, 36. Bought a 3BHK in a Lodha project in 2021 for ₹1.4Cr. Possession promised Dec 2024 — now May 2025, still no update. Frustrated, isolated.

**Goal:** Find out if others are in the same boat, understand his legal options, file a formal complaint.

---

### Flow 1A: First Visit — Finding His Project

```
Landing Page
  ↓ Search bar prominent: "Search by project name, builder, or RERA number"
  → Types "Lodha Palava" → Autocomplete suggestions appear
  ↓ Clicks project result

Project Detail Page (public, no login required)
  ↓ Sees:
    - Status: DELAYED (red badge)
    - Delay: 14 months
    - Red flag: "RERA Extended — OC Pending"
    - 89 open grievances
    - RERA expiry: Jun 2026

  [Rahul reaction: "Oh, this is real data. Others are affected too."]
  
  ↓ Clicks "Community Forum" tab
    → Sees thread: "Anyone got possession update for Tower B?" (45 replies)
    → Reads replies — sees others in same situation
    [Rahul: "I'm not alone."]
  
  ↓ Wants to reply / file grievance
    → Banner: "Register to join the community"
```

### Flow 1B: Registration

```
Register Page
  → Enters phone: +919XXXXXXXXX
  → Gets OTP via SMS (5-second delivery via MSG91)
  → Enters OTP → Account created
  → Prompted: "Tell us your name for the community" → "Rahul M."
  → Prompted: "Any preferred localities?" → Selects "Thane" → Skip
  
  Redirected back to: Lodha Palava community forum tab
  [Now registered, can post and file grievances]
```

### Flow 1C: Filing First Grievance

```
Project page → "File a Grievance" (sticky CTA button)
  
  Step 1: Category selection
    [Visual card grid with icons]
    → Clicks: "Possession Delay" 📦
  
  Step 2: Severity
    → Selects: High (guidance: "Delay over 6 months with no communication")
  
  Step 3: Describe
    → Title: "Possession delayed 14 months, no update from builder"
    → Description: [Types his experience]
    → Prompt: "Have you sent any email/letter to the builder?"
    → Uploads: Screenshot of unanswered email chain (JPG)
  
  Step 4: Privacy
    → Toggle: "Show me as 'Verified Buyer'" (anonymous to public)
    → Reviews: Title visible, description private
    → Submits
  
  Success screen:
    "Your grievance #GRV-2025-0891 has been filed."
    "Want to strengthen this complaint? Verify your ownership →"
    
  → Rahul clicks "Verify Ownership" (curious)
```

### Flow 1D: Ownership Verification

```
Verification Page
  → Shows: "Verification makes your posts more trusted and unlocks WhatsApp community access"
  → Form:
      - Project: Lodha Palava [pre-filled]
      - Unit type: [Dropdown: 1BHK / 2BHK / 3BHK / 4BHK] → Selects 3BHK
      - Upload Agreement to Sale
  → Privacy notice: "Your agreement will be reviewed by our admin to verify ownership.
    Your unit number and agreement terms will NOT be shared with anyone."
  → Uploads PDF → Submits
  
  Confirmation:
    "Under review. You'll get an SMS in 2-3 business days."
  
  [2 days later]
  SMS: "Rahul, your ownership at Lodha Palava has been verified! ✅ 
        You now have Verified Buyer status. Log in to join the buyer community."
```

### Flow 1E: Joining Community

```
Returns to platform → My Account → "Verified Buyer" badge visible

Project Community Tab → "Join WhatsApp Group"
  → Confirmation: "Your phone number (+91 XXXXXX7890) will be shared with 
    the community admin to add you to the group. Confirm?"
  → Confirms → SMS: "Your request to join [Project] WhatsApp group has been 
    forwarded. You'll be added within 24 hours."

[Next day: added to WhatsApp group by community admin]
[Rahul now has: formal grievance filed, verified status, community access]
```

---

## Persona 2: The Prospective Buyer

**Profile:** Priya, 29. Looking to buy first flat in Thane. Budget ₹80L–₹1.1Cr, 2BHK. Has shortlisted 3 projects but unsure how to evaluate builder track records.

**Goal:** Research builders and projects before committing, make informed decision.

---

### Flow 2A: Research Journey

```
Landing Page
  ↓ Sees: "Research before you buy. Transparency scores for Mumbai & Thane builders."
  ↓ Clicks "Explore Builders"

Builder Directory
  → Filter: City = Thane → 6 builders shown
  → Sees scores: Builder A (Grade A, 88), Builder B (Grade B, 72), Builder C (Grade C, 58)
  
  → Clicks Builder A → Builder Detail Page
    → Transparency Scorecard breakdown visible
    → "15 projects, avg delay: 3.2 months, 94% OC obtained"
    → Recent projects list → All green status
    [Priya: "This builder looks solid"]
  
  → Back → Clicks Builder C → Builder Detail Page
    → Grade C, score 58
    → "Avg delay: 16 months, 6 RERA extensions, 72% OC obtained"
    → 2 red flags: "3 projects with RERA extension pending renewal"
    [Priya: "I'll avoid this one"]
```

### Flow 2B: Project Research

```
Project Directory → Filter: Thane, 2BHK, ₹80-110L
  → 12 results shown
  → Sorted by: Transparency Score (high to low)
  
  → Clicks top result (Score: 91, Grade A+)
  → Project Detail:
      - Status: Under Construction (on schedule)
      - Delay: 0 months
      - Grievances: 8 total, 2 open (low for project size)
      - OC Approvals: IOD ✅, CC ✅, BCC pending
      - RERA: Valid, 18 months to expiry
  
  → Clicks "Buyer Check" tab
    → Due diligence checklist: All green/amber, no red flags
    → Risk assessment: Low
    → Priya downloads checklist as PDF
  
  → Checks Community Forum:
      → 45 threads, mostly positive updates
      → Latest site visit photos: April 2025, construction visible
  
  [Priya: "This project looks good. I'll visit the site."]
  
  → Bookmarks project (requires account creation)
    → Registers → Phone OTP → Account created
    → Project saved to "My Watchlist"
```

---

## Persona 3: The Active Complainant

**Profile:** Suresh, 44. 3 years of fighting a Kalpataru project delay. Has already filed a RERA complaint but needs help tracking it and finding co-complainants to share legal costs.

**Goal:** Find co-complainants for joint legal action, access legal resources, track grievance.

---

### Flow 3A: Legal Resource Discovery

```
Platform → Legal Library
  → Searches: "joint RERA complaint"
  → Article: "How to file a joint RERA complaint: more effective than solo filing"
  → Reads: step-by-step guide, documents needed, cost breakdown
  
  → Downloads: "RERA Complaint Template (Maharashtra)" PDF
  → Sees: "Find a RERA lawyer" → Expert Network
  
Expert Network
  → Filter: Thane, RERA specialist
  → 4 lawyers listed with specializations
  → Finds one offering pro-bono for group complaints
  → Contacts via platform (email form — not phone exposed)
```

### Flow 3B: Finding Co-Complainants

```
Project Page (his project) → Community Forum
  → Posts new thread:
      Title: "Looking for co-buyers for joint RERA complaint — Tower C"
      Body: "I have filed individual RERA complaint. Looking for others 
             with similar possession delay issues to share legal costs."
      [Posted as "Verified Buyer ✅"]
  
  → Thread gets 12 replies within 48 hours
  → Grievance on project: "Raise Together" button visible
    → 23 upvotes from verified buyers
    → "23 verified buyers have similar concerns. Start a group action?" [Yes]
    → Group action thread created (private, verified buyers only)
    → Platform provides pre-filled RERA complaint template
    → Each buyer downloads and files individually (stronger signal to RERA)
```

---

## Persona 4: The Platform Admin / Moderator

**Profile:** Ajit, platform admin. Responsible for data quality, content moderation, RERA syncs.

---

### Flow 4A: RERA Data Sync

```
Admin Dashboard → RERA Sync Queue
  → Shows: 23 projects due for sync (last sync >30 days ago)
  → Clicks project → "Sync from MahaRERA"
  
  [Backend fetches MahaRERA page, parses data, creates diff]
  
  → Review screen shows:
      OLD: RERA Status: Registered | Expiry: Dec 2024
      NEW: RERA Status: Extended  | Expiry: Jun 2026 ← CHANGE
      NEW: Works Done: 72%        ← NEW FIELD
  
  → Red flag candidate suggested: "RERA Extension Obtained — OC Pending"
  → Admin confirms: "Approve sync + Publish red flag"
  
  → Data updated, project cache invalidated
  → Affected buyers notified via SMS/email (async via notification queue)
```

### Flow 4B: Grievance Management

```
Admin Dashboard → Grievance Queue
  → Filter: Unacknowledged, >2 days old → 12 results
  
  → Clicks one: 
      Category: Possession Delay | Severity: High
      Project: Rustomjee Elements
      Filed: 3 days ago | Evidence: 2 files
  
  → Reviews description + evidence (presigned URL, expires in 5 min)
  → Updates status: ACKNOWLEDGED
  → Adds admin note: "Contacted builder representative — follow-up expected"
  → Buyer notified automatically via SMS
  
  → Spots pattern: 15 complaints on this project in last 30 days, same category
  → System has already suggested: "Mass complaint red flag candidate"
  → Approves red flag → Published on project page
```

### Flow 4C: Content Moderation

```
Admin Dashboard → Moderation Queue (8 pending)
  
  → Post flagged: "Builder X's CEO is a fraud living at [address]"
  → Action: HIDE POST
  → Reason: "Personal address exposed, potential defamation"
  → User warned (1st warning)
  
  → Post flagged: "Has anyone else not received their demand letter?"
  → Action: KEEP VISIBLE
  → Reason: Legitimate buyer question, no violations
```

---

## Key UX Principles Across All Flows

1. **No login wall for reading:** All project/builder data is accessible without an account. Registration required only for participation (posting, filing grievances).

2. **Progressive trust:** Unverified → Verified Buyer unlocks features incrementally. Platform doesn't penalize unverified users, just limits sensitive features.

3. **Context-aware CTAs:** On a project page with red flags, the CTA changes from generic "Learn More" to "Understand Your Rights" and links to relevant legal articles.

4. **SMS as primary channel:** India mobile-first. Every critical action (OTP, verification, grievance update, red flag alert) goes via SMS because email open rates are unreliable.

5. **Exit intent on sensitive forms:** If a buyer starts a grievance form and tries to leave, show: "Your draft has been saved. Come back to complete it from My Grievances."
