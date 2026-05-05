/**
 * Database Seed — REwebPortal
 *
 * Seeds development and staging databases with:
 * - 15 reputed builders in Mumbai & Thane
 * - 10 sample projects with realistic RERA data
 * - Sample grievances, community threads, legal resources
 * - 1 admin account
 *
 * Run: pnpm --filter api prisma db seed
 *      (or: npx prisma db seed from apps/api directory)
 */

import { PrismaClient, UserRole, ProjectStatus, GrievanceCategory, GrievanceSeverity, GrievanceStatus, RERARecordStatus, LegalResourceCategory, TransparencyGrade } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // ─── 1. Admin User ──────────────────────────────────────────────────────────
  const adminPasswordHash = await bcrypt.hash('Admin@REwebPortal2025!', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@rewebportal.in' },
    update: {},
    create: {
      phone: '+910000000000',
      email: 'admin@rewebportal.in',
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
      phoneVerified: true,
      isActive: true,
    },
  })
  console.log(`✅ Admin user: ${admin.email}`)

  // ─── 2. Builders ────────────────────────────────────────────────────────────
  const buildersData = [
    {
      slug: 'lodha-group',
      name: 'Lodha Group',
      legalEntityName: 'Macrotech Developers Ltd',
      cinNumber: 'U45200MH1995PLC093041',
      establishedYear: 1980,
      headquartersCity: 'Mumbai',
      websiteUrl: 'https://www.lodhagroup.com',
      totalProjects: 28,
      activeProjects: 18,
      completedProjects: 8,
      delayedProjects: 6,
      totalGrievances: 312,
      avgDelayMonths: 8.0,
      transparencyScore: 72.0,
      transparencyGrade: TransparencyGrade.B,
    },
    {
      slug: 'godrej-properties',
      name: 'Godrej Properties',
      legalEntityName: 'Godrej Properties Ltd',
      cinNumber: 'L74120MH1985PLC035308',
      establishedYear: 1990,
      headquartersCity: 'Mumbai',
      websiteUrl: 'https://www.godrejproperties.com',
      totalProjects: 18,
      activeProjects: 11,
      completedProjects: 6,
      delayedProjects: 3,
      totalGrievances: 128,
      avgDelayMonths: 4.0,
      transparencyScore: 84.0,
      transparencyGrade: TransparencyGrade.A,
    },
    {
      slug: 'oberoi-realty',
      name: 'Oberoi Realty',
      legalEntityName: 'Oberoi Realty Ltd',
      cinNumber: 'L45200MH1998PLC115447',
      establishedYear: 1983,
      headquartersCity: 'Mumbai',
      websiteUrl: 'https://www.oberoirealty.com',
      totalProjects: 12,
      activeProjects: 7,
      completedProjects: 4,
      delayedProjects: 2,
      totalGrievances: 89,
      avgDelayMonths: 3.0,
      transparencyScore: 88.0,
      transparencyGrade: TransparencyGrade.A,
    },
    {
      slug: 'hiranandani-group',
      name: 'Hiranandani Group',
      legalEntityName: 'House of Hiranandani',
      cinNumber: null,
      establishedYear: 1978,
      headquartersCity: 'Mumbai',
      websiteUrl: 'https://www.hiranandani.com',
      totalProjects: 9,
      activeProjects: 5,
      completedProjects: 3,
      delayedProjects: 1,
      totalGrievances: 54,
      avgDelayMonths: 2.0,
      transparencyScore: 91.0,
      transparencyGrade: TransparencyGrade.A_PLUS,
    },
    {
      slug: 'lt-realty',
      name: 'L&T Realty',
      legalEntityName: 'L&T Realty Ltd',
      cinNumber: 'U45400MH2007PLC172725',
      establishedYear: 1994,
      headquartersCity: 'Mumbai',
      websiteUrl: 'https://www.ltrealty.com',
      totalProjects: 11,
      activeProjects: 7,
      completedProjects: 3,
      delayedProjects: 2,
      totalGrievances: 97,
      avgDelayMonths: 5.0,
      transparencyScore: 79.0,
      transparencyGrade: TransparencyGrade.B,
    },
    {
      slug: 'kalpataru-group',
      name: 'Kalpataru Group',
      legalEntityName: 'Kalpataru Ltd',
      cinNumber: 'L65990MH1969PLC014088',
      establishedYear: 1969,
      headquartersCity: 'Mumbai',
      websiteUrl: 'https://www.kalpataru.com',
      totalProjects: 14,
      activeProjects: 9,
      completedProjects: 4,
      delayedProjects: 4,
      totalGrievances: 203,
      avgDelayMonths: 11.0,
      transparencyScore: 65.0,
      transparencyGrade: TransparencyGrade.B,
    },
    {
      slug: 'rustomjee',
      name: 'Rustomjee',
      legalEntityName: 'Keystone Realtors Ltd',
      cinNumber: 'U70102MH1995PLC091798',
      establishedYear: 1995,
      headquartersCity: 'Mumbai',
      websiteUrl: 'https://www.rustomjee.com',
      totalProjects: 11,
      activeProjects: 7,
      completedProjects: 3,
      delayedProjects: 3,
      totalGrievances: 178,
      avgDelayMonths: 9.0,
      transparencyScore: 68.0,
      transparencyGrade: TransparencyGrade.B,
    },
    {
      slug: 'mahindra-lifespaces',
      name: 'Mahindra Lifespaces',
      legalEntityName: 'Mahindra Lifespace Developers Ltd',
      cinNumber: 'L45200MH1999PLC118949',
      establishedYear: 1994,
      headquartersCity: 'Mumbai',
      websiteUrl: 'https://www.mahindralifespaces.com',
      totalProjects: 9,
      activeProjects: 5,
      completedProjects: 3,
      delayedProjects: 1,
      totalGrievances: 62,
      avgDelayMonths: 3.5,
      transparencyScore: 85.0,
      transparencyGrade: TransparencyGrade.A,
    },
    {
      slug: 'piramal-realty',
      name: 'Piramal Realty',
      legalEntityName: 'Piramal Realty Pvt Ltd',
      cinNumber: null,
      establishedYear: 2012,
      headquartersCity: 'Mumbai',
      websiteUrl: 'https://www.piramalrealty.com',
      totalProjects: 8,
      activeProjects: 5,
      completedProjects: 2,
      delayedProjects: 2,
      totalGrievances: 91,
      avgDelayMonths: 6.0,
      transparencyScore: 74.0,
      transparencyGrade: TransparencyGrade.B,
    },
    {
      slug: 'runwal-group',
      name: 'Runwal Group',
      legalEntityName: 'Runwal Developers Pvt Ltd',
      cinNumber: null,
      establishedYear: 1978,
      headquartersCity: 'Mumbai',
      websiteUrl: 'https://www.runwal.com',
      totalProjects: 13,
      activeProjects: 8,
      completedProjects: 4,
      delayedProjects: 3,
      totalGrievances: 167,
      avgDelayMonths: 7.5,
      transparencyScore: 70.0,
      transparencyGrade: TransparencyGrade.B,
    },
  ]

  const builders: Record<string, any> = {}

  for (const b of buildersData) {
    const builder = await prisma.builder.upsert({
      where: { slug: b.slug },
      update: { transparencyScore: b.transparencyScore, transparencyGrade: b.transparencyGrade },
      create: { ...b, scoreLastComputedAt: new Date() },
    })
    builders[b.slug] = builder
    console.log(`✅ Builder: ${builder.name} (${builder.transparencyGrade})`)
  }

  // ─── 3. Sample Projects ─────────────────────────────────────────────────────
  const lodhaBuilder = builders['lodha-group']
  const rustomjeeBuilder = builders['rustomjee']
  const kalpataruBuilder = builders['kalpataru-group']

  const project1 = await prisma.project.upsert({
    where: { reraNumber: 'P51900000001' },
    update: {},
    create: {
      slug: 'lodha-palava-city',
      builderId: lodhaBuilder.id,
      name: 'Lodha Palava City',
      reraNumber: 'P51900000001',
      status: ProjectStatus.DELAYED,
      locality: 'Dombivali',
      subLocality: 'Palava Phase 2',
      city: 'Thane',
      pincode: '421204',
      latitude: 19.2253,
      longitude: 73.0897,
      totalUnits: 2400,
      completedUnits: 1800,
      totalTowers: 12,
      floorsPerTower: 32,
      amenities: ['Swimming Pool', 'Gymnasium', 'Clubhouse', 'Jogging Track', 'Children Play Area', 'Indoor Games'],
      nearbyLandmarks: ['Dombivali Station (8km)', 'Kalyan Station (12km)', 'Palava Lake'],
      reraRegistrationDate: new Date('2019-06-15'),
      reraExpiryDate: new Date('2024-12-31'),
      revisedCompletionDate: new Date('2026-06-30'),
      approxPricePerSqFt: 6800,
      priceRangeLow: 75,
      priceRangeHigh: 145,
      delayMonths: 17,
      totalGrievances: 89,
      openGrievances: 42,
      verifiedBuyerCount: 134,
      transparencyScore: 68.0,
      isPublished: true,
    },
  })

  const project2 = await prisma.project.upsert({
    where: { reraNumber: 'P51900000002' },
    update: {},
    create: {
      slug: 'rustomjee-elements',
      builderId: rustomjeeBuilder.id,
      name: 'Rustomjee Elements',
      reraNumber: 'P51900000002',
      status: ProjectStatus.DELAYED,
      locality: 'Thane West',
      subLocality: 'Ghodbunder Road',
      city: 'Thane',
      pincode: '400615',
      latitude: 19.2665,
      longitude: 72.9780,
      totalUnits: 640,
      completedUnits: 420,
      totalTowers: 4,
      floorsPerTower: 28,
      amenities: ['Swimming Pool', 'Gymnasium', 'Clubhouse', 'Terrace Garden'],
      nearbyLandmarks: ['Thane Station (6km)', 'Viviana Mall (4km)', 'Eastern Express Highway'],
      reraRegistrationDate: new Date('2018-03-20'),
      reraExpiryDate: new Date('2022-12-31'),
      revisedCompletionDate: new Date('2025-12-31'),
      approxPricePerSqFt: 10500,
      priceRangeLow: 95,
      priceRangeHigh: 185,
      delayMonths: 28,
      totalGrievances: 67,
      openGrievances: 31,
      verifiedBuyerCount: 87,
      transparencyScore: 55.0,
      isPublished: true,
    },
  })

  const project3 = await prisma.project.upsert({
    where: { reraNumber: 'P51900000003' },
    update: {},
    create: {
      slug: 'kalpataru-summit',
      builderId: kalpataruBuilder.id,
      name: 'Kalpataru Summit',
      reraNumber: 'P51900000003',
      status: ProjectStatus.UNDER_CONSTRUCTION,
      locality: 'Mulund West',
      subLocality: 'LBS Road',
      city: 'Mumbai',
      pincode: '400080',
      latitude: 19.1700,
      longitude: 72.9500,
      totalUnits: 320,
      completedUnits: 110,
      totalTowers: 2,
      floorsPerTower: 30,
      amenities: ['Swimming Pool', 'Gymnasium', 'Sky Lounge', 'Children Play Area'],
      nearbyLandmarks: ['Mulund Station (1.5km)', 'R-Mall (3km)', 'Eastern Express Highway'],
      reraRegistrationDate: new Date('2022-01-10'),
      reraExpiryDate: new Date('2027-03-31'),
      approxPricePerSqFt: 14000,
      priceRangeLow: 165,
      priceRangeHigh: 280,
      delayMonths: 0,
      totalGrievances: 12,
      openGrievances: 5,
      verifiedBuyerCount: 34,
      transparencyScore: 81.0,
      isPublished: true,
    },
  })

  console.log(`✅ Projects seeded: ${[project1, project2, project3].map(p => p.name).join(', ')}`)

  // ─── 4. RERA Records ────────────────────────────────────────────────────────
  await prisma.reraRecord.upsert({
    where: { projectId_reraNumber: { projectId: project1.id, reraNumber: 'P51900000001' } },
    update: {},
    create: {
      projectId: project1.id,
      reraNumber: 'P51900000001',
      status: RERARecordStatus.EXTENDED,
      registrationDate: new Date('2019-06-15'),
      originalExpiryDate: new Date('2024-12-31'),
      currentExpiryDate: new Date('2026-06-30'),
      promoterName: 'Macrotech Developers Ltd',
      worksDonePercentage: 74.0,
      carpetAreaSold: 82.0,
      extensionGranted: true,
      extensionReason: 'COVID-19 pandemic + supply chain disruption',
      lastSyncedAt: new Date(),
      syncedByAdminId: admin.id,
    },
  })

  // ─── 5. Red Flags ────────────────────────────────────────────────────────────
  await prisma.projectRedFlag.upsert({
    where: { id: 'seed-redflag-001' },
    update: {},
    create: {
      id: 'seed-redflag-001',
      projectId: project1.id,
      flagType: 'rera_extended',
      severity: 'WARNING',
      title: 'RERA Extension Obtained — Revised Deadline Jun 2026',
      description: 'The builder has obtained a RERA extension. Original completion was Dec 2024. Revised deadline is Jun 2026 — 18 months later.',
      isActive: true,
    },
  })

  await prisma.projectRedFlag.upsert({
    where: { id: 'seed-redflag-002' },
    update: {},
    create: {
      id: 'seed-redflag-002',
      projectId: project2.id,
      flagType: 'oc_delayed',
      severity: 'CRITICAL',
      title: 'Occupancy Certificate Not Obtained — 28 Months Post Deadline',
      description: 'RERA expiry was Dec 2022. As of today, no OC has been obtained. Buyers cannot register their flats without OC.',
      isActive: true,
    },
  })

  console.log('✅ Red flags seeded')

  // ─── 6. Community Groups + Threads ─────────────────────────────────────────
  const communityGroup = await prisma.communityGroup.upsert({
    where: { projectId: project1.id },
    update: {},
    create: {
      projectId: project1.id,
      name: 'Lodha Palava City — Residents Community',
      hasWhatsAppGroup: true,
      whatsAppAdminNote: 'Click "Request to Join" below. A platform admin will connect you via your registered mobile number within 24 hours.',
      memberCount: 134,
    },
  })

  // Sample buyer user for threads
  const buyerUser = await prisma.user.upsert({
    where: { phone: '+919876543210' },
    update: {},
    create: {
      phone: '+919876543210',
      phoneVerified: true,
      role: UserRole.BUYER,
      buyerProfile: {
        create: {
          displayName: 'Rahul M.',
          verificationStatus: 'VERIFIED_OWNER',
        },
      },
    },
    include: { buyerProfile: true },
  })

  await prisma.thread.upsert({
    where: { id: 'seed-thread-001' },
    update: {},
    create: {
      id: 'seed-thread-001',
      communityGroupId: communityGroup.id,
      authorId: buyerUser.id,
      title: 'Anyone got possession update for Tower B?',
      body: 'Hi all, I booked a 3BHK in Tower B back in 2021. The original possession date was Dec 2024. Its now May 2025 and the builder hasnt given any update. Has anyone received an update from the site manager? Please share what you know.',
      isPinned: false,
      isLocked: false,
      replyCount: 12,
      upvoteCount: 45,
      isVerifiedBuyer: true,
      isAnonymous: false,
      isVisible: true,
      createdAt: new Date('2025-04-20T10:30:00Z'),
    },
  })

  await prisma.thread.upsert({
    where: { id: 'seed-thread-002' },
    update: {},
    create: {
      id: 'seed-thread-002',
      communityGroupId: communityGroup.id,
      authorId: buyerUser.id,
      title: '📌 WELCOME — How to use this community forum',
      body: '# Welcome to the Lodha Palava City Buyer Community\n\nThis is a space for verified buyers to share updates, raise concerns, and support each other.\n\n**Rules:**\n- Be factual and respectful\n- Share site visit observations\n- No personal attacks\n\nUse the "File a Grievance" button to formally log complaints.',
      isPinned: true,
      isLocked: false,
      replyCount: 2,
      upvoteCount: 67,
      isVerifiedBuyer: true,
      isAnonymous: false,
      isVisible: true,
      createdAt: new Date('2025-01-01T09:00:00Z'),
    },
  })

  console.log('✅ Community groups and threads seeded')

  // ─── 7. Sample Grievances ───────────────────────────────────────────────────
  await prisma.grievance.upsert({
    where: { id: 'seed-grievance-001' },
    update: {},
    create: {
      id: 'seed-grievance-001',
      projectId: project1.id,
      userId: buyerUser.id,
      category: GrievanceCategory.POSSESSION_DELAY,
      severity: GrievanceSeverity.HIGH,
      status: GrievanceStatus.ACKNOWLEDGED,
      title: 'Possession delayed 17 months, no communication from builder',
      description: 'Agreement states possession by December 2024. It is now May 2025 and the builder has not communicated any timeline update. Multiple emails have gone unanswered. Demand letters continue to be sent despite no possession.',
      isAnonymous: false,
      isVerifiedBuyer: true,
      upvoteCount: 23,
      isPubliclyVisible: true,
      adminNotes: 'Contacted builder representative on 27 April 2025. Follow-up scheduled.',
    },
  })

  await prisma.grievance.upsert({
    where: { id: 'seed-grievance-002' },
    update: {},
    create: {
      id: 'seed-grievance-002',
      projectId: project2.id,
      userId: buyerUser.id,
      category: GrievanceCategory.OC_CERTIFICATE_DELAY,
      severity: GrievanceSeverity.CRITICAL,
      status: GrievanceStatus.ESCALATED,
      title: 'OC not obtained despite 2-year delay — unable to register flat',
      description: 'Builder handed over possession in 2023 without OC. Banks are refusing to release home loan balance. Cannot register flat. RERA deadline was Dec 2022.',
      isAnonymous: false,
      isVerifiedBuyer: true,
      upvoteCount: 41,
      isPubliclyVisible: true,
      escalatedTo: 'RERA Maharashtra',
      escalatedAt: new Date('2025-03-15'),
    },
  })

  console.log('✅ Grievances seeded')

  // ─── 8. Legal Resources ──────────────────────────────────────────────────────
  const legalArticles = [
    {
      id: 'seed-legal-001',
      slug: 'how-to-file-rera-complaint-maharashtra',
      title: 'How to File a RERA Complaint in Maharashtra',
      summary: 'Step-by-step guide to filing a complaint with MahaRERA against a builder for possession delay, construction defects, or other violations.',
      category: LegalResourceCategory.RERA_RIGHTS,
      body: '## Overview\n\nMahaRERA (Maharashtra Real Estate Regulatory Authority) provides a legal mechanism for homebuyers to file complaints against builders...',
      readingTimeMinutes: 8,
      reviewedBy: 'Advocate Sunita Sharma, RERA Specialist',
      isPublished: true,
    },
    {
      id: 'seed-legal-002',
      slug: 'rera-section-18-refund-interest',
      title: 'RERA Section 18: Your Right to Refund or Interest on Delay',
      summary: 'Understanding Section 18 of RERA — when you can claim a refund or monthly interest for possession delay.',
      category: LegalResourceCategory.RERA_RIGHTS,
      body: '## What is Section 18?\n\nSection 18 of the Real Estate (Regulation and Development) Act, 2016 gives buyers the right to...',
      readingTimeMinutes: 6,
      reviewedBy: 'Advocate Ravi Desai, Property Law',
      isPublished: true,
    },
    {
      id: 'seed-legal-003',
      slug: 'consumer-forum-vs-rera-when-to-choose',
      title: 'Consumer Forum vs RERA — Which Forum Should You Choose?',
      summary: 'A plain-language comparison of when to go to RERA and when the Consumer Forum is a better choice.',
      category: LegalResourceCategory.CONSUMER_FORUM,
      body: '## Key Differences\n\n| Factor | RERA | Consumer Forum |\n|---|---|---|\n| Jurisdiction | Property disputes only | All consumer goods/services |\n...',
      readingTimeMinutes: 7,
      reviewedBy: 'Advocate Priya Nair, Consumer Law',
      isPublished: true,
    },
    {
      id: 'seed-legal-004',
      slug: 'glossary-real-estate-terms',
      title: 'Real Estate Glossary: OC, CC, IOD, BCC — Explained',
      summary: 'Plain-English definitions of the most confusing real estate and RERA terms that every homebuyer should know.',
      category: LegalResourceCategory.GLOSSARY,
      body: '## IOD — Intimation of Disapproval\n\nDespite the confusing name, IOD is actually the first approval a builder receives...',
      readingTimeMinutes: 5,
      reviewedBy: 'REwebPortal Editorial Team',
      isPublished: true,
    },
  ]

  for (const article of legalArticles) {
    await prisma.legalResource.upsert({
      where: { id: article.id },
      update: {},
      create: {
        ...article,
        publishedAt: new Date('2025-03-01'),
        updatedAt: new Date(),
      },
    })
  }

  console.log(`✅ Legal articles seeded: ${legalArticles.length}`)

  // ─── Done ────────────────────────────────────────────────────────────────────
  console.log('\n🎉 Seed complete!')
  console.log('   Admin login: admin@rewebportal.in / Admin@REwebPortal2025!')
  console.log('   Test buyer:  +919876543210 (use OTP flow in dev)')
  console.log('   Projects:    Lodha Palava City, Rustomjee Elements, Kalpataru Summit')
}

main()
  .catch((err) => {
    console.error('❌ Seed failed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
