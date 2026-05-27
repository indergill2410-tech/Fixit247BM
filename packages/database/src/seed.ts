import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from './generated/client';

const db = new PrismaClient();

// ─── Supabase admin client (service role) ─────────────────────────────────────

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

// ─── Coordinates for Australian suburbs ──────────────────────────────────────

const SUBURBS = [
  { suburb: 'Surry Hills',      state: 'NSW', postcode: '2010', lat: -33.8890, lng: 151.2113 },
  { suburb: 'Fitzroy',          state: 'VIC', postcode: '3065', lat: -37.7997, lng: 144.9789 },
  { suburb: 'Fortitude Valley', state: 'QLD', postcode: '4006', lat: -27.4562, lng: 153.0321 },
  { suburb: 'Fremantle',        state: 'WA',  postcode: '6160', lat: -32.0569, lng: 115.7439 },
  { suburb: 'Glenelg',          state: 'SA',  postcode: '5045', lat: -34.9834, lng: 138.5167 },
];

// Tradie coordinates — slightly offset from customer suburbs to simulate realistic distances
const TRADIE_COORDS = [
  { lat: -33.8750, lng: 151.2050 }, // ~1.6km from Surry Hills
  { lat: -33.8700, lng: 151.2200 },
  { lat: -37.8100, lng: 144.9600 }, // ~2km from Fitzroy
  { lat: -37.8050, lng: 144.9900 },
  { lat: -27.4700, lng: 153.0200 }, // ~2km from Fortitude Valley
  { lat: -27.4450, lng: 153.0400 },
  { lat: -32.0650, lng: 115.7300 }, // ~2km from Fremantle
  { lat: -32.0450, lng: 115.7550 },
  { lat: -34.9700, lng: 138.5050 }, // ~2km from Glenelg
  { lat: -34.9900, lng: 138.5300 },
];

// ─── Test credentials ─────────────────────────────────────────────────────────

const TEST_PASSWORD = process.env.SEED_TEST_PASSWORD ?? 'Fixit247!Test';

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

// ─── Ensure Supabase auth user exists ────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function ensureAuthUser(
  admin: any,
  email: string,
  meta: Record<string, unknown>,
): Promise<string | null> {
  if (!admin) return null;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const { data: listData } = await admin.auth.admin.listUsers({ perPage: 1000 });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const existing = listData?.users?.find((u: { email: string }) => u.email === email) as { id: string } | undefined;
  if (existing) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    await admin.auth.admin.updateUserById(existing.id, { password: TEST_PASSWORD });
    return existing.id;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: TEST_PASSWORD,
    email_confirm: true,
    user_metadata: meta,
  });

  if (error) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.warn(`  ⚠ Could not create auth user for ${email}: ${(error as { message: string }).message}`);
    return null;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return (data as { user?: { id: string } }).user?.id ?? null;
}

// ─── Test Users ───────────────────────────────────────────────────────────────

