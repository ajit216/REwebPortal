import type { Metadata } from 'next'
import Link from 'next/link'
import { Scale, MapPin, Phone, ArrowLeft, Star, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Expert Network — Legal Help for Homebuyers',
  description: 'Find RERA-specialised lawyers and property consultants in Mumbai & Thane for homebuyer disputes.',
}

const EXPERTS = [
  {
    id: 'e1',
    name: 'Adv. Suresh Mehta',
    specialization: 'RERA & Consumer Forum',
    areas: ['Andheri', 'Bandra', 'Juhu'],
    city: 'Mumbai',
    experience: '18 years',
    languages: ['English', 'Hindi', 'Marathi'],
    consultationFee: 'Free (15 min) · ₹1,500 onwards',
    highlight: 'Pro-bono for group complaints of 5+ buyers',
    tags: ['RERA', 'Consumer Forum', 'Group Complaints'],
  },
  {
    id: 'e2',
    name: 'Adv. Priya Iyer',
    specialization: 'Real Estate & Property Law',
    areas: ['Thane', 'Kalyan', 'Dombivli'],
    city: 'Thane',
    experience: '12 years',
    languages: ['English', 'Hindi', 'Tamil'],
    consultationFee: '₹500 (30 min)',
    highlight: 'Specialises in MahaRERA complaint filing',
    tags: ['RERA', 'Title Disputes', 'OC Issues'],
  },
  {
    id: 'e3',
    name: 'Adv. Rajesh Patil',
    specialization: 'Consumer Protection & RERA',
    areas: ['Mulund', 'Ghatkopar', 'Vikhroli'],
    city: 'Mumbai',
    experience: '9 years',
    languages: ['English', 'Hindi', 'Marathi'],
    consultationFee: '₹750 (30 min)',
    highlight: 'Successfully handled 200+ RERA cases',
    tags: ['RERA', 'Consumer Forum', 'Possession Delay'],
  },
  {
    id: 'e4',
    name: 'Adv. Kavita Sharma',
    specialization: 'Property & Housing Law',
    areas: ['Goregaon', 'Malad', 'Kandivali'],
    city: 'Mumbai',
    experience: '15 years',
    languages: ['English', 'Hindi', 'Gujarati'],
    consultationFee: '₹1,000 (45 min)',
    highlight: 'Also handles possession delay cases under Section 18',
    tags: ['Section 18', 'RERA', 'Refund Claims'],
  },
]

export default function ExpertsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-neutral-500">
        <ol className="flex items-center gap-1">
          <li><Link href="/legal" className="hover:text-neutral-700">Legal Library</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-neutral-900 font-medium" aria-current="page">Expert Network</li>
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-neutral-900">Expert Network</h1>
        <p className="text-neutral-600 mt-1 max-w-2xl">
          RERA-specialised lawyers and property consultants in Mumbai & Thane. 
          All experts have been verified by the REwebPortal team.
        </p>
      </div>

      {/* Info banner */}
      <div className="mb-8 rounded-xl bg-primary-50 border border-primary-200 p-4 flex items-start gap-3 text-sm text-primary-800">
        <CheckCircle className="h-5 w-5 shrink-0 text-primary-500 mt-0.5" aria-hidden="true" />
        <div>
          <p className="font-semibold">How this works</p>
          <p className="text-primary-700 mt-0.5">
            Contact experts via the platform email form. Phone numbers are not publicly listed to prevent unsolicited calls.
            Initial 15-minute consultations are free with most experts.
          </p>
        </div>
      </div>

      {/* Expert Cards */}
      <div className="space-y-5">
        {EXPERTS.map((expert) => (
          <div key={expert.id} className="rounded-xl border border-neutral-200 bg-white p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                <Scale className="h-7 w-7 text-primary-500" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div>
                    <h2 className="font-heading text-base font-semibold text-neutral-900">{expert.name}</h2>
                    <p className="text-sm text-neutral-600">{expert.specialization} · {expert.experience}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {expert.tags.map((tag) => (
                      <Badge key={tag} variant="info">{tag}</Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-neutral-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    {expert.areas.join(', ')}, {expert.city}
                  </span>
                  <span>Languages: {expert.languages.join(', ')}</span>
                </div>

                <div className="mt-2 text-sm text-neutral-600">
                  <strong>Fee: </strong>{expert.consultationFee}
                </div>

                {expert.highlight && (
                  <div className="mt-2 flex items-center gap-1.5 text-sm text-success-700">
                    <Star className="h-3.5 w-3.5 text-success-500" aria-hidden="true" />
                    {expert.highlight}
                  </div>
                )}

                <div className="mt-4">
                  <Button size="sm" asChild>
                    <a href={`mailto:hello@rewebportal.in?subject=Expert Contact Request: ${expert.name}`}>
                      Contact via Platform →
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl bg-neutral-50 border border-neutral-200 p-4 text-xs text-neutral-500">
        <p>
          <strong>Disclaimer:</strong> REwebPortal facilitates introductions but is not responsible for legal outcomes. 
          Verify the expert's credentials independently before engaging. Expert fees and availability are subject to change.
        </p>
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
