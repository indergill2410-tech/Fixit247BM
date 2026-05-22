import { PrismaClient } from './generated/client';

const db = new PrismaClient();

// ─── Credit Packages ──────────────────────────────────────────────────────────

async function seedCreditPackages() {
  const packs = [
    { name: 'Starter Pack', credits: 10, bonusCredits: 0,  priceAud: 49,  isPopular: false, isActive: true, displayOrder: 1 },
    { name: 'Pro Pack',     credits: 22, bonusCredits: 2,  priceAud: 99,  isPopular: true,  isActive: true, displayOrder: 2 },
    { name: 'Elite Pack',   credits: 35, bonusCredits: 5,  priceAud: 149, isPopular: false, isActive: true, displayOrder: 3 },
  ];

  await db.creditPackage.updateMany({ where: {}, data: { isActive: false } });

  for (const pack of packs) {
    const existing = await db.creditPackage.findFirst({ where: { name: pack.name } });
    if (existing) {
      await db.creditPackage.update({ where: { id: existing.id }, data: pack });
    } else {
      await db.creditPackage.create({ data: pack });
    }
  }
  console.log('✅ Credit packages seeded');
}

// ─── Test Users ───────────────────────────────────────────────────────────────

const SUBURBS = [
  { suburb: 'Surry Hills', state: 'NSW', postcode: '2010' },
  { suburb: 'Fitzroy',     state: 'VIC', postcode: '3065' },
  { suburb: 'Fortitude Valley', state: 'QLD', postcode: '4006' },
  { suburb: 'Fremantle',   state: 'WA',  postcode: '6160' },
  { suburb: 'Glenelg',     state: 'SA',  postcode: '5045' },
];

