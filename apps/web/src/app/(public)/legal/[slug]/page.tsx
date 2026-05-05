import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, Calendar, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LEGAL_RESOURCES } from '@/data/mock'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resource = LEGAL_RESOURCES.find((r) => r.slug === params.slug)
  if (!resource) return { title: 'Resource Not Found' }
  return { title: resource.title, description: resource.summary }
}

export async function generateStaticParams() {
  return LEGAL_RESOURCES.map((r) => ({ slug: r.slug }))
}

// Mock article content per slug
const ARTICLE_CONTENT: Record<string, string> = {
  'oc-certificate-what-buyers-must-know': `
## What is the Occupancy Certificate (OC)?

The Occupancy Certificate (OC) is a legal document issued by the local municipal authority (BMC in Mumbai, TMC in Thane) certifying that a building has been constructed as per approved plans and is safe for occupation.

### Why Does OC Matter for Buyers?

Without a valid OC:
- You **cannot legally register** your flat (sub-registrar will not register without OC)
- The flat is not considered legally complete
- You cannot get a home loan completion certificate from your bank
- Water and electricity connections may be denied by civic authorities
- The builder is in **violation of RERA** if they give possession without OC

### What is the Difference Between OC and BCC?

**BCC (Building Completion Certificate):** Issued when construction is complete but before occupancy.

**OC (Occupancy Certificate):** Final certificate confirming the building meets all safety, fire, and structural requirements.

Both are required. OC is the final, more important document.

### When Must the Builder Obtain OC?

Under RERA, the builder must obtain OC before offering possession. If you receive possession without OC:

1. **Do not register the flat** until OC is obtained
2. Write to the builder demanding OC timeline in writing
3. File a complaint on MahaRERA portal
4. The builder cannot compel you to pay maintenance charges without OC

### What If the Builder Claims OC Is "Applied For"?

An OC application is not the same as an OC. Builders sometimes hand over possession claiming "OC applied." This is not legally acceptable. You have the right to wait for actual OC before taking possession and before making final payment.

### Checking OC Status

- Ask builder for copy of OC (they must provide it)
- Check with your local municipal corporation (BMC/TMC) using the building plan reference number
- Verify through MahaRERA portal where recent filings may show OC status
  `,
  'sample-legal-notice-builder': `
## How to Use This Template

This is a ready-to-use legal notice for delayed possession under Section 18 of RERA. Customize the highlighted fields before sending.

### Before You Send

1. Send via **Registered Post with Acknowledgement Due** — keep the tracking number
2. Also send via **email** (to your CRM and their registered email on MahaRERA) — this creates a digital paper trail
3. Keep copies of everything — you will need them if you file at MahaRERA or Consumer Forum

### Important Notes

- Include your **Agreement to Sale reference number** and **RERA registration number** from MahaRERA
- The notice should clearly state the **original possession date** and the **current delay in months**
- Demand a response within **30 days** — if no response, file on MahaRERA portal
- Do not threaten defamation or make unverifiable claims — keep the notice factual

### What to Demand

You have two options under Section 18 of RERA:

**Option A — Refund with Interest:** Demand full refund of all amounts paid with interest at SBI MCLR + 2%

**Option B — Monthly Compensation:** Demand monthly interest payment on amounts paid until possession is given

### After Sending the Notice

- If builder acknowledges and provides a committed new date: wait and track
- If builder does not respond in 30 days: file on MahaRERA portal (free, no lawyer needed)
- Simultaneously consider filing at **Consumer Forum** for mental agony and additional relief
- Use our [RERA Delay Calculator](/tools/delay-calculator) to quantify your compensation claim

Download the Word document template below and replace all [BRACKETED] fields with your specific information.
  `,
  'rera-glossary-terms': `
## Real Estate & RERA Glossary

Plain-language definitions for the terms you will encounter when dealing with property purchases in Maharashtra.

---

**Agreement to Sale (ATS)**
A legally binding document between the buyer and builder specifying the flat details, payment schedule, possession date, and other terms. This is the primary document for ownership verification.

**Allotment Letter**
Issued before ATS, the allotment letter confirms the builder has allocated a specific unit to you. Less legally binding than ATS but important for records.

**BCC (Building Completion Certificate)**
A certificate from the local municipal authority confirming construction is complete as per approved plans. Required before OC can be obtained.

**BHK (Bedroom, Hall, Kitchen)**
Standard configuration notation: 1BHK = 1 bedroom + hall + kitchen; 2BHK = 2 bedrooms + hall + kitchen; etc.

**Carpet Area**
The actual usable floor area within the walls of your flat — the area on which you can literally lay carpet. Under RERA, builders must quote prices based on carpet area only.

**CC (Commencement Certificate)**
Permission from municipal authority to begin construction on a specific plot. Obtained before construction starts.

**Conveyance Deed**
The final document that transfers legal ownership of the flat from builder to buyer. Must be registered at the sub-registrar office.

**CRZ (Coastal Regulation Zone)**
Restrictions on construction near coastlines. Relevant for Mumbai coastal projects.

**D-Form**
A document proving the builder has paid premium/transfer charges to the government. Required for certain plot types.

**FSI (Floor Space Index)**
The ratio of total built-up area to the plot area. Determines how much a builder can construct on a given plot.

**IOD (Intimation of Disapproval)**
A technical step where the municipal authority "disapproves" the plan (a counterintuitive bureaucratic step) before giving building permission. IOD obtained = builder can proceed.

**MahaRERA**
Maharashtra Real Estate Regulatory Authority — the state regulator that registers real estate projects, resolves disputes, and maintains project records. Website: maharera.mahaonline.gov.in

**NOC (No Objection Certificate)**
Certificates from various government departments (fire department, airport authority, etc.) required before a building can be occupied.

**OC (Occupancy Certificate)**
Final municipal certificate confirming the building is safe for occupation and meets all statutory requirements. Required for flat registration.

**Possession Letter**
The letter from the builder offering you possession of your flat. You must verify OC is obtained before accepting possession.

**RERA Registration Number**
A unique identifier assigned by MahaRERA when a project is registered. Format: P51900XXXXXX (P + state code + unique number). Always verify this number on the MahaRERA portal.

**Sub-Registrar**
The government office where property documents are legally registered. Flat registration (conveyance deed) must happen here.

**Super Built-Up Area**
An inflated area measurement that includes common areas like lobbies, staircases. Builders used to quote prices on this — RERA now mandates carpet area pricing only.

**TDR (Transferable Development Rights)**
Rights that allow additional construction in exchange for surrendering land to the government (e.g., for roads or open spaces).

**Undivided Share (UDS)**
Your proportional share of the land on which the building stands. Important for eventual redevelopment or ownership transfer.
  `,
  'rera-complaint-filing-mahararera': `
## How to File a Complaint on MahaRERA Portal

Filing a complaint on MahaRERA is free and does not require a lawyer. This guide walks you through the entire process.

### Who Can File?

- Any allottee (buyer) who has signed an Agreement to Sale
- Buyers who have paid any amount to the builder (even booking amount)
- You can file individually or as a group (joint complaint is stronger)

### Documents You Need

Before starting, gather:
- Copy of your Agreement to Sale
- RERA project registration number (from MahaRERA portal)
- All payment receipts
- Any correspondence with the builder (emails, letters)
- If possession delay: original possession date from ATS vs current date

### Step-by-Step Process

**Step 1: Register on MahaRERA Portal**
- Go to: maharera.mahaonline.gov.in
- Click "Complaint" → "Allottee/Buyer Login"
- Register with your Aadhaar number and mobile number
- Verify with OTP

**Step 2: Start a New Complaint**
- Login → Dashboard → "New Complaint"
- Select project from the dropdown (search by RERA number or project name)
- Select complaint type:
  - Section 18: Refund/Compensation for delay
  - Section 14: Quality defects or violations
  - Other: For miscellaneous issues

**Step 3: Fill Complaint Details**
- Describe your grievance clearly and factually
- State: original possession date, actual current status, amount paid, delay in months
- Upload supporting documents (PDF format, each under 5MB)

**Step 4: Pay Filing Fee**
- Complaint filing fee: ₹2,000 (online payment)
- Group complaint: ₹1,000 per complainant (minimum 5 buyers)
- Payment via debit card, credit card, or net banking

**Step 5: Submit and Track**
- Note your complaint number (format: CC/YEAR/XXXXXX)
- MahaRERA will assign a conciliator within 30 days
- Hearings typically start within 60–90 days
- Most cases resolved within 6–12 months

### After Filing

- Attend all scheduled hearing dates (you can appear via video call)
- If builder doesn't appear after 3 notices, ex-parte order issued
- MahaRERA orders are executable as decrees of a civil court
- If builder doesn't comply with order, file execution proceedings

### Tips for a Strong Complaint

- Be factual and specific — exact dates, amounts, delays
- Attach all correspondence showing builder non-responsiveness
- If filing as a group, have a designated lead complainant
- Consider the [RERA Delay Calculator](/tools/delay-calculator) to compute precise compensation amount
  `,
  'rera-section-18-rights': `
## What is Section 18 of RERA?

Section 18 of the Real Estate (Regulation and Development) Act, 2016 protects homebuyers when a builder fails to hand over possession by the agreed date.

### Your Two Options

**Option 1: Full Refund**
You can demand a full refund of all money paid, along with interest at the prescribed rate (currently SBI's MCLR + 2%). The builder must refund within 45 days of your demand.

**Option 2: Monthly Compensation**
If you want to wait for possession, you can claim monthly interest on the amount paid (at the same rate) until possession is given.

### How to Invoke This Right

1. Send a written notice (registered post or email with read receipt) to the builder demanding compensation
2. Mention Section 18 of RERA Act 2016 explicitly
3. If no response in 30 days, file a complaint on MahaRERA portal
4. You can also approach the consumer forum for relief

### Important Notes

- This right is available even if you have accepted possession with defects under protest
- The right is not waivable by contract — any clause in your agreement trying to waive this is void
- You do not need a lawyer to file on MahaRERA portal (it's free)

### Sample Demand Letter Available
Download our template below to send to your builder.
  `,
  'consumer-forum-complaint-guide': `
## Filing at Maharashtra Consumer Forum

Maharashtra State Consumer Disputes Redressal Commission (MSCDRC) is a powerful alternative to RERA for homebuyers.

### When to Use Consumer Forum Instead of RERA?

- When you want compensation beyond the flat refund (e.g., mental agony, escalation in alternate housing costs)
- When the builder has not paid RERA-ordered compensation
- When the issue is post-possession (defects, maintenance charges disputes)

### Step-by-Step Process

**Step 1: Gather Documents**
- Agreement to Sale / Allotment Letter
- Payment receipts for all installments
- Correspondence with builder (emails, WhatsApp screenshots)
- RERA complaint (if already filed)

**Step 2: Draft Your Complaint**
The complaint must include:
- Your details and builder details
- Nature of deficiency in service
- Relief sought (compensation, refund, or specific performance)

**Step 3: File the Complaint**
- Fee: ₹200 for claims up to ₹50 lakh; ₹400 for claims ₹50 lakh to ₹2 crore
- File at MSCDRC, Mumbai or district commission based on claim amount
- Can be filed online at consumerhelpline.gov.in

**Step 4: Attend Hearings**
Forum typically sets 2-3 dates. You can appear yourself or through an advocate.

### Typical Timeline
6–18 months for a decision at district/state level.
  `,
}

