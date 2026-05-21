-- Baseline migration — production tables were initially created via `prisma db push`.
-- This file marks the starting point for the migration history.
-- To baseline an existing database, run:
--   pnpm --filter @fixit247/database exec prisma migrate resolve --applied 20240101000000_init
--
-- After baselining, future schema changes should use:
--   pnpm --filter @fixit247/database run db:migrate   (dev)
--   pnpm --filter @fixit247/database run db:migrate:prod  (production CI)

-- Enable required extensions (safe to run even if already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
