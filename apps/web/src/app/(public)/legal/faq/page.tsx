import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'FAQ — REwebPortal',
  description: 'Frequently asked questions about REwebPortal, RERA rights, and homebuyer protection in Maharashtra.',
}

const FAQ_SECTIONS = [
  {
    section: 'About REwebPortal',
    faqs: [
      {
        q: 'What is REwebPortal?',
        a: 'REwebPortal is a transparency platform for residential homebuyers in Mumbai and Thane. We aggregate RERA compliance data, buyer grievances, and community information to help buyers make informed decisions and protect their investments.',
      },
      {
        q: 'Is this platform free to use?',
        a: 'Yes, all core features — browsing projects, viewing RERA data, transparency scores, and legal resources — are completely free. Registration is also free and only requires a phone number.',
      },
      {
        q: 'Is REwebPortal affiliated with MahaRERA or any builder?',
        a: 'No. REwebPortal is an independent platform. We are not affiliated with MahaRERA, any builder, or any government authority. We use publicly available MahaRERA data and community-reported information.',
      },
      {
        q: 'How is data verified?',
        a: 'RERA data is sourced from MahaRERA public records and is reviewed by our admin team before publication. Buyer grievances and community posts are moderated per our community guidelines.',
      },
    ],
  },
  {
    section: 'RERA Rights',
    faqs: [
      {
        q: 'What can I do if my builder has delayed possession?',
        a: 'Under Section 18 of RERA, you can demand either (a) a full refund with interest at the prescribed rate, or (b) monthly compensation until possession is given. You can file a complaint on MahaRERA portal for free.',
      },
      {
        q: 'What does RERA lapsed mean?',
        a: 'RERA lapsed means the builder\'s registration with MahaRERA has expired and has not been renewed. Builders must maintain a valid RERA registration throughout construction. A lapsed RERA is a serious red flag — buyers have enhanced legal rights in this situation.',
      },
      {
        q: 'Can I get a refund if my project is RERA lapsed?',
        a: 'Yes. If the project\'s RERA registration has lapsed and possession has not been given, you can invoke Section 18 of RERA to demand a full refund with interest. File a complaint on MahaRERA portal and also consider approaching the consumer forum.',
      },
      {
        q: 'What is the OC (Occupancy Certificate) and why does it matter?',
        a: 'The Occupancy Certificate (OC) is issued by the local municipal authority certifying that the building is safe for occupation. Without OC, you cannot legally register your flat. Builders must obtain OC before giving possession. If your builder has given possession without OC, they are in violation of RERA.',
      },
    ],
  },
  {
    section: 'Platform Features',
    faqs: [
      {
        q: 'What is the Transparency Score?',
        a: 'The Transparency Score (0–100) is computed from RERA compliance (30%), delivery track record (25%), grievance rate (20%), information completeness (15%), and buyer sentiment (10%). It\'s an algorithmic indicator of project/builder transparency — not a financial recommendation.',
      },
      {
        q: 'How do I verify my ownership?',
        a: 'Go to Dashboard → Verify Ownership. Select your project, choose your unit type (BHK), and upload your Agreement to Sale. Our admin reviews it within 2–3 business days. After verification, you get a Verified Buyer badge on all posts and grievances.',
      },
      {
        q: 'Is my personal information safe?',
        a: 'Yes. Your phone number is never shared publicly. Your Agreement to Sale is stored encrypted and deleted within 30 days of verification. Your unit number is never stored. We comply with India\'s DPDP Act 2023.',
      },
      {
        q: 'What information is visible publicly on my grievances?',
        a: 'Only the grievance title and status are visible publicly (not the description or evidence). You can also choose to post anonymously, in which case you\'ll appear as "Verified Buyer" instead of your name.',
      },
    ],
  },
  {
    section: 'Community',
    faqs: [
      {
        q: 'Can anyone post in the community forum?',
        a: 'Any registered user can post. Verified buyers get a green checkmark badge that makes their posts more trusted. Unregistered visitors can read all posts.',
      },
      {
        q: 'How do I join the WhatsApp buyer group for my project?',
        a: 'You must first be a Verified Buyer for that project. Then go to the project\'s Community tab and click "Join WhatsApp Group." Your phone number will be shared with the group admin who will add you within 24 hours.',
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-neutral-500">
        <ol className="flex items-center gap-1">
          <li><Link href="/legal" className="hover:text-neutral-700">Legal Library</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-neutral-900 font-medium" aria-current="page">FAQ</li>
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-neutral-900">Frequently Asked Questions</h1>
        <p className="text-neutral-600 mt-1">Everything you need to know about REwebPortal and homebuyer rights.</p>
      </div>

      <div className="space-y-8">
        {FAQ_SECTIONS.map((section) => (
          <div key={section.section}>
            <h2 className="font-heading text-lg font-bold text-neutral-900 mb-4 pb-2 border-b border-neutral-200">
              {section.section}
            </h2>
            <div className="space-y-4">
              {section.faqs.map((faq, i) => (
                <details key={i} className="group rounded-xl border border-neutral-200 bg-white overflow-hidden">
                  <summary className="flex cursor-pointer items-center justify-between p-5 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors list-none">
                    <span>{faq.q}</span>
                    <ChevronDown className="h-4 w-4 text-neutral-400 shrink-0 group-open:rotate-180 transition-transform" aria-hidden="true" />
                  </summary>
                  <div className="px-5 pb-5 text-sm text-neutral-700 leading-relaxed border-t border-neutral-100 pt-4">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-xl bg-primary-50 border border-primary-200 p-5">
        <p className="text-sm font-semibold text-primary-900 mb-1">Still have questions?</p>
        <p className="text-sm text-primary-700 mb-3">Contact us at hello@rewebportal.in or find a legal expert for personalized advice.</p>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" asChild>
            <Link href="/legal/experts">Find an Expert</Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href="/about#contact">Contact Us</Link>
          </Button>
        </div>
      </div>

      <div className="mt-6">
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