async function seedTestUsers() {
  const admin = getSupabaseAdmin();

  const customers = [
    { firstName: 'Alice', lastName: 'Chen',   email: 'test-customer-1@fixit247.dev', phone: '+61411000001' },
    { firstName: 'Bob',   lastName: 'Smith',  email: 'test-customer-2@fixit247.dev', phone: '+61411000002' },
    { firstName: 'Carol', lastName: 'Jones',  email: 'test-customer-3@fixit247.dev', phone: '+61411000003' },
    { firstName: 'Dave',  lastName: 'Wilson', email: 'test-customer-4@fixit247.dev', phone: '+61411000004' },
    { firstName: 'Emma',  lastName: 'Taylor', email: 'test-customer-5@fixit247.dev', phone: '+61411000005' },
  ];

  const customerProfiles = [];
  for (const [i, c] of customers.entries()) {
    const authId = await ensureAuthUser(admin, c.email, {
      firstName: c.firstName, lastName: c.lastName, role: 'CUSTOMER', onboardingComplete: true,
    });

    const user = await db.user.upsert({
      where: { email: c.email },
      create: {
        ...(authId ? { id: authId } : {}),
        email: c.email, firstName: c.firstName, lastName: c.lastName,
        phone: c.phone, role: 'CUSTOMER', isActive: true, emailVerified: new Date(),
      },
      update: { isActive: true, firstName: c.firstName, lastName: c.lastName },
    });

    const suburb = SUBURBS[i % SUBURBS.length];
    if (!suburb) throw new Error(`SUBURBS has no entry at index ${i % SUBURBS.length}`);

    const existingAddress = await db.address.findFirst({ where: { userId: user.id } });
    const address = existingAddress
      ? await db.address.update({
          where: { id: existingAddress.id },
          data: { latitude: suburb.lat, longitude: suburb.lng, isDefault: true },
        })
      : await db.address.create({
          data: {
            userId: user.id,
            street: `${10 + i} Test St`,
            suburb: suburb.suburb,
            city: suburb.suburb,
            state: suburb.state,
            postcode: suburb.postcode,
            country: 'AU',
            latitude: suburb.lat,
            longitude: suburb.lng,
            isDefault: true,
          },
        });

    const profile = await db.customerProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        defaultAddressId: address.id,
        suburb: suburb.suburb,
        postcode: suburb.postcode,
        state: suburb.state,
      },
      update: { defaultAddressId: address.id },
    });

    await db.address.update({
      where: { id: address.id },
      data: { customerProfileId: profile.id },
    });

    customerProfiles.push({ user, profile, address });
  }

  const tradies = [
    { firstName: 'Jack',  lastName: 'Brown',    email: 'test-tradie-1@fixit247.dev',  phone: '+61422000001', trade: 'PLUMBING' },
    { firstName: 'Sarah', lastName: 'Davis',    email: 'test-tradie-2@fixit247.dev',  phone: '+61422000002', trade: 'ELECTRICAL' },
    { firstName: 'Mike',  lastName: 'Wilson',   email: 'test-tradie-3@fixit247.dev',  phone: '+61422000003', trade: 'LOCKSMITH' },
    { firstName: 'Lisa',  lastName: 'Anderson', email: 'test-tradie-4@fixit247.dev',  phone: '+61422000004', trade: 'HVAC' },
    { firstName: 'Tom',   lastName: 'Martin',   email: 'test-tradie-5@fixit247.dev',  phone: '+61422000005', trade: 'ROOFING' },
    { firstName: 'Grace', lastName: 'Lee',      email: 'test-tradie-6@fixit247.dev',  phone: '+61422000006', trade: 'PLUMBING' },
    { firstName: 'Harry', lastName: 'Clark',    email: 'test-tradie-7@fixit247.dev',  phone: '+61422000007', trade: 'ELECTRICAL' },
    { firstName: 'Irene', lastName: 'Walker',   email: 'test-tradie-8@fixit247.dev',  phone: '+61422000008', trade: 'CARPENTRY' },
    { firstName: 'James', lastName: 'Hall',     email: 'test-tradie-9@fixit247.dev',  phone: '+61422000009', trade: 'PLASTERING' },
    { firstName: 'Karen', lastName: 'Young',    email: 'test-tradie-10@fixit247.dev', phone: '+61422000010', trade: 'PEST_CONTROL' },
  ];

  const tradieProfiles = [];
  for (const [i, t] of tradies.entries()) {
    const authId = await ensureAuthUser(admin, t.email, {
      firstName: t.firstName, lastName: t.lastName, role: 'TRADIE', onboardingComplete: true,
    });

    const user = await db.user.upsert({
      where: { email: t.email },
      create: {
        ...(authId ? { id: authId } : {}),
        email: t.email, firstName: t.firstName, lastName: t.lastName,
        phone: t.phone, role: 'TRADIE', isActive: true, emailVerified: new Date(),
      },
      update: { isActive: true, firstName: t.firstName, lastName: t.lastName },
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
      update: { isAvailable: true, verificationStatus: 'VERIFIED', onboardingStatus: 'APPROVED' },
    });

    await db.creditsWallet.upsert({
      where: { userId: user.id },
      create: { userId: user.id, balance: 10 + i * 5, lifetimeEarned: 20 + i * 5, lifetimeSpent: 10 },
      update: {},
    });

    // Realtime status with realistic Australian coordinates — required for matching engine
    const coords = TRADIE_COORDS[i % TRADIE_COORDS.length];
    if (!coords) throw new Error(`TRADIE_COORDS has no entry at index ${i % TRADIE_COORDS.length}`);

    await db.tradieRealtimeStatus.upsert({
      where: { tradieId: profile.id },
      create: {
        tradieId: profile.id,
        onlineStatus: 'ONLINE',
        currentLatitude: coords.lat,
        currentLongitude: coords.lng,
        activeJobCount: 0,
        travelRadiusKm: 25,
        lastHeartbeatAt: new Date(),
      },
      update: {
        onlineStatus: 'ONLINE',
        currentLatitude: coords.lat,
        currentLongitude: coords.lng,
        activeJobCount: 0,
        lastHeartbeatAt: new Date(),
      },
    });

    tradieProfiles.push({ user, profile });
  }

  console.log(`✅ ${customers.length} test customers + ${tradies.length} test tradies seeded`);
  if (admin) {
    console.log(`   Login password : ${TEST_PASSWORD}`);
    console.log(`   Customers      : test-customer-{1-5}@fixit247.dev`);
    console.log(`   Tradies        : test-tradie-{1-10}@fixit247.dev`);
  } else {
    console.log('⚠  Supabase auth skipped (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set)');
  }

  return { customerProfiles, tradieProfiles };
}

// ─── Test Jobs ────────────────────────────────────────────────────────────────

