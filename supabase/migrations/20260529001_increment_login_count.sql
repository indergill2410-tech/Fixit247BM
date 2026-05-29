-- Migration: increment_login_count RPC
-- Safely increments the loginCount field on the users table after a successful login

CREATE OR REPLACE FUNCTION public.increment_login_count(user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.users
  SET
    "loginCount" = COALESCE("loginCount", 0) + 1,
    "lastLoginAt" = NOW()
  WHERE id = user_id;
END;
$$;

-- Grant execute to authenticated users (called server-side via service role anyway)
GRANT EXECUTE ON FUNCTION public.increment_login_count(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.increment_login_count(UUID) TO authenticated;
