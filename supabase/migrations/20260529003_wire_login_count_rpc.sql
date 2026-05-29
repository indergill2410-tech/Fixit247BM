-- Migration: Ensure users table has loginCount and lastLoginAt columns
-- Safe to run — uses IF NOT EXISTS / DO NOTHING patterns

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'users'
    AND column_name = 'loginCount'
  ) THEN
    ALTER TABLE public.users ADD COLUMN "loginCount" INTEGER NOT NULL DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'users'
    AND column_name = 'lastLoginAt'
  ) THEN
    ALTER TABLE public.users ADD COLUMN "lastLoginAt" TIMESTAMPTZ;
  END IF;
END;
$$;
