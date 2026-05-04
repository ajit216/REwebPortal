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
