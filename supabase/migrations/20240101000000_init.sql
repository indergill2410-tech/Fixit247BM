-- ============================================================
-- Fixit247BM — Initial Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- Then run: pnpm db:migrate to apply Prisma migrations
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";
create extension if not exists "postgis";

-- ── Enums ────────────────────────────────────────────────────
create type "Role" as enum ('CUSTOMER', 'TRADIE', 'ADMIN', 'SUPER_ADMIN');

create type "JobStatus" as enum (
  'DRAFT', 'OPEN', 'CLAIMED', 'IN_PROGRESS',
  'PENDING_REVIEW', 'COMPLETED', 'CANCELLED', 'DISPUTED'
);

create type "JobPriority" as enum ('STANDARD', 'URGENT', 'EMERGENCY');

create type "TradeCategory" as enum (
  'PLUMBING', 'ELECTRICAL', 'HVAC', 'CARPENTRY', 'PAINTING',
  'ROOFING', 'TILING', 'PEST_CONTROL', 'LOCKSMITH', 'GLAZING',
  'PLASTERING', 'LANDSCAPING', 'CLEANING', 'APPLIANCE_REPAIR',
  'GENERAL_MAINTENANCE', 'OTHER'
);

create type "VerificationStatus" as enum (
  'UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED'
);

create type "PaymentStatus" as enum (
  'PENDING', 'PROCESSING', 'HELD_IN_ESCROW', 'RELEASED',
  'REFUNDED', 'DISPUTED', 'FAILED'
);

create type "NotificationType" as enum (
  'JOB_CREATED', 'JOB_ASSIGNED', 'JOB_ACCEPTED', 'JOB_DECLINED',
  'TRADIE_EN_ROUTE', 'TRADIE_ARRIVED', 'JOB_STARTED', 'JOB_COMPLETED',
  'PAYMENT_HELD', 'PAYMENT_RELEASED', 'PAYMENT_FAILED',
  'DISPUTE_OPENED', 'DISPUTE_RESOLVED', 'NEW_MESSAGE',
  'CREDIT_LOW', 'SUBSCRIPTION_RENEWED',
  'VERIFICATION_APPROVED', 'VERIFICATION_REJECTED', 'SYSTEM_ALERT'
);

create type "SubscriptionTier" as enum ('FREE', 'BASIC', 'PROFESSIONAL', 'ELITE');
create type "SubscriptionStatus" as enum ('ACTIVE', 'PAST_DUE', 'CANCELLED', 'TRIALING', 'INCOMPLETE');
create type "DisputeStatus" as enum ('OPEN', 'UNDER_REVIEW', 'RESOLVED_CUSTOMER', 'RESOLVED_TRADIE', 'ESCALATED', 'CLOSED');
create type "DisputeReason" as enum ('INCOMPLETE_WORK', 'NO_SHOW', 'PAYMENT_DISAGREEMENT', 'DAMAGE_CAUSED', 'UNPROFESSIONAL_CONDUCT', 'OVERCHARGING', 'WRONG_TRADE', 'OTHER');
create type "FraudType" as enum ('FAKE_JOB', 'DUPLICATE_ACCOUNT', 'PAYMENT_ABUSE', 'REVIEW_MANIPULATION', 'IDENTITY_FRAUD', 'CREDENTIAL_FRAUD', 'COLLUSION', 'CHARGEBACK_ABUSE', 'SPAM', 'IMPERSONATION', 'PRICE_GOUGING', 'OTHER');
create type "RiskLevel" as enum ('SAFE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'LIFE_THREATENING');
create type "VoiceCallStatus" as enum ('INITIATED', 'RINGING', 'IN_PROGRESS', 'AI_HANDLING', 'HUMAN_TAKEOVER', 'COMPLETED', 'FAILED', 'ABANDONED');
create type "ModerationAction" as enum ('WARNING', 'CONTENT_REMOVED', 'TEMPORARY_SUSPEND', 'PERMANENT_BAN', 'ACCOUNT_RESTRICTED', 'CLEARED');
create type "SupportTicketStatus" as enum ('OPEN', 'IN_PROGRESS', 'WAITING_CUSTOMER', 'RESOLVED', 'CLOSED');
create type "SupportTicketPriority" as enum ('LOW', 'NORMAL', 'HIGH', 'URGENT');
create type "CampaignStatus" as enum ('DRAFT', 'SCHEDULED', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED');

-- ── Row Level Security helper function ───────────────────────
-- Allows Prisma service role to bypass RLS
create or replace function auth.is_service_role()
returns boolean as $$
  select current_setting('request.jwt.claims', true)::json->>'role' = 'service_role';
$$ language sql security definer;

-- ── Indexes for full-text search (created after Prisma migrations) ────────────
-- Run these AFTER running `pnpm db:migrate` to apply Prisma migrations:
--
-- create index concurrently idx_job_suburb_trgm on "Job" using gin (suburb gin_trgm_ops);
-- create index concurrently idx_job_description_trgm on "Job" using gin (description gin_trgm_ops);
-- create index concurrently idx_tradie_suburb_trgm on "TradieProfile" using gin ("primarySuburb" gin_trgm_ops);
-- create index concurrently idx_user_email_trgm on "User" using gin (email gin_trgm_ops);

-- ── Storage buckets ───────────────────────────────────────────
insert into storage.buckets (id, name, public)
values
  ('job-images', 'job-images', true),
  ('tradie-documents', 'tradie-documents', false),
  ('tradie-avatars', 'tradie-avatars', true),
  ('portfolio-images', 'portfolio-images', true)
on conflict (id) do nothing;

-- ── Storage RLS policies ──────────────────────────────────────
create policy "Job images are publicly viewable"
  on storage.objects for select
  using (bucket_id = 'job-images');

create policy "Authenticated users can upload job images"
  on storage.objects for insert
  with check (bucket_id = 'job-images' and auth.role() = 'authenticated');

create policy "Tradie avatars are publicly viewable"
  on storage.objects for select
  using (bucket_id = 'tradie-avatars');

create policy "Tradies can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'tradie-avatars'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Portfolio images are publicly viewable"
  on storage.objects for select
  using (bucket_id = 'portfolio-images');

create policy "Tradies can upload portfolio images"
  on storage.objects for insert
  with check (bucket_id = 'portfolio-images' and auth.role() = 'authenticated');

create policy "Tradie documents are private — owner only"
  on storage.objects for select
  using (
    bucket_id = 'tradie-documents'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Tradies can upload their own documents"
  on storage.objects for insert
  with check (
    bucket_id = 'tradie-documents'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ── Next steps ────────────────────────────────────────────────
-- 1. Copy .env.example to .env.local and fill in Supabase credentials
-- 2. Set DATABASE_URL and DIRECT_URL from Supabase → Settings → Database
-- 3. Run: pnpm db:generate   (generates Prisma client)
-- 4. Run: pnpm db:migrate    (creates all 120+ tables via Prisma)
-- 5. Run: pnpm db:seed       (seeds dev data)
