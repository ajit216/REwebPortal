import Link from 'next/link'
import { Shield, Search, FileText, Users, ArrowRight, TrendingDown, AlertTriangle, CheckCircle, Building } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AlertBanner } from '@/components/shared/alert-banner'
import { ProjectCard } from '@/components/project/project-card'
import { BuilderCard } from '@/components/builder/builder-card'
import { PROJECTS, BUILDERS, ANALYTICS_STATS, LEGAL_RESOURCES, RED_FLAGS } from '@/data/mock'

export default function LandingPage() {
  const featuredDelayedProjects = PROJECTS.filter((p) =>
    ['DELAYED', 'STALLED'].includes(p.status)
  ).slice(0, 3)

  // Thane city → Lodha Group only
  const thaneLodhProjects = PROJECTS.filter(
    (p) => p.city === 'Thane' && p.builderId === 'b1'
  ).slice(0, 3)

  const featuredBuilders = BUILDERS.slice(0, 6)
  const featuredLegal = LEGAL_RESOURCES.slice(0, 3)

  return (
    <>
      <AlertBanner
        type="info"
        message="Thane city residential projects: exclusively featuring Lodha Group developments."
        linkLabel="Browse Thane projects"
        linkHref="/projects?city=Thane"
      />

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-700 to-primary-600 text-white">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium">
              <Shield className="h-3.5 w-3.5" aria-hidden="true" />
              Mumbai & Thane Residential Projects
            </div>
            <h1 className="font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Know the truth about your<br />Mumbai & Thane builder
            </h1>
            <p className="mt-4 text-lg text-primary-100 max-w-xl">
              RERA compliance, delivery track records, and buyer experiences — in one place.
              Empowering homebuyers through transparency.
            </p>

            {/* Search Bar */}
            <div className="mt-8 flex max-w-xl gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" aria-hidden="true" />
                <input
                  type="search"
                  placeholder="Search project, builder, or RERA number…"
                  className="w-full rounded-xl border-0 bg-white pl-10 pr-4 py-3.5 text-neutral-900 placeholder-neutral-400 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                  aria-label="Search projects or builders"
                />
              </div>
              <Button size="lg" variant="outline" className="bg-white text-primary-700 hover:bg-primary-50 border-0 shadow-lg" asChild>
                <Link href="/projects">Search</Link>
              </Button>
            </div>

            {/* Trust Signals */}
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-primary-200">
              <span className="flex items-center gap-1.5">
                <Building className="h-4 w-4" aria-hidden="true" />
                <strong className="text-white">{ANALYTICS_STATS.totalProjects}</strong> projects tracked
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" aria-hidden="true" />
                <strong className="text-white">2,847</strong> verified buyers
              </span>
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                <strong className="text-white">{ANALYTICS_STATS.totalGrievances.toLocaleString('en-IN')}</strong> complaints logged
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── THANE — LODHA PROJECTS ────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
              <Building className="h-3.5 w-3.5" aria-hidden="true" />
              Thane City · Lodha Group
            </div>
            <h2 className="font-heading text-2xl font-bold text-neutral-900">
              Thane Residential Projects
            </h2>
            <p className="text-neutral-600 mt-1 text-sm">
              Exclusive Lodha Group developments across Thane — track RERA status, delivery, and buyer sentiment
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/projects?city=Thane">View all Thane →</Link>
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {thaneLodhProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              redFlags={RED_FLAGS[project.id] ?? []}
            />
          ))}
        </div>
      </section>

      {/* ── FEATURED DELAYED PROJECTS ─────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-heading text-2xl font-bold text-neutral-900">
              ⚠️ These projects need attention
            </h2>
            <p className="text-neutral-600 mt-1 text-sm">Projects with critical delays and high grievance counts</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/projects?status=DELAYED,STALLED">
              See all →
            </Link>
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredDelayedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              redFlags={RED_FLAGS[project.id] ?? []}
            />
          ))}
        </div>
      </section>

      {/* ── BUILDER SCORECARDS PREVIEW ────────────────────────────── */}
      <section className="bg-neutral-100 border-y border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-heading text-2xl font-bold text-neutral-900">Builder Scorecards</h2>
              <p className="text-neutral-600 mt-1 text-sm">Transparency grades for reputed Mumbai & Thane builders</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/builders">See all builder scores →</Link>
            </Button>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredBuilders.map((builder) => (
              <BuilderCard key={builder.id} builder={builder} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-heading text-2xl font-bold text-neutral-900">How It Works</h2>
          <p className="text-neutral-600 mt-2">Three steps to protect yourself as a homebuyer</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              step: '1',
              icon: Search,
              title: 'Search your project',
              desc: 'Find your project or builder by name, locality, or RERA number. Access verified RERA data instantly.',
              color: 'bg-primary-500',
            },
            {
              step: '2',
              icon: Shield,
              title: 'See real data + buyer experiences',
              desc: 'Review RERA compliance status, delivery track record, transparency score, and aggregated buyer complaints.',
              color: 'bg-success-500',
            },
            {
              step: '3',
              icon: FileText,
              title: 'Take action',
              desc: 'File a complaint, join your buyer community, or consult our legal resources to know your rights.',
              color: 'bg-warning-500',
            },
          ].map((item) => (
            <div key={item.step} className="relative rounded-xl border border-neutral-200 bg-white p-6">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.color} mb-4`}>
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="absolute top-4 right-4 font-heading text-5xl font-bold text-neutral-100 select-none" aria-hidden="true">
                {item.step}
              </div>
              <h3 className="font-heading text-base font-semibold text-neutral-900 mb-2">{item.title}</h3>
              <p className="text-sm text-neutral-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── LEGAL RESOURCE HIGHLIGHT ──────────────────────────────── */}
      <section className="bg-primary-50 border-y border-primary-100">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-heading text-2xl font-bold text-neutral-900">Know Your Rights</h2>
              <p className="text-neutral-600 mt-1 text-sm">Legal resources for Maharashtra homebuyers</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/legal">Legal Library →</Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {featuredLegal.map((resource) => (
              <Link
                key={resource.id}
                href={`/legal/${resource.slug}`}
                className="group rounded-xl border border-primary-200 bg-white p-5 hover:shadow-md hover:border-primary-400 transition-all"
              >
                <div className="flex items-center gap-2 mb-2 text-xs text-primary-600 font-medium uppercase tracking-wide">
                  <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                  {resource.readingTimeMinutes} min read
                </div>
                <h3 className="font-heading text-sm font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
                  {resource.title}
                </h3>
                <p className="text-xs text-neutral-600 line-clamp-2">{resource.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── ANALYTICS SNAPSHOT ────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-neutral-900 text-white p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="font-heading text-2xl font-bold mb-2">
                The State of Mumbai & Thane Real Estate (2025)
              </h2>
              <p className="text-neutral-400 text-sm max-w-md">
                Data-driven insights from {ANALYTICS_STATS.totalProjects} tracked projects across reputed builders
              </p>
            </div>
            <Button variant="outline" className="bg-transparent border-neutral-600 text-white hover:bg-neutral-800" asChild>
              <Link href="/analytics">View Full Analytics →</Link>
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Projects Tracked', value: ANALYTICS_STATS.totalProjects.toString(), color: 'text-primary-400' },
              { label: 'Delayed / Stalled', value: `${(ANALYTICS_STATS.byStatus.DELAYED || 0) + (ANALYTICS_STATS.byStatus.STALLED || 0)}`, color: 'text-danger-400' },
              { label: 'Active Grievances', value: ANALYTICS_STATS.activeGrievances.toLocaleString(), color: 'text-warning-400' },
              { label: 'Avg Score', value: `${ANALYTICS_STATS.avgTransparencyScore}/100`, color: 'text-success-400' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-neutral-800 p-4">
                <p className={`font-heading text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-neutral-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMUNITY TESTIMONIALS ────────────────────────────────── */}
      <section className="bg-neutral-100 border-t border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-neutral-900 mb-8 text-center">
            What Buyers Are Saying
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                quote: "REwebPortal helped me discover my project's RERA had lapsed. I didn't know I could legally demand a refund until I found the legal resources here.",
                attribution: 'Verified Buyer, Thane West',
              },
              {
                quote: "Found 23 other buyers in my project and we collectively filed RERA complaints. The community forum made coordination so much easier.",
                attribution: 'Verified Buyer, Mulund',
              },
              {
                quote: "The transparency score told me everything I needed to know before I put down my booking amount. Avoided a builder with a D grade.",
                attribution: 'Prospective Buyer, Dombivli',
              },
            ].map((testimonial, i) => (
              <blockquote key={i} className="rounded-xl border border-neutral-200 bg-white p-6">
                <p className="text-sm text-neutral-700 leading-relaxed italic">"{testimonial.quote}"</p>
                <footer className="mt-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success-100">
                    <CheckCircle className="h-4 w-4 text-success-500" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-medium text-neutral-600">{testimonial.attribution}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h2 className="font-heading text-2xl font-bold text-neutral-900 mb-3">
          Ready to protect your investment?
        </h2>
        <p className="text-neutral-600 mb-6 max-w-md mx-auto">
          Register in 60 seconds with just your mobile number. No password needed.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" asChild>
            <Link href="/register">Register Free →</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/projects">Browse Projects</Link>
          </Button>
        </div>
      </section>
    </>
  )
}
