import { PrismaClient } from './generated/client';

const db = new PrismaClient();

// ── Supabase Admin API ──────────────────────────────────────────────────────

async function createSupabaseUser(
  email: string,
  password: string,
  metadata: Record<string, unknown>,
): Promise<string> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY must be set for seeding');
  }

  const res = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${serviceKey}`,
      'apikey': serviceKey,
    },
    body: JSON.stringify({ email, password, email_confirm: true, user_metadata: metadata }),
  });

  if (res.ok) return (await res.json() as { id: string }).id;

  const err = await res.json() as { msg?: string; message?: string };
  const msg = err.msg ?? err.message ?? '';

  // Already exists → look up by email
  if (res.status === 422 && msg.toLowerCase().includes('already')) {
    const listRes = await fetch(
      `${supabaseUrl}/auth/v1/admin/users?page=1&per_page=100`,
      { headers: { 'Authorization': `Bearer ${serviceKey}`, 'apikey': serviceKey } },
    );
    const list = await listRes.json() as { users: { id: string; email: string }[] };
    const found = list.users.find((u) => u.email === email);
    if (found) return found.id;
  }

  throw new Error(`Supabase user creation failed for ${email}: ${msg}`);
}

// Ensure a user exists in both Supabase Auth and Prisma; returns userId.
async function ensureUser(opts: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER' | 'TRADIE';
}): Promise<string> {
  const existing = await db.user.findUnique({ where: { email: opts.email } });
  if (existing) {
    console.log(`  ↩  ${opts.email} already exists — skipping`);
    return existing.id;
  }

  const supabaseId = await createSupabaseUser(opts.email, 'Demo1234!', {
    firstName: opts.firstName,
    lastName: opts.lastName,
    role: opts.role,
    onboardingComplete: true,
  });

  await db.user.create({
    data: {
      id: supabaseId,
      email: opts.email,
      firstName: opts.firstName,
      lastName: opts.lastName,
      role: opts.role,
      onboardingComplete: true,
      emailVerified: new Date(),
    },
  });

  return supabaseId;
}

// ── Sydney suburb coordinates ────────────────────────────────────────────────

const SUBURBS = {
  bondi:       { suburb: 'Bondi Beach',  state: 'NSW', lat: -33.8915, lng: 151.2767 },
  surryHills:  { suburb: 'Surry Hills',  state: 'NSW', lat: -33.8855, lng: 151.2094 },
  manly:       { suburb: 'Manly',        state: 'NSW', lat: -33.7974, lng: 151.2836 },
  newtown:     { suburb: 'Newtown',      state: 'NSW', lat: -33.8978, lng: 151.1787 },
  parramatta:  { suburb: 'Parramatta',   state: 'NSW', lat: -33.8150, lng: 151.0041 },
  chatswood:   { suburb: 'Chatswood',    state: 'NSW', lat: -33.7964, lng: 151.1825 },
  cbd:         { suburb: 'Sydney CBD',   state: 'NSW', lat: -33.8688, lng: 151.2093 },
  liverpool:   { suburb: 'Liverpool',    state: 'NSW', lat: -33.9200, lng: 150.9237 },
  hornsby:     { suburb: 'Hornsby',      state: 'NSW', lat: -33.7040, lng: 151.0990 },
  penrith:     { suburb: 'Penrith',      state: 'NSW', lat: -33.7497, lng: 150.6945 },
};

// ── Main seed ────────────────────────────────────────────────────────────────

async function main() {
  // ── Credit packages (preserve existing) ────────────────────────────────────
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

  // ── Customers ─────────────────────────────────────────────────────────────
  const customerDefs = [
    { email: 'emma.williams@demo.fixit247.com',   firstName: 'Emma',    lastName: 'Williams', ...SUBURBS.bondi },
    { email: 'liam.chen@demo.fixit247.com',       firstName: 'Liam',    lastName: 'Chen',     ...SUBURBS.surryHills },
    { email: 'olivia.johnson@demo.fixit247.com',  firstName: 'Olivia',  lastName: 'Johnson',  ...SUBURBS.manly },
    { email: 'noah.smith@demo.fixit247.com',      firstName: 'Noah',    lastName: 'Smith',    ...SUBURBS.newtown },
    { email: 'ava.brown@demo.fixit247.com',       firstName: 'Ava',     lastName: 'Brown',    ...SUBURBS.parramatta },
    { email: 'william.davis@demo.fixit247.com',   firstName: 'William', lastName: 'Davis',    ...SUBURBS.chatswood },
  ];

  const customerIds: string[] = [];
  const customerProfileIds: string[] = [];
  const customerAddressIds: string[] = [];

  for (const c of customerDefs) {
    const userId = await ensureUser({ email: c.email, password: 'Demo1234!', firstName: c.firstName, lastName: c.lastName, role: 'CUSTOMER' });
    customerIds.push(userId);

    let profile = await db.customerProfile.findUnique({ where: { userId } });
    if (!profile) {
      profile = await db.customerProfile.create({
        data: { userId, suburb: c.suburb, state: c.state, postcode: '2000' },
      });
    }
    customerProfileIds.push(profile.id);

    let addr = await db.address.findFirst({ where: { userId, isDefault: true } });
    if (!addr) {
      addr = await db.address.create({
        data: {
          userId,
          customerProfileId: profile.id,
          label: 'Home',
          street: '1 Demo Street',
          suburb: c.suburb,
          city: c.suburb,
          state: c.state,
          postcode: '2000',
          latitude: c.lat,
          longitude: c.lng,
          isDefault: true,
        },
      });
      await db.customerProfile.update({ where: { id: profile.id }, data: { defaultAddressId: addr.id } });
    }
    customerAddressIds.push(addr.id);
  }
  console.log(`✅ ${customerDefs.length} customers seeded`);

  // ── Tradies ──────────────────────────────────────────────────────────────
  const tradieDefs = [
    {
      email: 'mike.torres@demo.fixit247.com', firstName: 'Mike',  lastName: 'Torres',
      businessName: 'Torres Plumbing & HVAC', trades: ['PLUMBING', 'HVAC'],
      ...SUBURBS.bondi, serviceRadiusKm: 20, isEmergency: true,
      trustScore: 88, avgRating: 4.9, totalReviews: 47, responseTime: 18,
    },
    {
      email: 'sarah.electric@demo.fixit247.com', firstName: 'Sarah', lastName: 'Electric',
      businessName: 'Electric Sarah Pty Ltd', trades: ['ELECTRICAL', 'APPLIANCE_REPAIR'],
      ...SUBURBS.surryHills, serviceRadiusKm: 25, isEmergency: true,
      trustScore: 92, avgRating: 4.8, totalReviews: 63, responseTime: 22,
    },
    {
      email: 'tom.locks@demo.fixit247.com', firstName: 'Tom', lastName: 'Locks',
      businessName: 'CBD Locksmith Solutions', trades: ['LOCKSMITH'],
      ...SUBURBS.cbd, serviceRadiusKm: 30, isEmergency: true,
      trustScore: 85, avgRating: 4.7, totalReviews: 31, responseTime: 15,
    },
    {
      email: 'jake.roofer@demo.fixit247.com', firstName: 'Jake', lastName: 'Roofer',
      businessName: 'Northern Beaches Roofing', trades: ['ROOFING', 'CARPENTRY'],
      ...SUBURBS.manly, serviceRadiusKm: 20, isEmergency: false,
      trustScore: 79, avgRating: 4.6, totalReviews: 24, responseTime: 45,
    },
    {
      email: 'amy.cool@demo.fixit247.com', firstName: 'Amy', lastName: 'Cool',
      businessName: 'Cool Comfort HVAC', trades: ['HVAC'],
      ...SUBURBS.chatswood, serviceRadiusKm: 30, isEmergency: true,
      trustScore: 83, avgRating: 4.8, totalReviews: 38, responseTime: 25,
    },
    {
      email: 'dan.pipes@demo.fixit247.com', firstName: 'Dan', lastName: 'Pipes',
      businessName: 'Westside Plumbing', trades: ['PLUMBING'],
      ...SUBURBS.parramatta, serviceRadiusKm: 25, isEmergency: true,
      trustScore: 76, avgRating: 4.5, totalReviews: 19, responseTime: 30,
    },
    {
      email: 'lisa.sparks@demo.fixit247.com', firstName: 'Lisa', lastName: 'Sparks',
      businessName: 'Inner West Electrical', trades: ['ELECTRICAL'],
      ...SUBURBS.newtown, serviceRadiusKm: 20, isEmergency: false,
      trustScore: 90, avgRating: 5.0, totalReviews: 12, responseTime: 60,
    },
    {
      email: 'chris.glass@demo.fixit247.com', firstName: 'Chris', lastName: 'Glass',
      businessName: 'Precision Glazing', trades: ['GLAZING'],
      ...SUBURBS.cbd, serviceRadiusKm: 35, isEmergency: true,
      trustScore: 82, avgRating: 4.7, totalReviews: 28, responseTime: 20,
    },
    {
      email: 'paul.pest@demo.fixit247.com', firstName: 'Paul', lastName: 'Pest',
      businessName: 'SW Pest Solutions', trades: ['PEST_CONTROL'],
      ...SUBURBS.liverpool, serviceRadiusKm: 40, isEmergency: false,
      trustScore: 74, avgRating: 4.4, totalReviews: 16, responseTime: 90,
    },
    {
      email: 'anna.fix@demo.fixit247.com', firstName: 'Anna', lastName: 'Fix',
      businessName: 'Fix-It Anna', trades: ['GENERAL_MAINTENANCE', 'CARPENTRY'],
      ...SUBURBS.hornsby, serviceRadiusKm: 30, isEmergency: false,
      trustScore: 80, avgRating: 4.6, totalReviews: 22, responseTime: 55,
    },
  ];

  const tradieProfileIds: string[] = [];

  for (const t of tradieDefs) {
    const userId = await ensureUser({ email: t.email, password: 'Demo1234!', firstName: t.firstName, lastName: t.lastName, role: 'TRADIE' });

    let profile = await db.tradieProfile.findUnique({ where: { userId } });
    if (!profile) {
      profile = await db.tradieProfile.create({
        data: {
          userId,
          businessName: t.businessName,
          trades: t.trades as any,
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
  console.log(`✅ ${tradieDefs.length} tradies seeded`);

  // ── Jobs ─────────────────────────────────────────────────────────────────
  interface JobDef { customerId: string; addressId: string; title: string; description: string; category: string; status: string; priority: string; isEmergency: boolean }

  function jobFor(profileIdx: number, addrIdx: number, rest: Omit<JobDef, 'customerId' | 'addressId'>): JobDef {
    const customerId = customerProfileIds[profileIdx] ?? '';
    const addressId  = customerAddressIds[addrIdx] ?? '';
    return { customerId, addressId, ...rest };
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
        category:    j.category as any,
        status:      j.status as any,
        priority:    j.priority as any,
        isEmergency: j.isEmergency,
        leadPrice:   j.category === 'PLUMBING' ? 15 : j.category === 'ELECTRICAL' ? 20 : j.category === 'LOCKSMITH' ? 10 : j.category === 'ROOFING' ? 30 : 25,
      },
    });
  }
  console.log(`✅ ${jobDefs.length} jobs seeded`);

  console.log('\n🎉 Seed complete!');
  console.log('   Demo password for all accounts: Demo1234!');
  console.log('   Customer logins: emma.williams@demo.fixit247.com … william.davis@demo.fixit247.com');
  console.log('   Tradie logins:   mike.torres@demo.fixit247.com … anna.fix@demo.fixit247.com');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