async function seedTestJobs(
  customerProfiles: Awaited<ReturnType<typeof seedTestUsers>>['customerProfiles'],
  tradieProfiles: Awaited<ReturnType<typeof seedTestUsers>>['tradieProfiles'],
) {
  const jobTemplates = [
    { title: 'Burst pipe in bathroom — urgent',  category: 'PLUMBING',     status: 'OPEN',        priority: 'EMERGENCY', isEmergency: true },
    { title: 'Power outage in kitchen',           category: 'ELECTRICAL',   status: 'OPEN',        priority: 'URGENT',    isEmergency: false },
    { title: 'Locked out of house',               category: 'LOCKSMITH',    status: 'CLAIMED',     priority: 'URGENT',    isEmergency: false },
    { title: 'AC not cooling — heat advisory',    category: 'HVAC',         status: 'IN_PROGRESS', priority: 'URGENT',    isEmergency: false },
    { title: 'Roof leak after storm',             category: 'ROOFING',      status: 'COMPLETED',   priority: 'EMERGENCY', isEmergency: true },
    { title: 'Blocked drain in laundry',          category: 'PLUMBING',     status: 'OPEN',        priority: 'STANDARD',  isEmergency: false },
    { title: 'Sparking powerpoint',               category: 'ELECTRICAL',   status: 'CLAIMED',     priority: 'EMERGENCY', isEmergency: true },
    { title: 'Deadbolt replacement',              category: 'LOCKSMITH',    status: 'COMPLETED',   priority: 'STANDARD',  isEmergency: false },
    { title: 'Hot water system replacement',      category: 'PLUMBING',     status: 'OPEN',        priority: 'URGENT',    isEmergency: false },
    { title: 'Ceiling fan installation',          category: 'ELECTRICAL',   status: 'OPEN',        priority: 'STANDARD',  isEmergency: false },
    { title: 'Pest inspection — termites',        category: 'PEST_CONTROL', status: 'OPEN',        priority: 'URGENT',    isEmergency: false },
    { title: 'Wardrobe door repair',              category: 'CARPENTRY',    status: 'OPEN',        priority: 'STANDARD',  isEmergency: false },
    { title: 'Ceiling crack repair',              category: 'PLASTERING',   status: 'CLAIMED',     priority: 'STANDARD',  isEmergency: false },
    { title: 'Gas leak — immediate response',     category: 'PLUMBING',     status: 'COMPLETED',   priority: 'EMERGENCY', isEmergency: true },
    { title: 'Circuit breaker keeps tripping',    category: 'ELECTRICAL',   status: 'IN_PROGRESS', priority: 'URGENT',    isEmergency: false },
    { title: 'Split system not heating',          category: 'HVAC',         status: 'OPEN',        priority: 'STANDARD',  isEmergency: false },
    { title: 'Front door lock broken',            category: 'LOCKSMITH',    status: 'OPEN',        priority: 'URGENT',    isEmergency: false },
    { title: 'Solar panel inspection',            category: 'ELECTRICAL',   status: 'OPEN',        priority: 'STANDARD',  isEmergency: false },
    { title: 'Skylight leaking in bedroom',       category: 'ROOFING',      status: 'OPEN',        priority: 'URGENT',    isEmergency: false },
    { title: 'Shower regrouting needed',          category: 'PLUMBING',     status: 'COMPLETED',   priority: 'STANDARD',  isEmergency: false },
  ];

  let created = 0;
  for (const [i, tmpl] of jobTemplates.entries()) {
    const customer = customerProfiles[i % customerProfiles.length];
    if (!customer) throw new Error(`customerProfiles has no entry at index ${i % customerProfiles.length}`);
    const assignedTradie = tradieProfiles[i % tradieProfiles.length];

    const job = await db.job.create({
      data: {
        title: tmpl.title,
        description: `Test job: ${tmpl.title}. Created by seed script for development testing.`,
        category: tmpl.category as never,
        status: tmpl.status as never,
        priority: tmpl.priority as never,
        isEmergency: tmpl.isEmergency,
        complexity: 'MEDIUM' as never,
        customerId: customer.profile.id,
        addressId: customer.address.id,
        ...(tmpl.status !== 'OPEN' && assignedTradie && { tradieId: assignedTradie.profile.id }),
        ...(tmpl.status === 'COMPLETED' && { completedAt: new Date(Date.now() - i * 86400000) }),
        ...(tmpl.status === 'CLAIMED' && { claimedAt: new Date(Date.now() - i * 3600000) }),
      } as never,
    });

    if (tmpl.status === 'COMPLETED' && assignedTradie) {
      await db.payment.upsert({
        where: { jobId: job.id },
        create: {
          jobId: job.id,
          customerId: customer.profile.id,
          tradieId: assignedTradie.profile.id,
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
  console.log(`✅ ${created} test jobs seeded (all with address + coordinates)`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  await seedCreditPackages();

  if (process.env.NODE_ENV !== 'production') {
    const { customerProfiles, tradieProfiles } = await seedTestUsers();
    await seedTestJobs(customerProfiles, tradieProfiles);
  }

  console.log('✅ Seed complete');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
