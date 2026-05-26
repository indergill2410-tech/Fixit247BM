// Seed script using Supabase JS client over HTTP — works without direct TCP access
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const TEST_PASSWORD = process.env.SEED_TEST_PASSWORD ?? 'Fixit247!Test';

// ─── Australian suburb coordinates ──────────────────────────────────────────
const SUBURBS = [
  { suburb: 'Surry Hills',      state: 'NSW', postcode: '2010', lat: -33.8890, lng: 151.2113 },
  { suburb: 'Fitzroy',          state: 'VIC', postcode: '3065', lat: -37.7997, lng: 144.9789 },
  { suburb: 'Fortitude Valley', state: 'QLD', postcode: '4006', lat: -27.4562, lng: 153.0321 },
  { suburb: 'Fremantle',        state: 'WA',  postcode: '6160', lat: -32.0569, lng: 115.7439 },
  { suburb: 'Glenelg',          state: 'SA',  postcode: '5045', lat: -34.9834, lng: 138.5167 },
];

const TRADIE_COORDS = [
  { lat: -33.8750, lng: 151.2050 },
  { lat: -33.8700, lng: 151.2200 },
  { lat: -37.8100, lng: 144.9600 },
  { lat: -37.8050, lng: 144.9900 },
  { lat: -27.4700, lng: 153.0200 },
  { lat: -27.4450, lng: 153.0400 },
  { lat: -32.0650, lng: 115.7300 },
  { lat: -32.0450, lng: 115.7550 },
  { lat: -34.9700, lng: 138.5050 },
  { lat: -34.9900, lng: 138.5300 },
];

// ─── Helper ──────────────────────────────────────────────────────────────────
async function upsertAuthUser(email, meta) {
  const { data: { users } } = await sb.auth.admin.listUsers({ perPage: 1000 });
  const existing = users?.find(u => u.email === email);
  if (existing) {
    await sb.auth.admin.updateUserById(existing.id, { password: TEST_PASSWORD });
    return existing.id;
  }
  const { data, error } = await sb.auth.admin.createUser({
    email,
    password: TEST_PASSWORD,
    email_confirm: true,
    user_metadata: meta,
  });
  if (error) { console.warn(`  ⚠ Auth user ${email}: ${error.message}`); return null; }
  return data.user.id;
}

async function insertOrIgnore(table, row, conflictCol = 'id') {
  const { error } = await sb.from(table).upsert(row, { onConflict: conflictCol, ignoreDuplicates: false });
  if (error) console.warn(`  ⚠ ${table}: ${error.message}`);
}

async function insertIfMissing(table, row, matchCol, matchVal) {
  const { data } = await sb.from(table).select('id').eq(matchCol, matchVal).maybeSingle();
  if (data) return data;
  const { data: created, error } = await sb.from(table).insert(row).select().single();
  if (error) { console.warn(`  ⚠ ${table}: ${error.message}`); return null; }
  return created;
}

// ─── Credit Packages ─────────────────────────────────────────────────────────
async function seedCreditPackages() {
  // deactivate all first
  await sb.from('credit_packages').update({ is_active: false }).neq('id', '00000000-0000-0000-0000-000000000000');

  const packs = [
    { name: 'Starter Pack', credits: 10, bonus_credits: 0,  price_aud: 49,  is_popular: false, is_active: true, display_order: 1 },
    { name: 'Pro Pack',     credits: 22, bonus_credits: 2,  price_aud: 99,  is_popular: true,  is_active: true, display_order: 2 },
    { name: 'Elite Pack',   credits: 35, bonus_credits: 5,  price_aud: 149, is_popular: false, is_active: true, display_order: 3 },
  ];

  for (const pack of packs) {
    const { data: existing } = await sb.from('credit_packages').select('id').eq('name', pack.name).maybeSingle();
    if (existing) {
      await sb.from('credit_packages').update(pack).eq('id', existing.id);
    } else {
      await sb.from('credit_packages').insert({ id: randomUUID(), ...pack });
    }
  }
  console.log('✅ Credit packages seeded');
}

