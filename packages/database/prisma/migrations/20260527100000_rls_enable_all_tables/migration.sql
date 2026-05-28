-- ============================================================================
-- FIX-20: Enable Row Level Security on all 57 tables
-- ============================================================================
-- ARCHITECTURE NOTE
-- -----------------
-- Two completely separate data paths exist in this application:
--
--   1. Prisma (db.*) — connects as the `postgres` superuser via PgBouncer.
--      The superuser role is exempt from RLS by default (plain ENABLE, not FORCE).
--      These queries are UNAFFECTED by this migration.
--
--   2. Supabase PostgREST (supabase.from()) — uses the anon or user JWT.
--      RLS IS enforced. Only one table is legitimately queried this way
--      from within the app: `users` (middleware role-check). All other
--      tables have default-deny with no policies, blocking external REST attacks.
--
-- DO NOT add FORCE ROW LEVEL SECURITY to any table. FORCE removes the postgres
-- superuser exemption that Prisma depends on for every data operation.
--
-- APPLY ORDER
-- -----------
-- Phases 1–4 are pure ENABLE statements with no policies — zero risk.
-- Apply them together, run verify-rls.sh tests A and B, confirm app health.
-- Then apply Phase 5 (users) and re-run verify-rls.sh in full.
--
-- Each phase section is self-contained and can be pasted independently
-- into the Supabase SQL editor.
-- ============================================================================


-- ============================================================================
-- PHASE 1: Config / lookup tables (11 tables)
-- ============================================================================
-- These are platform-managed, Prisma-only. No user ever needs PostgREST access.
-- ============================================================================

ALTER TABLE "emergency_settings"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "platform_config"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "trade_category_configs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "marketing_campaigns"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "surge_pricing_rules"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "platform_alerts"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "seo_pages"              ENABLE ROW LEVEL SECURITY;
ALTER TABLE "suburb_metrics"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "credit_packages"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "referral_programs"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "stripe_processed_events" ENABLE ROW LEVEL SECURITY;


-- ============================================================================
-- PHASE 2: Internal / audit tables (9 tables)
-- ============================================================================
-- audit_logs is written and read via the service-role client, which
-- automatically bypasses RLS — no policy is needed.
-- All other tables are Prisma-only.
-- ============================================================================

ALTER TABLE "audit_logs"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE "admin_audit_log"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "job_matching_queue"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "job_status_history"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ai_job_insights"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "voice_calls"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "voice_events"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "emergency_assessments"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ai_conversations"       ENABLE ROW LEVEL SECURITY;


-- ============================================================================
-- PHASE 3: Transactional tables (21 tables)
-- ============================================================================
-- All accessed exclusively via Prisma. Default-deny blocks any external
-- REST attempt without affecting any in-app query.
-- ============================================================================

ALTER TABLE "jobs"               ENABLE ROW LEVEL SECURITY;
ALTER TABLE "job_claims"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "job_events"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "job_images"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "payments"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "transactions"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE "payouts"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "subscriptions"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "messages"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "reviews"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "review_requests"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "disputes"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "fraud_flags"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "moderation_actions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "support_tickets"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "support_messages"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "referrals"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "growth_events"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "location_tracking"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "trust_score_history" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "sessions"           ENABLE ROW LEVEL SECURITY;


-- ============================================================================
-- PHASE 4: Profile / preference tables (15 tables)
-- ============================================================================
-- All accessed exclusively via Prisma. Ownership columns exist (userId,
-- tradieId, customerId) but no PostgREST queries use them, so no policies
-- are needed at this stage.
-- ============================================================================

ALTER TABLE "customer_profiles"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tradie_profiles"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "addresses"                ENABLE ROW LEVEL SECURITY;
ALTER TABLE "certifications"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "licences"                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE "insurances"               ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tradie_documents"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tradie_portfolios"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "availability"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tradie_realtime_status"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "saved_tradies"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "notifications"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "notification_preferences" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "credits_wallets"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "credit_ledger"            ENABLE ROW LEVEL SECURITY;