async function seedTestUsers() {
  // 5 test customers
  const customers = [
    { firstName: 'Alice', lastName: 'Chen',    email: 'test-customer-1@fixit247.dev', phone: '+61411000001' },
    { firstName: 'Bob',   lastName: 'Smith',   email: 'test-customer-2@fixit247.dev', phone: '+61411000002' },
    { firstName: 'Carol', lastName: 'Jones',   email: 'test-customer-3@fixit247.dev', phone: '+61411000003' },
    { firstName: 'Dave',  lastName: 'Wilson',  email: 'test-customer-4@fixit247.dev', phone: '+61411000004' },
    { firstName: 'Emma',  lastName: 'Taylor',  email: 'test-customer-5@fixit247.dev', phone: '+61411000005' },
  ];

  const customerProfiles = [];
  for (const [i, c] of customers.entries()) {
    const user = await db.user.upsert({
      where: { email: c.email },
      create: { email: c.email, firstName: c.firstName, lastName: c.lastName, phone: c.phone, role: 'CUSTOMER', isActive: true, emailVerified: new Date() },
      update: { isActive: true },
    });
    const suburb = SUBURBS[i % SUBURBS.length]!;
    const existingAddress = await db.address.findFirst({ where: { userId: user.id } });
    const address = existingAddress ?? await db.address.create({
      data: { userId: user.id, street: `${10 + i} Test St`, suburb: suburb.suburb, city: suburb.suburb, state: suburb.state, postcode: suburb.postcode, country: 'AU' },
    });
    const profile = await db.customerProfile.upsert({
      where: { userId: user.id },
      create: { userId: user.id, defaultAddressId: address.id },
      update: {},
    });
    customerProfiles.push({ user, profile });
  }

  // 10 test tradies
  const tradies = [
    { firstName: 'Jack',   lastName: 'Brown',    email: 'test-tradie-1@fixit247.dev',  phone: '+61422000001', trade: 'PLUMBING' },
    { firstName: 'Sarah',  lastName: 'Davis',    email: 'test-tradie-2@fixit247.dev',  phone: '+61422000002', trade: 'ELECTRICAL' },
    { firstName: 'Mike',   lastName: 'Wilson',   email: 'test-tradie-3@fixit247.dev',  phone: '+61422000003', trade: 'LOCKSMITH' },
    { firstName: 'Lisa',   lastName: 'Anderson', email: 'test-tradie-4@fixit247.dev',  phone: '+61422000004', trade: 'HVAC' },
    { firstName: 'Tom',    lastName: 'Martin',   email: 'test-tradie-5@fixit247.dev',  phone: '+61422000005', trade: 'ROOFING' },
    { firstName: 'Grace',  lastName: 'Lee',      email: 'test-tradie-6@fixit247.dev',  phone: '+61422000006', trade: 'PLUMBING' },
    { firstName: 'Harry',  lastName: 'Clark',    email: 'test-tradie-7@fixit247.dev',  phone: '+61422000007', trade: 'ELECTRICAL' },
    { firstName: 'Irene',  lastName: 'Walker',   email: 'test-tradie-8@fixit247.dev',  phone: '+61422000008', trade: 'CARPENTRY' },
    { firstName: 'James',  lastName: 'Hall',     email: 'test-tradie-9@fixit247.dev',  phone: '+61422000009', trade: 'PLASTERING' },
    { firstName: 'Karen',  lastName: 'Young',    email: 'test-tradie-10@fixit247.dev', phone: '+61422000010', trade: 'PEST_CONTROL' },
  ];

  const tradieProfiles = [];
  for (const [i, t] of tradies.entries()) {
    const user = await db.user.upsert({
      where: { email: t.email },
      create: { email: t.email, firstName: t.firstName, lastName: t.lastName, phone: t.phone, role: 'TRADIE', isActive: true, emailVerified: new Date() },
      update: { isActive: true },
    });
    const profile = await db.tradieProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        businessName: `${t.firstName}'s ${t.trade.replace(/_/g, ' ')} Services`,
        abn: `${10000000000 + i * 11111111}`,
        trades: [t.trade as never],
        serviceRadiusKm: 25,
        isAvailable: true,
        isEmergencyAvailable: i % 3 === 0,
        verificationStatus: 'VERIFIED',
        onboardingStatus: 'APPROVED',
        onboardingStep: 5,
        avgRating: 4.2 + (i % 8) * 0.1,
        totalReviews: 5 + i * 3,
        rankScore: 50 + i * 3,
      },
      update: { isAvailable: true },
    });
    // Give wallet
    await db.creditsWallet.upsert({
      where: { userId: user.id },
      create: { userId: user.id, balance: 10 + i * 5, lifetimeEarned: 20 + i * 5, lifetimeSpent: 10 },
      update: {},
    });
    tradieProfiles.push({ user, profile });
  }

  console.log(`✅ ${customers.length} test customers + ${tradies.length} test tradies seeded`);
  return { customerProfiles, tradieProfiles };
}

// ─── Test Jobs ────────────────────────────────────────────────────────────────