// ─── Test Customers ───────────────────────────────────────────────────────────
async function seedCustomers() {
  const customers = [
    { firstName: 'Alice', lastName: 'Chen',   email: 'test-customer-1@fixit247.dev', phone: '+61411000001' },
    { firstName: 'Bob',   lastName: 'Smith',  email: 'test-customer-2@fixit247.dev', phone: '+61411000002' },
    { firstName: 'Carol', lastName: 'Jones',  email: 'test-customer-3@fixit247.dev', phone: '+61411000003' },
    { firstName: 'Dave',  lastName: 'Wilson', email: 'test-customer-4@fixit247.dev', phone: '+61411000004' },
    { firstName: 'Emma',  lastName: 'Taylor', email: 'test-customer-5@fixit247.dev', phone: '+61411000005' },
  ];

  const profiles = [];
  for (const [i, c] of customers.entries()) {
    process.stdout.write(`  Customer ${i+1}/5: ${c.email} ... `);

    const authId = await upsertAuthUser(c.email, {
      firstName: c.firstName, lastName: c.lastName, role: 'CUSTOMER', onboardingComplete: true,
    });

    // User row
    const userId = authId ?? randomUUID();
    await sb.from('users').upsert({
      id: userId, email: c.email,
      first_name: c.firstName, last_name: c.lastName,
      phone: c.phone, role: 'CUSTOMER', is_active: true,
      email_verified: new Date().toISOString(),
    }, { onConflict: 'email' });

    const { data: user } = await sb.from('users').select('id').eq('email', c.email).single();
    const uid = user.id;

    // Address with coordinates
    const sub = SUBURBS[i % SUBURBS.length];
    let { data: addr } = await sb.from('addresses').select('id').eq('user_id', uid).maybeSingle();
    if (addr) {
      await sb.from('addresses').update({ latitude: sub.lat, longitude: sub.lng, is_default: true }).eq('id', addr.id);
    } else {
      const newAddr = {
        id: randomUUID(), user_id: uid,
        street: `${10 + i} Test St`, suburb: sub.suburb,
        city: sub.suburb, state: sub.state, postcode: sub.postcode,
        country: 'AU', latitude: sub.lat, longitude: sub.lng, is_default: true,
      };
      const { data: a } = await sb.from('addresses').insert(newAddr).select('id').single();
      addr = a;
    }

    // CustomerProfile
    const { data: cp } = await sb.from('customer_profiles').select('id').eq('user_id', uid).maybeSingle();
    let profileId;
    if (cp) {
      profileId = cp.id;
      await sb.from('customer_profiles').update({ default_address_id: addr.id }).eq('id', profileId);
    } else {
      const { data: np } = await sb.from('customer_profiles').insert({
        id: randomUUID(), user_id: uid, default_address_id: addr.id,
        suburb: sub.suburb, postcode: sub.postcode, state: sub.state,
      }).select('id').single();
      profileId = np?.id;
    }

    // Link address → customer profile
    if (addr?.id && profileId) {
      await sb.from('addresses').update({ customer_profile_id: profileId }).eq('id', addr.id);
    }

    profiles.push({ userId: uid, profileId, addressId: addr?.id, suburb: sub });
    console.log('✅');
  }
  return profiles;
}

