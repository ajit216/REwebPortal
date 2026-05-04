import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Eye, Lock, Scale, Accessibility } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About REwebPortal',
  description: 'About REwebPortal — empowering defrauded and at-risk homebuyers through project transparency, community connection, and grievance amplification.',
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-bold text-neutral-900 mb-4">About REwebPortal</h1>
      <p className="text-lg text-neutral-600 mb-10 max-w-2xl">
        Empowering defrauded and at-risk homebuyers through project transparency, 
        community connection, and grievance amplification — for Mumbai & Thane residential real estate.
      </p>

      {/* Mission */}
      <section className="mb-10">
        <h2 className="font-heading text-xl font-bold text-neutral-900 mb-4">Our Mission</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { icon: Eye, title: 'Radical Transparency', desc: 'We surface RERA compliance data, delivery track records, and buyer experiences that builders would rather keep hidden.' },
            { icon: Shield, title: 'Buyer Protection First', desc: 'Every feature is designed to help homebuyers make informed decisions and protect their financial interests.' },
            { icon: Scale, title: 'Factual, Not Defamatory', desc: 'We show data and patterns — not editorial opinions. Facts speak louder than opinions.' },
            { icon: Lock, title: 'Privacy by Default', desc: 'Personal buyer data is never exposed without explicit consent. We protect the community we serve.' },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-neutral-200 bg-white p-5">
              <item.icon className="h-6 w-6 text-primary-500 mb-3" aria-hidden="true" />
              <h3 className="font-heading text-base font-semibold text-neutral-900 mb-1">{item.title}</h3>
              <p className="text-sm text-neutral-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Problems we solve */}
      <section className="mb-10" id="how-it-works">
        <h2 className="font-heading text-xl font-bold text-neutral-900 mb-4">Problems We Solve</h2>
        <div className="overflow-hidden rounded-xl border border-neutral-200">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-5 py-3 text-left font-semibold text-neutral-700">Problem</th>
                <th className="px-5 py-3 text-left font-semibold text-neutral-700">Our Solution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {[
                ['Builders control project narrative', 'Verified project profiles with RERA-sourced data'],
                ['Buyers are isolated', 'Community groups, forums, co-buyer discovery'],
                ['No unified knowledge base', 'Searchable project + builder wiki'],
                ['Grievances go unheard', 'Structured complaint logging + aggregation dashboard'],
                ['No early warning signals', 'Transparency scorecards + red-flag alerts'],
              ].map(([problem, solution]) => (
                <tr key={problem} className="bg-white">
                  <td className="px-5 py-3 text-neutral-700">{problem}</td>
                  <td className="px-5 py-3 text-neutral-700 font-medium">{solution}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Scope */}
      <section className="mb-10">
        <h2 className="font-heading text-xl font-bold text-neutral-900 mb-4">Our Scope</h2>
        <div className="rounded-xl border border-primary-200 bg-primary-50 p-6">
          <div className="grid gap-3 sm:grid-cols-2 text-sm">
            {[
              ['Geography', 'Mumbai (all suburbs) + Thane district'],
              ['Property Type', 'Residential only (apartments, townships)'],
              ['Builder Tier', 'Reputed branded builders'],
              ['User Type', 'Existing homebuyers, prospective buyers'],
              ['Platform', 'Web (desktop-first, mobile-responsive)'],
              ['Data Source', 'MahaRERA public records + community reports'],
            ].map(([label, value]) => (
              <div key={label}>
                <span className="font-semibold text-primary-800">{label}:</span>{' '}
                <span className="text-primary-700">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mb-10">
        <h2 className="font-heading text-xl font-bold text-neutral-900 mb-4">Contact & Feedback</h2>
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <p className="text-sm text-neutral-700 mb-4">
            For data corrections, partnership enquiries, or feedback:
          </p>
          <p className="text-sm font-medium text-primary-600">hello@rewebportal.in</p>
          <p className="text-xs text-neutral-400 mt-2">We typically respond within 2 business days.</p>
        </div>
      </section>

      {/* Disclaimer */}
      <section id="disclaimer" className="rounded-xl bg-neutral-900 text-neutral-400 p-6">
        <h2 className="font-heading text-lg font-semibold text-white mb-3">Legal Disclaimer</h2>
        <p className="text-sm leading-relaxed">
          REwebPortal presents data from publicly available MahaRERA filings and community-reported information. 
          This platform does not provide legal or financial advice. Transparency scores are algorithmic indicators based 
          on data patterns — not editorial opinions or investment recommendations. Users should verify all information 
          with official MahaRERA records before making real estate decisions. REwebPortal is not affiliated with MahaRERA 
          or any builder listed on this platform.
        </p>
        <p className="text-sm leading-relaxed mt-3">
          Platform complies with the Digital Personal Data Protection Act, 2023 (DPDP Act) of India.
        </p>
      </section>
    </div>
  )
}
