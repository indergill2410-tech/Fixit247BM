-- Fixit247BM profile-ownership RLS policy corrections.
-- Some domain tables store profile ids in customerId/tradieId, not auth user ids.

DROP POLICY IF EXISTS "Users can read relevant jobs" ON public.jobs;
CREATE POLICY "Users can read relevant jobs"
  ON public.jobs FOR SELECT
  TO authenticated
  USING (
    "customerId" IN (SELECT id FROM public.customer_profiles WHERE "userId" = (SELECT auth.uid()))
    OR "tradieId" IN (SELECT id FROM public.tradie_profiles WHERE "userId" = (SELECT auth.uid()))
    OR status IN ('OPEN', 'CLAIMED')
  );

DROP POLICY IF EXISTS "Customers create jobs" ON public.jobs;
CREATE POLICY "Customers create jobs"
  ON public.jobs FOR INSERT
  TO authenticated
  WITH CHECK (
    "customerId" IN (SELECT id FROM public.customer_profiles WHERE "userId" = (SELECT auth.uid()))
  );

DROP POLICY IF EXISTS "Owners update own jobs" ON public.jobs;
CREATE POLICY "Owners update own jobs"
  ON public.jobs FOR UPDATE
  TO authenticated
  USING (
    "customerId" IN (SELECT id FROM public.customer_profiles WHERE "userId" = (SELECT auth.uid()))
    OR "tradieId" IN (SELECT id FROM public.tradie_profiles WHERE "userId" = (SELECT auth.uid()))
  )
  WITH CHECK (
    "customerId" IN (SELECT id FROM public.customer_profiles WHERE "userId" = (SELECT auth.uid()))
    OR "tradieId" IN (SELECT id FROM public.tradie_profiles WHERE "userId" = (SELECT auth.uid()))
  );

DROP POLICY IF EXISTS "Users read own payments" ON public.payments;
CREATE POLICY "Users read own payments"
  ON public.payments FOR SELECT
  TO authenticated
  USING (
    "customerId" IN (SELECT id FROM public.customer_profiles WHERE "userId" = (SELECT auth.uid()))
    OR "tradieId" IN (SELECT id FROM public.tradie_profiles WHERE "userId" = (SELECT auth.uid()))
  );

DROP POLICY IF EXISTS "Users read own credit transactions" ON public.transactions;
CREATE POLICY "Users read own credit transactions"
  ON public.transactions FOR SELECT
  TO authenticated
  USING (
    "walletId" IN (SELECT id FROM public.credits_wallets WHERE "userId" = (SELECT auth.uid()))
  );

DROP POLICY IF EXISTS "Tradies manage own availability" ON public.availability;
CREATE POLICY "Tradies manage own availability"
  ON public.availability FOR ALL
  TO authenticated
  USING (
    "tradieId" IN (SELECT id FROM public.tradie_profiles WHERE "userId" = (SELECT auth.uid()))
  )
  WITH CHECK (
    "tradieId" IN (SELECT id FROM public.tradie_profiles WHERE "userId" = (SELECT auth.uid()))
  );

DROP POLICY IF EXISTS "Tradies manage own portfolios" ON public.tradie_portfolios;
CREATE POLICY "Tradies manage own portfolios"
  ON public.tradie_portfolios FOR ALL
  TO authenticated
  USING (
    "tradieId" IN (SELECT id FROM public.tradie_profiles WHERE "userId" = (SELECT auth.uid()))
  )
  WITH CHECK (
    "tradieId" IN (SELECT id FROM public.tradie_profiles WHERE "userId" = (SELECT auth.uid()))
  );

DROP POLICY IF EXISTS "Participants read own disputes" ON public.disputes;
CREATE POLICY "Participants read own disputes"
  ON public.disputes FOR SELECT
  TO authenticated
  USING (
    "customerId" IN (SELECT id FROM public.customer_profiles WHERE "userId" = (SELECT auth.uid()))
    OR "tradieId" IN (SELECT id FROM public.tradie_profiles WHERE "userId" = (SELECT auth.uid()))
  );

DROP POLICY IF EXISTS "Users raise disputes" ON public.disputes;
CREATE POLICY "Users raise disputes"
  ON public.disputes FOR INSERT
  TO authenticated
  WITH CHECK (
    "customerId" IN (SELECT id FROM public.customer_profiles WHERE "userId" = (SELECT auth.uid()))
    OR "tradieId" IN (SELECT id FROM public.tradie_profiles WHERE "userId" = (SELECT auth.uid()))
  );

DROP POLICY IF EXISTS "Users read own referrals" ON public.referrals;
CREATE POLICY "Users read own referrals"
  ON public.referrals FOR SELECT
  TO authenticated
  USING (
    "inviterId" = (SELECT auth.uid())
    OR "invitedUserId" = (SELECT auth.uid())
  );

DROP POLICY IF EXISTS "Participants read job events" ON public.job_events;
CREATE POLICY "Participants read job events"
  ON public.job_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.jobs j
      WHERE j.id = "jobId"
      AND (
        j."customerId" IN (SELECT id FROM public.customer_profiles WHERE "userId" = (SELECT auth.uid()))
        OR j."tradieId" IN (SELECT id FROM public.tradie_profiles WHERE "userId" = (SELECT auth.uid()))
      )
    )
  );

DROP POLICY IF EXISTS "Participants read own voice calls" ON public.voice_calls;
CREATE POLICY "Participants read own voice calls"
  ON public.voice_calls FOR SELECT
  TO authenticated
  USING (
    "customerId" = (SELECT auth.uid())
    OR "assignedAgentId" = (SELECT auth.uid())
  );

DROP POLICY IF EXISTS "Users read own ai conversations" ON public.ai_conversations;
CREATE POLICY "Users read own ai conversations"
  ON public.ai_conversations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.jobs j
      WHERE j.id = "jobId"
      AND (
        j."customerId" IN (SELECT id FROM public.customer_profiles WHERE "userId" = (SELECT auth.uid()))
        OR j."tradieId" IN (SELECT id FROM public.tradie_profiles WHERE "userId" = (SELECT auth.uid()))
      )
    )
    OR EXISTS (
      SELECT 1
      FROM public.voice_calls vc
      WHERE vc.id = "callId"
      AND vc."customerId" = (SELECT auth.uid())
    )
  );