-- ============================================================================
-- PHASE 5: users table (1 table + 1 policy)
-- ============================================================================
-- This is the ONLY table queried via PostgREST from within the app:
--
--   middleware.ts:247
--     supabase.from('users')
--       .select('role, onboarding_complete')
--       .eq('id', user.id)
--       .single()
--
-- The Supabase client (createServerClient) passes the user's session JWT as
-- the Authorization header, so auth.uid() resolves to the logged-in user's id.
-- The policy below allows exactly this read and nothing else.
--
-- PLAIN ENABLE (not FORCE) — preserves the postgres superuser bypass that
-- Prisma depends on for all writes and reads to this table.
--
-- No INSERT/UPDATE/DELETE policies are added. All writes to the users table
-- go through Prisma (db.user.upsert/update) or the Supabase auth system,
-- neither of which is affected by table-level RLS.
-- ============================================================================

ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;

-- Authenticated users may SELECT their own row only.
-- auth.uid() is populated from the JWT that @supabase/ssr passes in the
-- Authorization header when middleware.ts calls supabase.from('users').
CREATE POLICY "users_select_own"
  ON "users"
  FOR SELECT
  USING (auth.uid() = id);


-- ============================================================================
-- ============================================================================
-- ROLLBACK STATEMENTS
-- ============================================================================
-- ============================================================================
-- To revert, uncomment the relevant block and run it.
-- Phases are in reverse order (5 → 1). Each block is independent.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- ROLLBACK PHASE 5: users
-- ----------------------------------------------------------------------------
-- DROP POLICY IF EXISTS "users_select_own" ON "users";
-- ALTER TABLE "users" DISABLE ROW LEVEL SECURITY;


-- ----------------------------------------------------------------------------
-- ROLLBACK PHASE 4: profile / preference tables
-- ----------------------------------------------------------------------------
-- ALTER TABLE "credit_ledger"            DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "credits_wallets"          DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "notification_preferences" DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "notifications"            DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "saved_tradies"            DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "tradie_realtime_status"   DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "availability"             DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "tradie_portfolios"        DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "tradie_documents"         DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "insurances"               DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "licences"                 DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "certifications"           DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "addresses"                DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "tradie_profiles"          DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "customer_profiles"        DISABLE ROW LEVEL SECURITY;


-- ----------------------------------------------------------------------------
-- ROLLBACK PHASE 3: transactional tables
-- ----------------------------------------------------------------------------
-- ALTER TABLE "sessions"            DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "trust_score_history" DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "location_tracking"   DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "growth_events"       DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "referrals"           DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "support_messages"    DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "support_tickets"     DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "moderation_actions"  DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "fraud_flags"         DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "disputes"            DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "review_requests"     DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "reviews"             DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "messages"            DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "subscriptions"       DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "payouts"             DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "transactions"        DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "payments"            DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "job_images"          DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "job_events"          DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "job_claims"          DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "jobs"                DISABLE ROW LEVEL SECURITY;


-- ----------------------------------------------------------------------------
-- ROLLBACK PHASE 2: internal / audit tables
-- ----------------------------------------------------------------------------
-- ALTER TABLE "ai_conversations"      DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "emergency_assessments" DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "voice_events"          DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "voice_calls"           DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "ai_job_insights"       DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "job_status_history"    DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "job_matching_queue"    DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "admin_audit_log"       DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "audit_logs"            DISABLE ROW LEVEL SECURITY;


-- ----------------------------------------------------------------------------
-- ROLLBACK PHASE 1: config / lookup tables
-- ----------------------------------------------------------------------------
-- ALTER TABLE "stripe_processed_events"  DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "referral_programs"        DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "credit_packages"          DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "suburb_metrics"           DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "seo_pages"                DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "platform_alerts"          DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "surge_pricing_rules"      DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "marketing_campaigns"      DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "trade_category_configs"   DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "platform_config"          DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "emergency_settings"       DISABLE ROW LEVEL SECURITY;
