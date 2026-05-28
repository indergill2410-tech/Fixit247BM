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

// ─── Test credentials ─────────────────────────────────────────────────────────

const TEST_PASSWORD = process.env.SEED_TEST_PASSWORD ?? 'Fixit247!Test';
const DEMO_PASSWORD = 'Demo1234!';

// ─── Ensure Supabase auth user exists ────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function ensureAuthUser(
  admin: ReturnType<typeof getSupabaseAdmin>,
  email: string,
  meta: Record<string, unknown>,
  password: string = TEST_PASSWORD,
): Promise<string | null> {
  if (!admin) return null;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const { data: listData } = await admin.auth.admin.listUsers({ perPage: 1000 });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unnecessary-condition
  const existing = (listData as { users?: { id: string; email?: string | null }[] } | null)?.users?.find((u) => u.email === email);
  if (existing) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    await admin.auth.admin.updateUserById(existing.id, { password });
    return existing.id;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
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

// ─── Demo Users (admin dashboard showcase data) ───────────────────────────────

const DEMO_SUBURBS = {
  bondi:       { suburb: 'Bondi Beach',  state: 'NSW', postcode: '2026', lat: -33.8915, lng: 151.2767 },
  surryHills:  { suburb: 'Surry Hills',  state: 'NSW', postcode: '2010', lat: -33.8855, lng: 151.2094 },
  manly:       { suburb: 'Manly',        state: 'NSW', postcode: '2095', lat: -33.7974, lng: 151.2836 },
  newtown:     { suburb: 'Newtown',      state: 'NSW', postcode: '2042', lat: -33.8978, lng: 151.1787 },
  parramatta:  { suburb: 'Parramatta',   state: 'NSW', postcode: '2150', lat: -33.8150, lng: 151.0041 },
  chatswood:   { suburb: 'Chatswood',    state: 'NSW', postcode: '2067', lat: -33.7964, lng: 151.1825 },
  cbd:         { suburb: 'Sydney CBD',   state: 'NSW', postcode: '2000', lat: -33.8688, lng: 151.2093 },
  liverpool:   { suburb: 'Liverpool',    state: 'NSW', postcode: '2170', lat: -33.9200, lng: 150.9237 },
  hornsby:     { suburb: 'Hornsby',      state: 'NSW', postcode: '2077', lat: -33.7040, lng: 151.0990 },
};

async function seedDemoUsers() {
  const admin = getSupabaseAdmin();

  const customerDefs = [
    { email: 'emma.williams@demo.fixit247.com',   firstName: 'Emma',    lastName: 'Williams', ...DEMO_SUBURBS.bondi },
    { email: 'liam.chen@demo.fixit247.com',       firstName: 'Liam',    lastName: 'Chen',     ...DEMO_SUBURBS.surryHills },
    { email: 'olivia.johnson@demo.fixit247.com',  firstName: 'Olivia',  lastName: 'Johnson',  ...DEMO_SUBURBS.manly },
    { email: 'noah.smith@demo.fixit247.com',      firstName: 'Noah',    lastName: 'Smith',    ...DEMO_SUBURBS.newtown },
    { email: 'ava.brown@demo.fixit247.com',       firstName: 'Ava',     lastName: 'Brown',    ...DEMO_SUBURBS.parramatta },
    { email: 'william.davis@demo.fixit247.com',   firstName: 'William', lastName: 'Davis',    ...DEMO_SUBURBS.chatswood },
  ];

  const customerProfileIds: string[] = [];
  const customerAddressIds: string[] = [];

  for (const c of customerDefs) {
    const authId = await ensureAuthUser(admin, c.email, {
      firstName: c.firstName, lastName: c.lastName, role: 'CUSTOMER', onboardingComplete: true,
    }, DEMO_PASSWORD);

    const user = await db.user.upsert({
      where: { email: c.email },
      create: {
        ...(authId ? { id: authId } : {}),
        email: c.email, firstName: c.firstName, lastName: c.lastName,
        role: 'CUSTOMER', isActive: true, emailVerified: new Date(), onboardingComplete: true,
      },
      update: { isActive: true, onboardingComplete: true },
    });

    let profile = await db.customerProfile.findUnique({ where: { userId: user.id } });
    if (!profile) {
      profile = await db.customerProfile.create({
        data: { userId: user.id, suburb: c.suburb, state: c.state, postcode: c.postcode },
      });
    }
    customerProfileIds.push(profile.id);

    let addr = await db.address.findFirst({ where: { userId: user.id, isDefault: true } });
    if (!addr) {
      addr = await db.address.create({
        data: {
          userId: user.id,
          customerProfileId: profile.id,
          label: 'Home',
          street: '1 Demo Street',
          suburb: c.suburb,
          city: c.suburb,
          state: c.state,
          postcode: c.postcode,
          country: 'AU',
          latitude: c.lat,
          longitude: c.lng,
          isDefault: true,
        },
      });
      await db.customerProfile.update({ where: { id: profile.id }, data: { defaultAddressId: addr.id } });
    }
    customerAddressIds.push(addr.id);
  }
  console.log(`✅ ${customerDefs.length} demo customers seeded`);

  const tradieDefs = [
    {
      email: 'mike.torres@demo.fixit247.com', firstName: 'Mike',  lastName: 'Torres',
      businessName: 'Torres Plumbing & HVAC', trades: ['PLUMBING', 'HVAC'],
      ...DEMO_SUBURBS.bondi, serviceRadiusKm: 20, isEmergency: true,
      trustScore: 88, avgRating: 4.9, totalReviews: 47, responseTime: 18,
    },
    {
      email: 'sarah.electric@demo.fixit247.com', firstName: 'Sarah', lastName: 'Electric',
      businessName: 'Electric Sarah Pty Ltd', trades: ['ELECTRICAL', 'APPLIANCE_REPAIR'],
      ...DEMO_SUBURBS.surryHills, serviceRadiusKm: 25, isEmergency: true,
      trustScore: 92, avgRating: 4.8, totalReviews: 63, responseTime: 22,
    },
    {
      email: 'tom.locks@demo.fixit247.com', firstName: 'Tom', lastName: 'Locks',
      businessName: 'CBD Locksmith Solutions', trades: ['LOCKSMITH'],
      ...DEMO_SUBURBS.cbd, serviceRadiusKm: 30, isEmergency: true,
      trustScore: 85, avgRating: 4.7, totalReviews: 31, responseTime: 15,
    },
    {
      email: 'jake.roofer@demo.fixit247.com', firstName: 'Jake', lastName: 'Roofer',
      businessName: 'Northern Beaches Roofing', trades: ['ROOFING', 'CARPENTRY'],
      ...DEMO_SUBURBS.manly, serviceRadiusKm: 20, isEmergency: false,
      trustScore: 79, avgRating: 4.6, totalReviews: 24, responseTime: 45,
    },
    {
      email: 'amy.cool@demo.fixit247.com', firstName: 'Amy', lastName: 'Cool',
      businessName: 'Cool Comfort HVAC', trades: ['HVAC'],
      ...DEMO_SUBURBS.chatswood, serviceRadiusKm: 30, isEmergency: true,
      trustScore: 83, avgRating: 4.8, totalReviews: 38, responseTime: 25,
    },
    {
      email: 'dan.pipes@demo.fixit247.com', firstName: 'Dan', lastName: 'Pipes',
      businessName: 'Westside Plumbing', trades: ['PLUMBING'],
      ...DEMO_SUBURBS.parramatta, serviceRadiusKm: 25, isEmergency: true,
      trustScore: 76, avgRating: 4.5, totalReviews: 19, responseTime: 30,
    },
    {
      email: 'lisa.sparks@demo.fixit247.com', firstName: 'Lisa', lastName: 'Sparks',
      businessName: 'Inner West Electrical', trades: ['ELECTRICAL'],
      ...DEMO_SUBURBS.newtown, serviceRadiusKm: 20, isEmergency: false,
      trustScore: 90, avgRating: 5.0, totalReviews: 12, responseTime: 60,
    },
    {
      email: 'chris.glass@demo.fixit247.com', firstName: 'Chris', lastName: 'Glass',
      businessName: 'Precision Glazing', trades: ['GLAZING'],
      ...DEMO_SUBURBS.cbd, serviceRadiusKm: 35, isEmergency: true,
      trustScore: 82, avgRating: 4.7, totalReviews: 28, responseTime: 20,
    },
    {
      email: 'paul.pest@demo.fixit247.com', firstName: 'Paul', lastName: 'Pest',
      businessName: 'SW Pest Solutions', trades: ['PEST_CONTROL'],
      ...DEMO_SUBURBS.liverpool, serviceRadiusKm: 40, isEmergency: false,
      trustScore: 74, avgRating: 4.4, totalReviews: 16, responseTime: 90,
    },
    {
      email: 'anna.fix@demo.fixit247.com', firstName: 'Anna', lastName: 'Fix',
      businessName: 'Fix-It Anna', trades: ['GENERAL_MAINTENANCE', 'CARPENTRY'],
      ...DEMO_SUBURBS.hornsby, serviceRadiusKm: 30, isEmergency: false,
      trustScore: 80, avgRating: 4.6, totalReviews: 22, responseTime: 55,
    },
  ];

  const tradieProfileIds: string[] = [];

  for (const t of tradieDefs) {
    const authId = await ensureAuthUser(admin, t.email, {
      firstName: t.firstName, lastName: t.lastName, role: 'TRADIE', onboardingComplete: true,
    }, DEMO_PASSWORD);

    const user = await db.user.upsert({
      where: { email: t.email },
      create: {
        ...(authId ? { id: authId } : {}),
        email: t.email, firstName: t.firstName, lastName: t.lastName,
        role: 'TRADIE', isActive: true, emailVerified: new Date(), onboardingComplete: true,
      },
      update: { isActive: true, onboardingComplete: true },
    });

    let profile = await db.tradieProfile.findUnique({ where: { userId: user.id } });
    if (!profile) {
      profile = await db.tradieProfile.create({
        data: {
          userId: user.id,
          businessName: t.businessName,
          trades: t.trades as never,
          serviceRadiusKm: t.serviceRadiusKm,
          isAvailable: true,
          isEmergencyAvailable: t.isEmergency,
          acceptsSameDay: true,
          verificationStatus: 'VERIFIED',
          onboardingStatus: 'APPROVED',
          avgRating: t.avgRating,
          totalReviews: t.totalReviews,
          trustScore: t.trustScore,
          completionRate: 95,
          cancellationRate: 2,
          responseTimeMinutes: t.responseTime,
          isVisible: true,
        },
      });
    }
    tradieProfileIds.push(profile.id);

    // Realtime status with coordinates (required for matching engine)
    const rtExists = await db.tradieRealtimeStatus.findUnique({ where: { tradieId: profile.id } });
    if (!rtExists) {
      await db.tradieRealtimeStatus.create({
        data: {
          tradieId: profile.id,
          onlineStatus: 'ONLINE',
          lastHeartbeatAt: new Date(),
          activeJobCount: 0,
          currentLatitude: t.lat,
          currentLongitude: t.lng,
        },
      });
    }
  }
  console.log(`✅ ${tradieDefs.length} demo tradies seeded`);

  // Demo jobs
  interface JobDef { customerId: string; addressId: string; title: string; description: string; category: string; status: string; priority: string; isEmergency: boolean }

  function jobFor(profileIdx: number, addrIdx: number, rest: Omit<JobDef, 'customerId' | 'addressId'>): JobDef {
    return { customerId: customerProfileIds[profileIdx] ?? '', addressId: customerAddressIds[addrIdx] ?? '', ...rest };
  }

  const jobDefs: JobDef[] = [
    jobFor(0, 0, { title: 'Burst pipe under kitchen sink — flooding', description: 'Water is gushing from under the kitchen sink. The cabinet is flooding. Need someone urgently.', category: 'PLUMBING', status: 'OPEN', priority: 'EMERGENCY', isEmergency: true }),
    jobFor(1, 1, { title: 'Tripping circuit breaker in bedroom', description: 'The bedroom circuit keeps tripping every few hours. Think it might be overloaded.', category: 'ELECTRICAL', status: 'OPEN', priority: 'STANDARD', isEmergency: false }),
    jobFor(2, 2, { title: 'Locked out of house — keys inside', description: 'Locked myself out. Keys are on the kitchen bench. Need a locksmith today.', category: 'LOCKSMITH', status: 'CLAIMED', priority: 'URGENT', isEmergency: false }),
    jobFor(3, 3, { title: 'Storm damage — roof tiles displaced', description: "After last night's storm, several tiles on the back section of the roof have slipped. Need repair.", category: 'ROOFING', status: 'COMPLETED', priority: 'STANDARD', isEmergency: false }),
    jobFor(4, 4, { title: 'AC not cooling — possible refrigerant leak', description: 'Split system AC running but blowing warm air. Suspect refrigerant issue.', category: 'HVAC', status: 'OPEN', priority: 'EMERGENCY', isEmergency: true }),
  ];

  for (const j of jobDefs) {
    const exists = await db.job.findFirst({ where: { title: j.title, customerId: j.customerId } });
    if (exists) {
      console.log(`  ↩  Job "${j.title.slice(0, 40)}…" already exists — skipping`);
      continue;
    }
    await db.job.create({
      data: {
        customerId:  j.customerId,
        addressId:   j.addressId,
        title:       j.title,
        description: j.description,
        category:    j.category as never,
        status:      j.status as never,
        priority:    j.priority as never,
        isEmergency: j.isEmergency,
        leadPrice:   j.category === 'PLUMBING' ? 15 : j.category === 'ELECTRICAL' ? 20 : j.category === 'LOCKSMITH' ? 10 : j.category === 'ROOFING' ? 30 : 25,
      },
    });
  }
  console.log(`✅ ${jobDefs.length} demo jobs seeded`);

  // ── Admin demo account ────────────────────────────────────────────────────
  const adminAuthId = await ensureAuthUser(admin, 'admin@demo.fixit247.com.au', {
    firstName: 'Admin', lastName: 'Demo', role: 'ADMIN', onboardingComplete: true,
  }, DEMO_PASSWORD);
  await db.user.upsert({
    where: { email: 'admin@demo.fixit247.com.au' },
    create: {
      ...(adminAuthId ? { id: adminAuthId } : {}),
      email: 'admin@demo.fixit247.com.au', firstName: 'Admin', lastName: 'Demo',
      role: 'ADMIN', isActive: true, emailVerified: new Date(), onboardingComplete: true,
    },
    update: { isActive: true, role: 'ADMIN', onboardingComplete: true },
  });
  console.log('✅ Admin demo account seeded');

  console.log(`   Demo password: ${DEMO_PASSWORD}`);
  console.log('   Customers: emma.williams@demo.fixit247.com … william.davis@demo.fixit247.com');
  console.log('   Tradies:   mike.torres@demo.fixit247.com … anna.fix@demo.fixit247.com');
  console.log('   Admin:     admin@demo.fixit247.com.au');
}

// ─── Test Users ───────────────────────────────────────────────────────────────

const TEST_SUBURBS = [
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

    const suburb = TEST_SUBURBS[i % TEST_SUBURBS.length];
    if (!suburb) throw new Error(`TEST_SUBURBS has no entry at index ${i % TEST_SUBURBS.length}`);

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
    await seedDemoUsers();
    const { customerProfiles, tradieProfiles } = await seedTestUsers();
    await seedTestJobs(customerProfiles, tradieProfiles);
  }

  console.log('✅ Seed complete');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
