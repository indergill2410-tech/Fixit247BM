-- ============================================================
-- Fixit247 — Test Data Seed Script
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- Password for all test accounts: Fixit247!Test
-- ============================================================

-- Ensure pgcrypto is available for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  -- Password hash (bcrypt of 'Fixit247!Test')
  pw_hash TEXT := crypt('Fixit247!Test', gen_salt('bf'));
  now_ts  TIMESTAMPTZ := now();

  -- Customer user IDs (same used in auth.users + public.users)
  c1 UUID := '00000001-0000-4000-8000-000000000001';
  c2 UUID := '00000001-0000-4000-8000-000000000002';
  c3 UUID := '00000001-0000-4000-8000-000000000003';
  c4 UUID := '00000001-0000-4000-8000-000000000004';
  c5 UUID := '00000001-0000-4000-8000-000000000005';

  -- Tradie user IDs
  t1  UUID := '00000002-0000-4000-8000-000000000001';
  t2  UUID := '00000002-0000-4000-8000-000000000002';
  t3  UUID := '00000002-0000-4000-8000-000000000003';
  t4  UUID := '00000002-0000-4000-8000-000000000004';
  t5  UUID := '00000002-0000-4000-8000-000000000005';
  t6  UUID := '00000002-0000-4000-8000-000000000006';
  t7  UUID := '00000002-0000-4000-8000-000000000007';
  t8  UUID := '00000002-0000-4000-8000-000000000008';
  t9  UUID := '00000002-0000-4000-8000-000000000009';
  t10 UUID := '00000002-0000-4000-8000-000000000010';

  -- Customer profile IDs
  cp1 UUID := '00000003-0000-4000-8000-000000000001';
  cp2 UUID := '00000003-0000-4000-8000-000000000002';
  cp3 UUID := '00000003-0000-4000-8000-000000000003';
  cp4 UUID := '00000003-0000-4000-8000-000000000004';
  cp5 UUID := '00000003-0000-4000-8000-000000000005';

  -- Tradie profile IDs
  tp1  UUID := '00000004-0000-4000-8000-000000000001';
  tp2  UUID := '00000004-0000-4000-8000-000000000002';
  tp3  UUID := '00000004-0000-4000-8000-000000000003';
  tp4  UUID := '00000004-0000-4000-8000-000000000004';
  tp5  UUID := '00000004-0000-4000-8000-000000000005';
  tp6  UUID := '00000004-0000-4000-8000-000000000006';
  tp7  UUID := '00000004-0000-4000-8000-000000000007';
  tp8  UUID := '00000004-0000-4000-8000-000000000008';
  tp9  UUID := '00000004-0000-4000-8000-000000000009';
  tp10 UUID := '00000004-0000-4000-8000-000000000010';

  -- Address IDs (one per customer)
  a1 UUID := '00000005-0000-4000-8000-000000000001';
  a2 UUID := '00000005-0000-4000-8000-000000000002';
  a3 UUID := '00000005-0000-4000-8000-000000000003';
  a4 UUID := '00000005-0000-4000-8000-000000000004';
  a5 UUID := '00000005-0000-4000-8000-000000000005';

  -- Credits wallet IDs (one per tradie)
  w1  UUID := '00000006-0000-4000-8000-000000000001';
  w2  UUID := '00000006-0000-4000-8000-000000000002';
  w3  UUID := '00000006-0000-4000-8000-000000000003';
  w4  UUID := '00000006-0000-4000-8000-000000000004';
  w5  UUID := '00000006-0000-4000-8000-000000000005';
  w6  UUID := '00000006-0000-4000-8000-000000000006';
  w7  UUID := '00000006-0000-4000-8000-000000000007';
  w8  UUID := '00000006-0000-4000-8000-000000000008';
  w9  UUID := '00000006-0000-4000-8000-000000000009';
  w10 UUID := '00000006-0000-4000-8000-000000000010';

  -- Realtime status IDs
  rs1  UUID := '00000007-0000-4000-8000-000000000001';
  rs2  UUID := '00000007-0000-4000-8000-000000000002';
  rs3  UUID := '00000007-0000-4000-8000-000000000003';
  rs4  UUID := '00000007-0000-4000-8000-000000000004';
  rs5  UUID := '00000007-0000-4000-8000-000000000005';
  rs6  UUID := '00000007-0000-4000-8000-000000000006';
  rs7  UUID := '00000007-0000-4000-8000-000000000007';
  rs8  UUID := '00000007-0000-4000-8000-000000000008';
  rs9  UUID := '00000007-0000-4000-8000-000000000009';
  rs10 UUID := '00000007-0000-4000-8000-000000000010';

  -- Job IDs (20 test jobs)
  j1  UUID := '00000008-0000-4000-8000-000000000001';
  j2  UUID := '00000008-0000-4000-8000-000000000002';
  j3  UUID := '00000008-0000-4000-8000-000000000003';
  j4  UUID := '00000008-0000-4000-8000-000000000004';
  j5  UUID := '00000008-0000-4000-8000-000000000005';
  j6  UUID := '00000008-0000-4000-8000-000000000006';
  j7  UUID := '00000008-0000-4000-8000-000000000007';
  j8  UUID := '00000008-0000-4000-8000-000000000008';
  j9  UUID := '00000008-0000-4000-8000-000000000009';
  j10 UUID := '00000008-0000-4000-8000-000000000010';

