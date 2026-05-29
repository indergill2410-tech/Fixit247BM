-- Migration: Full RLS Policies for all 58 tables
-- RLS is already ENABLED on all tables. This migration adds the actual row-level policies.
-- Uses (SELECT auth.uid()) pattern for performance (evaluated once per query, not per row)

-- ─────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
CREATE POLICY "Users can read own profile"
  ON public.users FOR SELECT
  USING (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Service role full access users" ON public.users;
CREATE POLICY "Service role full access users"
  ON public.users FOR ALL
  USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────
-- CUSTOMER PROFILES
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Customers read own profile" ON public.customer_profiles;
CREATE POLICY "Customers read own profile"
  ON public.customer_profiles FOR SELECT
  USING ("userId" = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Customers update own profile" ON public.customer_profiles;
CREATE POLICY "Customers update own profile"
  ON public.customer_profiles FOR UPDATE
  USING ("userId" = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Service role full access customer_profiles" ON public.customer_profiles;
CREATE POLICY "Service role full access customer_profiles"
  ON public.customer_profiles FOR ALL
  USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────
-- TRADIE PROFILES
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Tradies read own profile" ON public.tradie_profiles;
CREATE POLICY "Tradies read own profile"
  ON public.tradie_profiles FOR SELECT
  USING ("userId" = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Tradie profiles public read" ON public.tradie_profiles;
CREATE POLICY "Tradie profiles public read"
  ON public.tradie_profiles FOR SELECT
  USING ("onboardingStatus" = 'APPROVED');

DROP POLICY IF EXISTS "Tradies update own profile" ON public.tradie_profiles;
CREATE POLICY "Tradies update own profile"
  ON public.tradie_profiles FOR UPDATE
  USING ("userId" = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Service role full access tradie_profiles" ON public.tradie_profiles;
CREATE POLICY "Service role full access tradie_profiles"
  ON public.tradie_profiles FOR ALL
  USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────
-- ADDRESSES
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Users read own addresses" ON public.addresses;
CREATE POLICY "Users read own addresses"
  ON public.addresses FOR SELECT
  USING ("userId" = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users manage own addresses" ON public.addresses;
CREATE POLICY "Users manage own addresses"
  ON public.addresses FOR ALL
  USING ("userId" = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Service role full access addresses" ON public.addresses;
CREATE POLICY "Service role full access addresses"
  ON public.addresses FOR ALL
  USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────
-- JOBS
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Users can read relevant jobs" ON public.jobs;
CREATE POLICY "Users can read relevant jobs"
  ON public.jobs FOR SELECT
  USING (
    "customerId" = (SELECT auth.uid())
    OR "tradieId" = (SELECT auth.uid())
    OR status IN ('OPEN', 'CLAIMED')
  );

DROP POLICY IF EXISTS "Customers create jobs" ON public.jobs;
CREATE POLICY "Customers create jobs"
  ON public.jobs FOR INSERT
  WITH CHECK ("customerId" = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Owners update own jobs" ON public.jobs;
CREATE POLICY "Owners update own jobs"
  ON public.jobs FOR UPDATE
  USING (
    "customerId" = (SELECT auth.uid())
    OR "tradieId" = (SELECT auth.uid())
  );

DROP POLICY IF EXISTS "Service role full access jobs" ON public.jobs;
CREATE POLICY "Service role full access jobs"
  ON public.jobs FOR ALL
  USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────
-- MESSAGES
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Participants read messages" ON public.messages;
CREATE POLICY "Participants read messages"
  ON public.messages FOR SELECT
  USING (
    "senderId" = (SELECT auth.uid())
    OR "receiverId" = (SELECT auth.uid())
  );

DROP POLICY IF EXISTS "Users send messages" ON public.messages;
CREATE POLICY "Users send messages"
  ON public.messages FOR INSERT
  WITH CHECK ("senderId" = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Service role full access messages" ON public.messages;
CREATE POLICY "Service role full access messages"
  ON public.messages FOR ALL
  USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────
-- PAYMENTS
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Users read own payments" ON public.payments;
CREATE POLICY "Users read own payments"
  ON public.payments FOR SELECT
  USING (
    "customerId" = (SELECT auth.uid())
    OR "tradieId" = (SELECT auth.uid())
  );

DROP POLICY IF EXISTS "Service role full access payments" ON public.payments;
CREATE POLICY "Service role full access payments"
  ON public.payments FOR ALL
  USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────
-- REVIEWS
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Public read reviews" ON public.reviews;
CREATE POLICY "Public read reviews"
  ON public.reviews FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Customers write own reviews" ON public.reviews;
CREATE POLICY "Customers write own reviews"
  ON public.reviews FOR INSERT
  WITH CHECK ("reviewerId" = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Service role full access reviews" ON public.reviews;
CREATE POLICY "Service role full access reviews"
  ON public.reviews FOR ALL
  USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────
-- NOTIFICATIONS
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Users read own notifications" ON public.notifications;
CREATE POLICY "Users read own notifications"
  ON public.notifications FOR SELECT
  USING ("userId" = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users update own notifications" ON public.notifications;
CREATE POLICY "Users update own notifications"
  ON public.notifications FOR UPDATE
  USING ("userId" = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Service role full access notifications" ON public.notifications;
CREATE POLICY "Service role full access notifications"
  ON public.notifications FOR ALL
  USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────
-- CREDITS WALLETS
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Users read own wallet" ON public.credits_wallets;
CREATE POLICY "Users read own wallet"
  ON public.credits_wallets FOR SELECT
  USING ("userId" = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Service role full access credits_wallets" ON public.credits_wallets;
CREATE POLICY "Service role full access credits_wallets"
  ON public.credits_wallets FOR ALL
  USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────
-- CREDIT TRANSACTIONS
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Users read own credit transactions" ON public.credit_transactions;
CREATE POLICY "Users read own credit transactions"
  ON public.credit_transactions FOR SELECT
  USING ("userId" = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Service role full access credit_transactions" ON public.credit_transactions;
CREATE POLICY "Service role full access credit_transactions"
  ON public.credit_transactions FOR ALL
  USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────
-- SUBSCRIPTIONS
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Users read own subscriptions" ON public.subscriptions;
CREATE POLICY "Users read own subscriptions"
  ON public.subscriptions FOR SELECT
  USING ("userId" = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Service role full access subscriptions" ON public.subscriptions;
CREATE POLICY "Service role full access subscriptions"
  ON public.subscriptions FOR ALL
  USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────
-- AVAILABILITY
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Public read availability" ON public.availability;
CREATE POLICY "Public read availability"
  ON public.availability FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Tradies manage own availability" ON public.availability;
CREATE POLICY "Tradies manage own availability"
  ON public.availability FOR ALL
  USING ("tradieId" = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Service role full access availability" ON public.availability;
CREATE POLICY "Service role full access availability"
  ON public.availability FOR ALL
  USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────
-- TRADIE PORTFOLIOS
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Public read portfolios" ON public.tradie_portfolios;
CREATE POLICY "Public read portfolios"
  ON public.tradie_portfolios FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Tradies manage own portfolios" ON public.tradie_portfolios;
CREATE POLICY "Tradies manage own portfolios"
  ON public.tradie_portfolios FOR ALL
  USING ("tradieId" = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Service role full access tradie_portfolios" ON public.tradie_portfolios;
CREATE POLICY "Service role full access tradie_portfolios"
  ON public.tradie_portfolios FOR ALL
  USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────
-- DISPUTES
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Participants read own disputes" ON public.disputes;
CREATE POLICY "Participants read own disputes"
  ON public.disputes FOR SELECT
  USING (
    "raisedById" = (SELECT auth.uid())
    OR "againstId" = (SELECT auth.uid())
  );

DROP POLICY IF EXISTS "Users raise disputes" ON public.disputes;
CREATE POLICY "Users raise disputes"
  ON public.disputes FOR INSERT
  WITH CHECK ("raisedById" = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Service role full access disputes" ON public.disputes;
CREATE POLICY "Service role full access disputes"
  ON public.disputes FOR ALL
  USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────
-- REFERRALS
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Users read own referrals" ON public.referrals;
CREATE POLICY "Users read own referrals"
  ON public.referrals FOR SELECT
  USING (
    "referrerId" = (SELECT auth.uid())
    OR "invitedUserId" = (SELECT auth.uid())
  );

DROP POLICY IF EXISTS "Service role full access referrals" ON public.referrals;
CREATE POLICY "Service role full access referrals"
  ON public.referrals FOR ALL
  USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────
-- AUDIT LOGS (system insert only)
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Users read own audit logs" ON public.audit_logs;
CREATE POLICY "Users read own audit logs"
  ON public.audit_logs FOR SELECT
  USING ("userId" = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Service role full access audit_logs" ON public.audit_logs;
CREATE POLICY "Service role full access audit_logs"
  ON public.audit_logs FOR ALL
  USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────
-- JOB EVENTS (system insert only)
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Participants read job events" ON public.job_events;
CREATE POLICY "Participants read job events"
  ON public.job_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs j
      WHERE j.id = "jobId"
      AND (j."customerId" = (SELECT auth.uid()) OR j."tradieId" = (SELECT auth.uid()))
    )
  );

DROP POLICY IF EXISTS "Service role full access job_events" ON public.job_events;
CREATE POLICY "Service role full access job_events"
  ON public.job_events FOR ALL
  USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────
-- VOICE CALLS
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Participants read own voice calls" ON public.voice_calls;
CREATE POLICY "Participants read own voice calls"
  ON public.voice_calls FOR SELECT
  USING (
    "callerId" = (SELECT auth.uid())
    OR "receiverId" = (SELECT auth.uid())
  );

DROP POLICY IF EXISTS "Service role full access voice_calls" ON public.voice_calls;
CREATE POLICY "Service role full access voice_calls"
  ON public.voice_calls FOR ALL
  USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────
-- AI CONVERSATIONS
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Users read own ai conversations" ON public.ai_conversations;
CREATE POLICY "Users read own ai conversations"
  ON public.ai_conversations FOR SELECT
  USING ("userId" = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Service role full access ai_conversations" ON public.ai_conversations;
CREATE POLICY "Service role full access ai_conversations"
  ON public.ai_conversations FOR ALL
  USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────
-- GROWTH EVENTS
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Users read own growth events" ON public.growth_events;
CREATE POLICY "Users read own growth events"
  ON public.growth_events FOR SELECT
  USING ("userId" = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Service role insert growth events" ON public.growth_events;
CREATE POLICY "Service role insert growth events"
  ON public.growth_events FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access growth_events" ON public.growth_events;
CREATE POLICY "Service role full access growth_events"
  ON public.growth_events FOR ALL
  USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────
-- FRAUD FLAGS (admin only)
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Admin only fraud_flags" ON public.fraud_flags;
CREATE POLICY "Admin only fraud_flags"
  ON public.fraud_flags FOR ALL
  USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────
-- MODERATION ACTIONS (admin only)
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Admin only moderation_actions" ON public.moderation_actions;
CREATE POLICY "Admin only moderation_actions"
  ON public.moderation_actions FOR ALL
  USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────
-- ADMIN AUDIT LOG (admin only)
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Admin only admin_audit_log" ON public.admin_audit_log;
CREATE POLICY "Admin only admin_audit_log"
  ON public.admin_audit_log FOR ALL
  USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────
-- MARKETING CAMPAIGNS (admin only)
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Admin only marketing_campaigns" ON public.marketing_campaigns;
CREATE POLICY "Admin only marketing_campaigns"
  ON public.marketing_campaigns FOR ALL
  USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────
-- NOTIFICATION PREFERENCES
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Users manage own notification prefs" ON public.notification_preferences;
CREATE POLICY "Users manage own notification prefs"
  ON public.notification_preferences FOR ALL
  USING ("userId" = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Service role full access notification_preferences" ON public.notification_preferences;
CREATE POLICY "Service role full access notification_preferences"
  ON public.notification_preferences FOR ALL
  USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────
-- TRADE CATEGORY CONFIGS (public read)
-- ─────────────────────────────────────────
DROP POLICY IF EXISTS "Public read trade_category_configs" ON public.trade_category_configs;
CREATE POLICY "Public read trade_category_configs"
  ON public.trade_category_configs FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Service role full access trade_category_configs" ON public.trade_category_configs;
CREATE POLICY "Service role full access trade_category_configs"
  ON public.trade_category_configs FOR ALL
  USING (auth.role() = 'service_role');