async function seedTestJobs(customerProfiles: Awaited<ReturnType<typeof seedTestUsers>>['customerProfiles'], tradieProfiles: Awaited<ReturnType<typeof seedTestUsers>>['tradieProfiles']) {
  const jobTemplates = [
    { title: 'Burst pipe in bathroom — urgent', category: 'PLUMBING', status: 'OPEN', priority: 'EMERGENCY', isEmergency: true },
    { title: 'Power outage in kitchen', category: 'ELECTRICAL', status: 'OPEN', priority: 'URGENT', isEmergency: false },
    { title: 'Locked out of house', category: 'LOCKSMITH', status: 'CLAIMED', priority: 'URGENT', isEmergency: false },
    { title: 'AC not cooling — heat advisory', category: 'HVAC', status: 'IN_PROGRESS', priority: 'URGENT', isEmergency: false },
    { title: 'Roof leak after storm', category: 'ROOFING', status: 'COMPLETED', priority: 'EMERGENCY', isEmergency: true },
    { title: 'Blocked drain in laundry', category: 'PLUMBING', status: 'OPEN', priority: 'STANDARD', isEmergency: false },
    { title: 'Sparking powerpoint', category: 'ELECTRICAL', status: 'CLAIMED', priority: 'EMERGENCY', isEmergency: true },
    { title: 'Deadbolt replacement', category: 'LOCKSMITH', status: 'COMPLETED', priority: 'STANDARD', isEmergency: false },
    { title: 'Hot water system replacement', category: 'PLUMBING', status: 'OPEN', priority: 'URGENT', isEmergency: false },
    { title: 'Ceiling fan installation', category: 'ELECTRICAL', status: 'OPEN', priority: 'STANDARD', isEmergency: false },
    { title: 'Pest inspection — termites suspected', category: 'PEST_CONTROL', status: 'OPEN', priority: 'URGENT', isEmergency: false },
    { title: 'Wardrobe door repair', category: 'CARPENTRY', status: 'OPEN', priority: 'STANDARD', isEmergency: false },
    { title: 'Ceiling crack repair', category: 'PLASTERING', status: 'CLAIMED', priority: 'STANDARD', isEmergency: false },
    { title: 'Gas leak — immediate response', category: 'PLUMBING', status: 'COMPLETED', priority: 'EMERGENCY', isEmergency: true },
    { title: 'Circuit breaker keeps tripping', category: 'ELECTRICAL', status: 'IN_PROGRESS', priority: 'URGENT', isEmergency: false },
    { title: 'Split system not heating', category: 'HVAC', status: 'OPEN', priority: 'STANDARD', isEmergency: false },
    { title: 'Front door lock broken', category: 'LOCKSMITH', status: 'OPEN', priority: 'URGENT', isEmergency: false },
    { title: 'Solar panel inspection', category: 'ELECTRICAL', status: 'OPEN', priority: 'STANDARD', isEmergency: false },
    { title: 'Skylight leaking in bedroom', category: 'ROOFING', status: 'OPEN', priority: 'URGENT', isEmergency: false },
    { title: 'Shower regrouting needed', category: 'PLUMBING', status: 'COMPLETED', priority: 'STANDARD', isEmergency: false },
  ];

  let created = 0;
  for (const [i, tmpl] of jobTemplates.entries()) {
    const customer = customerProfiles[i % customerProfiles.length]!;
    const address = await db.address.findFirst({ where: { userId: customer.user.id } });

    const jobBase = {
      title: tmpl.title,
      description: `Test job: ${tmpl.title}. Created by seed script for development testing.`,
      category: tmpl.category as never,
      status: tmpl.status as never,
      priority: tmpl.priority as never,
      isEmergency: tmpl.isEmergency,
      complexity: 'MEDIUM' as never,
      customerId: customer.profile.id,
    };
    const jobExtras = {
      ...(address?.id && { addressId: address.id }),
      ...(tmpl.status !== 'OPEN' && { tradieId: tradieProfiles[i % tradieProfiles.length]!.profile.id }),
      ...(tmpl.status === 'COMPLETED' && { completedAt: new Date(Date.now() - i * 86400000) }),
      ...(tmpl.status === 'CLAIMED' && { claimedAt: new Date(Date.now() - i * 3600000) }),
    };
    const job = await db.job.create({ data: { ...jobBase, ...jobExtras } as never });

    // Add payment for completed jobs
    if (tmpl.status === 'COMPLETED') {
      const tradie = tradieProfiles[i % tradieProfiles.length]!;
      await db.payment.upsert({
        where: { jobId: job.id },
        create: {
          jobId: job.id,
          customerId: customer.profile.id,
          tradieId: tradie.profile.id,
          amount: 150 + i * 25,
          platformFee: 15 + i * 2,
          tradieAmount: 135 + i * 23,
          status: 'RELEASED',
          paidAt: new Date(Date.now() - i * 86400000 + 3600000),
          releasedAt: new Date(Date.now() - i * 86400000 + 7200000),
        },
        update: {},
      });
    }

    created++;
  }

  console.log(`✅ ${created} test jobs seeded`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  await seedCreditPackages();

  // Only seed test users/jobs in non-production environments
  if (process.env.NODE_ENV !== 'production') {
    const { customerProfiles, tradieProfiles } = await seedTestUsers();
    await seedTestJobs(customerProfiles, tradieProfiles);
  }

  console.log('✅ Seed complete');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
