-- Add onDelete: Cascade to Payment.jobId (safe: cleans up payments when job is deleted)
ALTER TABLE "payments" DROP CONSTRAINT IF EXISTS "payments_jobId_fkey";
ALTER TABLE "payments" ADD CONSTRAINT "payments_jobId_fkey"
  FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add onDelete: Cascade to Dispute.jobId
ALTER TABLE "disputes" DROP CONSTRAINT IF EXISTS "disputes_jobId_fkey";
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_jobId_fkey"
  FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Composite indexes for common filtered queries on Job
CREATE INDEX CONCURRENTLY IF NOT EXISTS "jobs_customerId_status_idx" ON "jobs"("customerId", "status");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "jobs_status_createdAt_idx" ON "jobs"("status", "createdAt");

-- Composite indexes for Payment and Dispute admin dashboards
CREATE INDEX CONCURRENTLY IF NOT EXISTS "payments_status_createdAt_idx" ON "payments"("status", "createdAt");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "disputes_status_createdAt_idx" ON "disputes"("status", "createdAt");

-- CHECK constraint to prevent negative credit balances (belt + suspenders alongside SELECT FOR UPDATE)
ALTER TABLE "credits_wallets" ADD CONSTRAINT "credits_wallets_balance_non_negative"
  CHECK (balance >= 0);

-- Add PAST_DUE to SubscriptionStatus enum for invoice.payment_failed webhook
ALTER TYPE "SubscriptionStatus" ADD VALUE IF NOT EXISTS 'PAST_DUE';