const DEFAULT_CONTENT = `
## Overview

This resource is being prepared by our legal team. Check back soon for the full article.

In the meantime, you can:
- Browse our [Legal Library](/legal) for available resources
- Use our [RERA Delay Calculator](/tools/delay-calculator) to compute compensation
- [Find a Legal Expert](/legal/experts) for personalised advice
`

export default function LegalArticlePage({ params }: PageProps) {
  const resource = LEGAL_RESOURCES.find((r) => r.slug === params.slug)
  if (!resource) notFound()

  const content = ARTICLE_CONTENT[params.slug] ?? DEFAULT_CONTENT

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back */}
      <Link href="/legal" className="mb-6 flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Legal Library
      </Link>

      {/* Article Header */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900 mb-4">
          {resource.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {resource.readingTimeMinutes} min read
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            Published {resource.publishedAt}
          </span>
        </div>

        <div className="mt-4 rounded-xl bg-primary-50 border border-primary-200 p-4 text-sm text-primary-800">
          {resource.summary}
        </div>
      </div>

      {/* Article Content */}
      <div className="prose prose-sm prose-neutral max-w-none">
        {content.split('\n').map((line, i) => {
          if (line.startsWith('## ')) return <h2 key={i} className="font-heading text-xl font-bold text-neutral-900 mt-8 mb-3">{line.replace('## ', '')}</h2>
          if (line.startsWith('### ')) return <h3 key={i} className="font-heading text-base font-semibold text-neutral-800 mt-6 mb-2">{line.replace('### ', '')}</h3>
          if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-semibold text-neutral-800 mt-3">{line.replace(/\*\*/g, '')}</p>
          if (line.startsWith('- ')) return <li key={i} className="text-neutral-700 ml-4 list-disc">{line.replace('- ', '')}</li>
          if (line.trim() === '') return <div key={i} className="h-3" />
          return <p key={i} className="text-neutral-700 leading-relaxed">{line}</p>
        })}
      </div>

      {/* Download / CTA */}
      {resource.category === 'SAMPLE_NOTICES' && (
        <div className="mt-8 rounded-xl border border-neutral-200 bg-neutral-50 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-neutral-800">Download Template</p>
              <p className="text-xs text-neutral-500 mt-0.5">Ready-to-use Word document. Customize with your details.</p>
            </div>
            <Button variant="outline" asChild>
              <a href="#" download aria-label="Download legal notice template">
                <Download className="h-4 w-4" />
                Download
              </a>
            </Button>
          </div>
        </div>
      )}

      {/* Back */}
      <div className="mt-10 pt-6 border-t border-neutral-200">
        <Button variant="outline" asChild>
          <Link href="/legal">
            <ArrowLeft className="h-4 w-4" />
            Back to Legal Library
          </Link>
        </Button>
      </div>
    </div>
  )
}