// ─── Test Tradies ─────────────────────────────────────────────────────────────
async function seedTradies() {
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

  const profiles = [];
  for (const [i, t] of tradies.entries()) {
    process.stdout.write(`  Tradie ${i+1}/10: ${t.email} ... `);

    const authId = await upsertAuthUser(t.email, {
      firstName: t.firstName, lastName: t.lastName, role: 'TRADIE', onboardingComplete: true,
    });

    const userId = authId ?? randomUUID();
    await sb.from('users').upsert({
      id: userId, email: t.email,
      first_name: t.firstName, last_name: t.lastName,
      phone: t.phone, role: 'TRADIE', is_active: true,
      email_verified: new Date().toISOString(),
    }, { onConflict: 'email' });

    const { data: user } = await sb.from('users').select('id').eq('email', t.email).single();
    const uid = user.id;

    // TradieProfile
    const { data: tp } = await sb.from('tradie_profiles').select('id').eq('user_id', uid).maybeSingle();
    let profileId;
    if (tp) {
      profileId = tp.id;
      await sb.from('tradie_profiles').update({
        is_available: true, verification_status: 'VERIFIED', onboarding_status: 'APPROVED',
      }).eq('id', profileId);
    } else {
      const { data: np } = await sb.from('tradie_profiles').insert({
        id: randomUUID(), user_id: uid,
        business_name: `${t.firstName}'s ${t.trade.replace(/_/g, ' ')} Services`,
        abn: `${10000000000 + i * 11111111}`,
        trades: [t.trade],
        service_radius_km: 25,
        is_available: true,
        is_emergency_available: i % 3 === 0,
        verification_status: 'VERIFIED',
        onboarding_status: 'APPROVED',
        onboarding_step: 5,
        avg_rating: (4.2 + (i % 8) * 0.1).toFixed(2),
        total_reviews: 5 + i * 3,
        rank_score: 50 + i * 3,
      }).select('id').single();
      profileId = np?.id;
    }

    // Credits wallet
    const { data: wallet } = await sb.from('credits_wallets').select('id').eq('user_id', uid).maybeSingle();
    if (!wallet) {
      await sb.from('credits_wallets').insert({
        id: randomUUID(), user_id: uid,
        balance: 10 + i * 5, lifetime_earned: 20 + i * 5, lifetime_spent: 10,
      });
    }

    // TradieRealtimeStatus — critical for matching engine
    const coords = TRADIE_COORDS[i % TRADIE_COORDS.length];
    const { data: rt } = await sb.from('tradie_realtime_status').select('id').eq('tradie_id', profileId).maybeSingle();
    if (rt) {
      await sb.from('tradie_realtime_status').update({
        online_status: 'ONLINE',
        current_latitude: coords.lat,
        current_longitude: coords.lng,
        active_job_count: 0,
        last_heartbeat_at: new Date().toISOString(),
      }).eq('id', rt.id);
    } else {
      await sb.from('tradie_realtime_status').insert({
        id: randomUUID(), tradie_id: profileId,
        online_status: 'ONLINE',
        current_latitude: coords.lat,
        current_longitude: coords.lng,
        active_job_count: 0,
        travel_radius_km: 25,
        last_heartbeat_at: new Date().toISOString(),
      });
    }

    profiles.push({ userId: uid, profileId });
    console.log('✅');
  }
  return profiles;
}

// ─── Test Jobs ────────────────────────────────────────────────────────────────
async function seedJobs(customers, tradies) {
  const templates = [
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
  for (const [i, tmpl] of templates.entries()) {
    const customer = customers[i % customers.length];
    const tradie   = tradies[i % tradies.length];

    const job = {
      id: randomUUID(),
      customer_id: customer.profileId,
      address_id: customer.addressId,
      title: tmpl.title,
      description: `Test job: ${tmpl.title}. Created by seed script.`,
      category: tmpl.category,
      status: tmpl.status,
      priority: tmpl.priority,
      is_emergency: tmpl.isEmergency,
      complexity: 'MEDIUM',
      ...(tmpl.status !== 'OPEN' && tradie ? { tradie_id: tradie.profileId } : {}),
      ...(tmpl.status === 'COMPLETED' ? { completed_at: new Date(Date.now() - i * 86400000).toISOString() } : {}),
      ...(tmpl.status === 'CLAIMED'   ? { claimed_at:   new Date(Date.now() - i * 3600000).toISOString()  } : {}),
    };

    const { data: newJob, error } = await sb.from('jobs').insert(job).select('id').single();
    if (error) { console.warn(`  ⚠ Job "${tmpl.title}": ${error.message}`); continue; }

    // Payment for completed jobs
    if (tmpl.status === 'COMPLETED' && tradie && newJob) {
      await sb.from('payments').insert({
        id: randomUUID(),
        job_id: newJob.id,
        customer_id: customer.profileId,
        tradie_id: tradie.profileId,
        amount: 150 + i * 25,
        platform_fee: 15 + i * 2,
        tradie_amount: 135 + i * 23,
        status: 'RELEASED',
        paid_at: new Date(Date.now() - i * 86400000 + 3600000).toISOString(),
        released_at: new Date(Date.now() - i * 86400000 + 7200000).toISOString(),
      });
    }
    created++;
  }
  console.log(`✅ ${created} test jobs seeded`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
console.log('🌱 Starting seed via Supabase HTTP API...\n');
console.log('📦 Seeding credit packages...');
await seedCreditPackages();

console.log('\n👥 Seeding customers...');
const customers = await seedCustomers();

console.log('\n🔧 Seeding tradies...');
const tradies = await seedTradies();

console.log('\n💼 Seeding jobs...');
await seedJobs(customers, tradies);

console.log('\n✅ Seed complete!');
console.log('─────────────────────────────────────');
console.log(`Email pattern : test-customer-{1-5}@fixit247.dev`);
console.log(`             : test-tradie-{1-10}@fixit247.dev`);
console.log(`Password      : ${TEST_PASSWORD}`);
console.log('─────────────────────────────────────');