BEGIN

  -- ──────────────────────────────────────────────────────────
  -- 1. Auth users (auth schema)
  -- ──────────────────────────────────────────────────────────
  RAISE NOTICE 'Creating auth users...';

  INSERT INTO auth.users (
    id, instance_id, aud, role,
    email, encrypted_password, email_confirmed_at,
    raw_user_meta_data, raw_app_meta_data,
    created_at, updated_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change
  ) VALUES
    -- Customers
    (c1, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'test-customer-1@fixit247.dev', pw_hash, now_ts,
     '{"role":"CUSTOMER","firstName":"Alice","lastName":"Chen","onboardingComplete":true}'::jsonb,
     '{"provider":"email","providers":["email"]}'::jsonb,
     now_ts, now_ts, '', '', '', ''),
    (c2, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'test-customer-2@fixit247.dev', pw_hash, now_ts,
     '{"role":"CUSTOMER","firstName":"Bob","lastName":"Smith","onboardingComplete":true}'::jsonb,
     '{"provider":"email","providers":["email"]}'::jsonb,
     now_ts, now_ts, '', '', '', ''),
    (c3, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'test-customer-3@fixit247.dev', pw_hash, now_ts,
     '{"role":"CUSTOMER","firstName":"Carol","lastName":"Jones","onboardingComplete":true}'::jsonb,
     '{"provider":"email","providers":["email"]}'::jsonb,
     now_ts, now_ts, '', '', '', ''),
    (c4, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'test-customer-4@fixit247.dev', pw_hash, now_ts,
     '{"role":"CUSTOMER","firstName":"Dave","lastName":"Wilson","onboardingComplete":true}'::jsonb,
     '{"provider":"email","providers":["email"]}'::jsonb,
     now_ts, now_ts, '', '', '', ''),
    (c5, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'test-customer-5@fixit247.dev', pw_hash, now_ts,
     '{"role":"CUSTOMER","firstName":"Emma","lastName":"Taylor","onboardingComplete":true}'::jsonb,
     '{"provider":"email","providers":["email"]}'::jsonb,
     now_ts, now_ts, '', '', '', ''),
    -- Tradies
    (t1,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'test-tradie-1@fixit247.dev', pw_hash, now_ts,
     '{"role":"TRADIE","firstName":"Jack","lastName":"Brown","onboardingComplete":true}'::jsonb,
     '{"provider":"email","providers":["email"]}'::jsonb,
     now_ts, now_ts, '', '', '', ''),
    (t2,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'test-tradie-2@fixit247.dev', pw_hash, now_ts,
     '{"role":"TRADIE","firstName":"Sarah","lastName":"Davis","onboardingComplete":true}'::jsonb,
     '{"provider":"email","providers":["email"]}'::jsonb,
     now_ts, now_ts, '', '', '', ''),
    (t3,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'test-tradie-3@fixit247.dev', pw_hash, now_ts,
     '{"role":"TRADIE","firstName":"Mike","lastName":"Wilson","onboardingComplete":true}'::jsonb,
     '{"provider":"email","providers":["email"]}'::jsonb,
     now_ts, now_ts, '', '', '', ''),
    (t4,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'test-tradie-4@fixit247.dev', pw_hash, now_ts,
     '{"role":"TRADIE","firstName":"Lisa","lastName":"Anderson","onboardingComplete":true}'::jsonb,
     '{"provider":"email","providers":["email"]}'::jsonb,
     now_ts, now_ts, '', '', '', ''),
    (t5,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'test-tradie-5@fixit247.dev', pw_hash, now_ts,
     '{"role":"TRADIE","firstName":"Tom","lastName":"Martin","onboardingComplete":true}'::jsonb,
     '{"provider":"email","providers":["email"]}'::jsonb,
     now_ts, now_ts, '', '', '', ''),
    (t6,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'test-tradie-6@fixit247.dev', pw_hash, now_ts,
     '{"role":"TRADIE","firstName":"Grace","lastName":"Lee","onboardingComplete":true}'::jsonb,
     '{"provider":"email","providers":["email"]}'::jsonb,
     now_ts, now_ts, '', '', '', ''),
    (t7,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'test-tradie-7@fixit247.dev', pw_hash, now_ts,
     '{"role":"TRADIE","firstName":"Harry","lastName":"Clark","onboardingComplete":true}'::jsonb,
     '{"provider":"email","providers":["email"]}'::jsonb,
     now_ts, now_ts, '', '', '', ''),
    (t8,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'test-tradie-8@fixit247.dev', pw_hash, now_ts,
     '{"role":"TRADIE","firstName":"Irene","lastName":"Walker","onboardingComplete":true}'::jsonb,
     '{"provider":"email","providers":["email"]}'::jsonb,
     now_ts, now_ts, '', '', '', ''),
    (t9,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'test-tradie-9@fixit247.dev', pw_hash, now_ts,
     '{"role":"TRADIE","firstName":"James","lastName":"Hall","onboardingComplete":true}'::jsonb,
     '{"provider":"email","providers":["email"]}'::jsonb,
     now_ts, now_ts, '', '', '', ''),
    (t10, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'test-tradie-10@fixit247.dev', pw_hash, now_ts,
     '{"role":"TRADIE","firstName":"Karen","lastName":"Young","onboardingComplete":true}'::jsonb,
     '{"provider":"email","providers":["email"]}'::jsonb,
     now_ts, now_ts, '', '', '', '')
  ON CONFLICT (id) DO UPDATE SET
    encrypted_password = EXCLUDED.encrypted_password,
    email_confirmed_at = EXCLUDED.email_confirmed_at;

  -- Auth identities (required for email/password login)
  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, created_at, updated_at, last_sign_in_at)
  VALUES
    (c1::text,  c1,  jsonb_build_object('sub', c1::text,  'email', 'test-customer-1@fixit247.dev'),  'email', 'test-customer-1@fixit247.dev',  now_ts, now_ts, now_ts),
    (c2::text,  c2,  jsonb_build_object('sub', c2::text,  'email', 'test-customer-2@fixit247.dev'),  'email', 'test-customer-2@fixit247.dev',  now_ts, now_ts, now_ts),
    (c3::text,  c3,  jsonb_build_object('sub', c3::text,  'email', 'test-customer-3@fixit247.dev'),  'email', 'test-customer-3@fixit247.dev',  now_ts, now_ts, now_ts),
    (c4::text,  c4,  jsonb_build_object('sub', c4::text,  'email', 'test-customer-4@fixit247.dev'),  'email', 'test-customer-4@fixit247.dev',  now_ts, now_ts, now_ts),
    (c5::text,  c5,  jsonb_build_object('sub', c5::text,  'email', 'test-customer-5@fixit247.dev'),  'email', 'test-customer-5@fixit247.dev',  now_ts, now_ts, now_ts),
    (t1::text,  t1,  jsonb_build_object('sub', t1::text,  'email', 'test-tradie-1@fixit247.dev'),   'email', 'test-tradie-1@fixit247.dev',   now_ts, now_ts, now_ts),
    (t2::text,  t2,  jsonb_build_object('sub', t2::text,  'email', 'test-tradie-2@fixit247.dev'),   'email', 'test-tradie-2@fixit247.dev',   now_ts, now_ts, now_ts),
    (t3::text,  t3,  jsonb_build_object('sub', t3::text,  'email', 'test-tradie-3@fixit247.dev'),   'email', 'test-tradie-3@fixit247.dev',   now_ts, now_ts, now_ts),
    (t4::text,  t4,  jsonb_build_object('sub', t4::text,  'email', 'test-tradie-4@fixit247.dev'),   'email', 'test-tradie-4@fixit247.dev',   now_ts, now_ts, now_ts),
    (t5::text,  t5,  jsonb_build_object('sub', t5::text,  'email', 'test-tradie-5@fixit247.dev'),   'email', 'test-tradie-5@fixit247.dev',   now_ts, now_ts, now_ts),
    (t6::text,  t6,  jsonb_build_object('sub', t6::text,  'email', 'test-tradie-6@fixit247.dev'),   'email', 'test-tradie-6@fixit247.dev',   now_ts, now_ts, now_ts),
    (t7::text,  t7,  jsonb_build_object('sub', t7::text,  'email', 'test-tradie-7@fixit247.dev'),   'email', 'test-tradie-7@fixit247.dev',   now_ts, now_ts, now_ts),
    (t8::text,  t8,  jsonb_build_object('sub', t8::text,  'email', 'test-tradie-8@fixit247.dev'),   'email', 'test-tradie-8@fixit247.dev',   now_ts, now_ts, now_ts),
    (t9::text,  t9,  jsonb_build_object('sub', t9::text,  'email', 'test-tradie-9@fixit247.dev'),   'email', 'test-tradie-9@fixit247.dev',   now_ts, now_ts, now_ts),
    (t10::text, t10, jsonb_build_object('sub', t10::text, 'email', 'test-tradie-10@fixit247.dev'),  'email', 'test-tradie-10@fixit247.dev',  now_ts, now_ts, now_ts)
  ON CONFLICT (provider, provider_id) DO NOTHING;

  RAISE NOTICE 'Auth users done.';

  -- ──────────────────────────────────────────────────────────
  -- 2. Public users
  -- ──────────────────────────────────────────────────────────
  RAISE NOTICE 'Creating public users...';

  INSERT INTO users (id, email, "firstName", "lastName", phone, role, "isActive", "onboardingComplete", "emailVerified", "createdAt", "updatedAt")
  VALUES
    -- Customers
    (c1, 'test-customer-1@fixit247.dev', 'Alice', 'Chen',    '+61411000001', 'CUSTOMER', true, true, now_ts, now_ts, now_ts),
    (c2, 'test-customer-2@fixit247.dev', 'Bob',   'Smith',   '+61411000002', 'CUSTOMER', true, true, now_ts, now_ts, now_ts),
    (c3, 'test-customer-3@fixit247.dev', 'Carol', 'Jones',   '+61411000003', 'CUSTOMER', true, true, now_ts, now_ts, now_ts),
    (c4, 'test-customer-4@fixit247.dev', 'Dave',  'Wilson',  '+61411000004', 'CUSTOMER', true, true, now_ts, now_ts, now_ts),
    (c5, 'test-customer-5@fixit247.dev', 'Emma',  'Taylor',  '+61411000005', 'CUSTOMER', true, true, now_ts, now_ts, now_ts),
    -- Tradies
    (t1,  'test-tradie-1@fixit247.dev',  'Jack',  'Brown',   '+61422000001', 'TRADIE', true, true, now_ts, now_ts, now_ts),
    (t2,  'test-tradie-2@fixit247.dev',  'Sarah', 'Davis',   '+61422000002', 'TRADIE', true, true, now_ts, now_ts, now_ts),
    (t3,  'test-tradie-3@fixit247.dev',  'Mike',  'Wilson',  '+61422000003', 'TRADIE', true, true, now_ts, now_ts, now_ts),
    (t4,  'test-tradie-4@fixit247.dev',  'Lisa',  'Anderson','+61422000004', 'TRADIE', true, true, now_ts, now_ts, now_ts),
    (t5,  'test-tradie-5@fixit247.dev',  'Tom',   'Martin',  '+61422000005', 'TRADIE', true, true, now_ts, now_ts, now_ts),
    (t6,  'test-tradie-6@fixit247.dev',  'Grace', 'Lee',     '+61422000006', 'TRADIE', true, true, now_ts, now_ts, now_ts),
    (t7,  'test-tradie-7@fixit247.dev',  'Harry', 'Clark',   '+61422000007', 'TRADIE', true, true, now_ts, now_ts, now_ts),
    (t8,  'test-tradie-8@fixit247.dev',  'Irene', 'Walker',  '+61422000008', 'TRADIE', true, true, now_ts, now_ts, now_ts),
    (t9,  'test-tradie-9@fixit247.dev',  'James', 'Hall',    '+61422000009', 'TRADIE', true, true, now_ts, now_ts, now_ts),
    (t10, 'test-tradie-10@fixit247.dev', 'Karen', 'Young',   '+61422000010', 'TRADIE', true, true, now_ts, now_ts, now_ts)
  ON CONFLICT (id) DO UPDATE SET
    "firstName" = EXCLUDED."firstName",
    "onboardingComplete" = true;

  RAISE NOTICE 'Public users done.';

  -- ──────────────────────────────────────────────────────────
  -- 3. Addresses (customers only — matching engine uses these coords)
  -- ──────────────────────────────────────────────────────────
  RAISE NOTICE 'Creating addresses...';

  INSERT INTO addresses (id, "userId", street, suburb, city, state, postcode, country, latitude, longitude, "isDefault", "createdAt")
  VALUES
    (a1, c1, '10 Test St', 'Surry Hills',      'Surry Hills',      'NSW', '2010', 'AU', -33.8890, 151.2113, true, now_ts),
    (a2, c2, '20 Test St', 'Fitzroy',           'Fitzroy',           'VIC', '3065', 'AU', -37.7997, 144.9789, true, now_ts),
    (a3, c3, '30 Test St', 'Fortitude Valley',  'Fortitude Valley',  'QLD', '4006', 'AU', -27.4562, 153.0321, true, now_ts),
    (a4, c4, '40 Test St', 'Fremantle',         'Fremantle',         'WA',  '6160', 'AU', -32.0569, 115.7439, true, now_ts),
    (a5, c5, '50 Test St', 'Glenelg',           'Glenelg',           'SA',  '5045', 'AU', -34.9834, 138.5167, true, now_ts)
  ON CONFLICT (id) DO UPDATE SET latitude = EXCLUDED.latitude, longitude = EXCLUDED.longitude;

  RAISE NOTICE 'Addresses done.';

  -- ──────────────────────────────────────────────────────────
  -- 4. Customer profiles
  -- ──────────────────────────────────────────────────────────
  RAISE NOTICE 'Creating customer profiles...';

  INSERT INTO customer_profiles (id, "userId", suburb, postcode, state, "defaultAddressId", "createdAt", "updatedAt")
  VALUES
    (cp1, c1, 'Surry Hills',     '2010', 'NSW', a1, now_ts, now_ts),
    (cp2, c2, 'Fitzroy',          '3065', 'VIC', a2, now_ts, now_ts),
    (cp3, c3, 'Fortitude Valley', '4006', 'QLD', a3, now_ts, now_ts),
    (cp4, c4, 'Fremantle',        '6160', 'WA',  a4, now_ts, now_ts),
    (cp5, c5, 'Glenelg',          '5045', 'SA',  a5, now_ts, now_ts)
  ON CONFLICT (id) DO UPDATE SET "defaultAddressId" = EXCLUDED."defaultAddressId";

  -- Link addresses to customer profiles
  UPDATE addresses SET "customerProfileId" = cp1 WHERE id = a1;
  UPDATE addresses SET "customerProfileId" = cp2 WHERE id = a2;
  UPDATE addresses SET "customerProfileId" = cp3 WHERE id = a3;
  UPDATE addresses SET "customerProfileId" = cp4 WHERE id = a4;
  UPDATE addresses SET "customerProfileId" = cp5 WHERE id = a5;

  RAISE NOTICE 'Customer profiles done.';

  -- ──────────────────────────────────────────────────────────
  -- 5. Tradie profiles
  -- ──────────────────────────────────────────────────────────
  RAISE NOTICE 'Creating tradie profiles...';

  INSERT INTO tradie_profiles (
    id, "userId", "businessName", abn, trades,
    "serviceRadiusKm", "isAvailable", "isEmergencyAvailable",
    "verificationStatus", "onboardingStatus", "onboardingStep",
    "avgRating", "totalReviews", "rankScore", "isVisible",
    "createdAt", "updatedAt"
  ) VALUES
    (tp1,  t1,  'Jack''s Plumbing Services',           '10000000000', ARRAY['PLUMBING']::text[],     25, true, true,  'VERIFIED', 'APPROVED', 5, 4.8, 24, 80, true, now_ts, now_ts),
    (tp2,  t2,  'Sarah''s Electrical Services',        '10000000011', ARRAY['ELECTRICAL']::text[],   25, true, false, 'VERIFIED', 'APPROVED', 5, 4.7, 21, 77, true, now_ts, now_ts),
    (tp3,  t3,  'Mike''s Locksmith Services',          '10000000022', ARRAY['LOCKSMITH']::text[],    25, true, true,  'VERIFIED', 'APPROVED', 5, 4.6, 18, 74, true, now_ts, now_ts),
    (tp4,  t4,  'Lisa''s HVAC Services',               '10000000033', ARRAY['HVAC']::text[],         25, true, false, 'VERIFIED', 'APPROVED', 5, 4.5, 15, 71, true, now_ts, now_ts),
    (tp5,  t5,  'Tom''s Roofing Services',             '10000000044', ARRAY['ROOFING']::text[],      25, true, true,  'VERIFIED', 'APPROVED', 5, 4.4, 12, 68, true, now_ts, now_ts),
    (tp6,  t6,  'Grace''s Plumbing Services',          '10000000055', ARRAY['PLUMBING']::text[],     25, true, false, 'VERIFIED', 'APPROVED', 5, 4.3,  9, 65, true, now_ts, now_ts),
    (tp7,  t7,  'Harry''s Electrical Services',        '10000000066', ARRAY['ELECTRICAL']::text[],   25, true, true,  'VERIFIED', 'APPROVED', 5, 4.2,  6, 62, true, now_ts, now_ts),
    (tp8,  t8,  'Irene''s Carpentry Services',         '10000000077', ARRAY['CARPENTRY']::text[],    25, true, false, 'VERIFIED', 'APPROVED', 5, 4.1,  3, 59, true, now_ts, now_ts),
    (tp9,  t9,  'James''s Plastering Services',        '10000000088', ARRAY['PLASTERING']::text[],   25, true, true,  'VERIFIED', 'APPROVED', 5, 4.0,  0, 56, true, now_ts, now_ts),
    (tp10, t10, 'Karen''s Pest Control Services',      '10000000099', ARRAY['PEST_CONTROL']::text[], 25, true, false, 'VERIFIED', 'APPROVED', 5, 3.9,  0, 53, true, now_ts, now_ts)
  ON CONFLICT (id) DO UPDATE SET
    "verificationStatus" = 'VERIFIED',
    "onboardingStatus"   = 'APPROVED',
    "isVisible"          = true;

  RAISE NOTICE 'Tradie profiles done.';

  -- ──────────────────────────────────────────────────────────
  -- 6. Credits wallets (tradies)
  -- ──────────────────────────────────────────────────────────
  RAISE NOTICE 'Creating wallets...';

  INSERT INTO credits_wallets (id, "userId", balance, "lifetimeEarned", "lifetimeSpent", "updatedAt")
  VALUES
    (w1,  t1,  60, 70, 10, now_ts),
    (w2,  t2,  55, 65, 10, now_ts),
    (w3,  t3,  50, 60, 10, now_ts),
    (w4,  t4,  45, 55, 10, now_ts),
    (w5,  t5,  40, 50, 10, now_ts),
    (w6,  t6,  35, 45, 10, now_ts),
    (w7,  t7,  30, 40, 10, now_ts),
    (w8,  t8,  25, 35, 10, now_ts),
    (w9,  t9,  20, 30, 10, now_ts),
    (w10, t10, 15, 25, 10, now_ts)
  ON CONFLICT (id) DO NOTHING;

  RAISE NOTICE 'Wallets done.';

  -- ──────────────────────────────────────────────────────────
  -- 7. Tradie realtime status (critical for matching engine)
  -- ──────────────────────────────────────────────────────────
  RAISE NOTICE 'Creating realtime status...';

  INSERT INTO tradie_realtime_status (
    id, "tradieId", "onlineStatus",
    "currentLatitude", "currentLongitude",
    "activeJobCount", "travelRadiusKm",
    "lastHeartbeatAt", "updatedAt"
  ) VALUES
    (rs1,  tp1,  'ONLINE', -33.8750, 151.2050, 0, 25, now_ts, now_ts),
    (rs2,  tp2,  'ONLINE', -33.8700, 151.2200, 0, 25, now_ts, now_ts),
    (rs3,  tp3,  'ONLINE', -37.8100, 144.9600, 0, 25, now_ts, now_ts),
    (rs4,  tp4,  'ONLINE', -37.8050, 144.9900, 0, 25, now_ts, now_ts),
    (rs5,  tp5,  'ONLINE', -27.4700, 153.0200, 0, 25, now_ts, now_ts),
    (rs6,  tp6,  'ONLINE', -27.4450, 153.0400, 0, 25, now_ts, now_ts),
    (rs7,  tp7,  'ONLINE', -32.0650, 115.7300, 0, 25, now_ts, now_ts),
    (rs8,  tp8,  'ONLINE', -32.0450, 115.7550, 0, 25, now_ts, now_ts),
    (rs9,  tp9,  'ONLINE', -34.9700, 138.5050, 0, 25, now_ts, now_ts),
    (rs10, tp10, 'ONLINE', -34.9900, 138.5300, 0, 25, now_ts, now_ts)
  ON CONFLICT ("tradieId") DO UPDATE SET
    "onlineStatus"     = 'ONLINE',
    "lastHeartbeatAt"  = now(),
    "activeJobCount"   = 0;

  RAISE NOTICE 'Realtime status done.';

  -- ──────────────────────────────────────────────────────────
  -- 8. Credit packages
  -- ──────────────────────────────────────────────────────────
  RAISE NOTICE 'Seeding credit packages...';

  INSERT INTO credit_packages (id, name, credits, "priceAud", "bonusCredits", "isPopular", "isActive", "displayOrder", "createdAt")
  VALUES
    ('00000009-0000-4000-8000-000000000001', 'Starter Pack', 10, 49,  0, false, true, 1, now_ts),
    ('00000009-0000-4000-8000-000000000002', 'Pro Pack',     22, 99,  2, true,  true, 2, now_ts),
    ('00000009-0000-4000-8000-000000000003', 'Elite Pack',   35, 149, 5, false, true, 3, now_ts)
  ON CONFLICT (id) DO UPDATE SET
    "isActive" = true,
    "isPopular" = EXCLUDED."isPopular";

  -- Deactivate any other packages
  UPDATE credit_packages SET "isActive" = false
  WHERE id NOT IN (
    '00000009-0000-4000-8000-000000000001',
    '00000009-0000-4000-8000-000000000002',
    '00000009-0000-4000-8000-000000000003'
  );

  RAISE NOTICE 'Credit packages done.';

  -- ──────────────────────────────────────────────────────────
  -- 9. Test jobs (mix of OPEN/CLAIMED/COMPLETED)
  -- ──────────────────────────────────────────────────────────
  RAISE NOTICE 'Creating test jobs...';

  INSERT INTO jobs (
    id, "customerId", "addressId",
    title, description, category, status, priority, "isEmergency",
    complexity, "budgetMin", "budgetMax",
    "createdAt", "updatedAt"
  ) VALUES
    (j1, cp1, a1, 'Burst pipe in bathroom — urgent',
     'Water is gushing from under the sink. Need urgent help.', 'PLUMBING', 'OPEN', 'EMERGENCY', true, 'MEDIUM', 200, 400, now_ts, now_ts),
    (j2, cp2, a2, 'Power outage in kitchen',
     'Kitchen circuit tripped and won''t reset. Food spoiling.', 'ELECTRICAL', 'OPEN', 'URGENT', false, 'MEDIUM', 150, 300, now_ts, now_ts),
    (j3, cp3, a3, 'Locked out of house',
     'Left keys inside, need locksmith ASAP.', 'LOCKSMITH', 'OPEN', 'URGENT', false, 'LOW', 100, 200, now_ts, now_ts),
    (j4, cp4, a4, 'AC not cooling — heat advisory',
     'Air conditioner running but not cooling. 40 degree day.', 'HVAC', 'OPEN', 'URGENT', false, 'MEDIUM', 180, 350, now_ts, now_ts),
    (j5, cp5, a5, 'Roof leak after storm',
     'Water coming through ceiling in lounge after last night''s storm.', 'ROOFING', 'OPEN', 'EMERGENCY', true, 'HIGH', 300, 600, now_ts, now_ts),
    (j6, cp1, a1, 'Blocked drain in laundry',
     'Laundry trough draining very slowly, possible blockage.', 'PLUMBING', 'OPEN', 'STANDARD', false, 'LOW', 80, 150, now_ts, now_ts),
    (j7, cp2, a2, 'Sparking powerpoint',
     'Sparks visible when plugging in appliances. Dangerous.', 'ELECTRICAL', 'OPEN', 'EMERGENCY', true, 'MEDIUM', 150, 250, now_ts, now_ts),
    (j8, cp3, a3, 'Hot water system replacement',
     'Hot water system stopped working yesterday. Cold showers!', 'PLUMBING', 'OPEN', 'URGENT', false, 'HIGH', 800, 1500, now_ts, now_ts),
    (j9, cp4, a4, 'Ceiling fan installation',
     'Need a ceiling fan installed in master bedroom.', 'ELECTRICAL', 'OPEN', 'STANDARD', false, 'LOW', 120, 200, now_ts, now_ts),
    (j10, cp5, a5, 'Pest inspection — termites',
     'Noticed what looks like termite damage near window frame.', 'PEST_CONTROL', 'OPEN', 'URGENT', false, 'MEDIUM', 200, 400, now_ts, now_ts)
  ON CONFLICT (id) DO NOTHING;

  RAISE NOTICE 'Test jobs done.';

  RAISE NOTICE '==============================================';
  RAISE NOTICE 'Seed complete! 15 users, 5 addresses, 10 jobs';
  RAISE NOTICE 'Login: test-customer-{1-5}@fixit247.dev';
  RAISE NOTICE '        test-tradie-{1-10}@fixit247.dev';
  RAISE NOTICE 'Password: Fixit247!Test';
  RAISE NOTICE '==============================================';

END $$;
