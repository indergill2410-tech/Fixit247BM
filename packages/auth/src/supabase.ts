import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import {
  createBrowserClient as createSSRBrowserClient,
  createServerClient as createSSRServerClient,
  type CookieOptions,
} from '@supabase/ssr';

// ─── Environment helpers ──────────────────────────────────────────────────────

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `Ensure it is set in your .env file or deployment environment.`,
    );
  }
  return value;
}

// ─── Cookie store interface ───────────────────────────────────────────────────

/**
 * Minimal cookie store interface compatible with Next.js ReadonlyRequestCookies
 * and ResponseCookies.  Callers pass `await cookies()` from `next/headers`.
 */
export interface CookieStore {
  get(name: string): { value: string } | undefined;
  set(name: string, value: string, options?: CookieOptions): void;
  delete(name: string): void;
}

// ─── Browser client ───────────────────────────────────────────────────────────

/**
 * Supabase client for use in React client components.
 * Reads NEXT_PUBLIC_ env vars at call time so it works in browser bundles.
 */
export function createBrowserClient(): SupabaseClient {
  const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL');
  const anon = requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

  return createSSRBrowserClient(url, anon);
}

// ─── Server client ────────────────────────────────────────────────────────────

/**
 * Supabase client for use in Server Components, Route Handlers, and Server
 * Actions.  Requires a Next.js cookie store (from `await cookies()`).
 */
export function createServerClient(cookieStore: CookieStore): SupabaseClient {
  const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL');
  const anon = requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

  return createSSRServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set(name, value, options);
        } catch {
          // Ignore — set() throws in Server Components (read-only store).
          // Middleware handles the actual cookie writes.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set(name, '', { ...options, maxAge: 0 });
        } catch {
          // Same as above — ignore in read-only contexts.
        }
      },
    },
  });
}

// ─── Service-role client ──────────────────────────────────────────────────────

/**
 * Supabase admin client with the service-role key.
 * Bypasses Row Level Security — use only in trusted server contexts.
 * Never expose this client to the browser.
 */
export function createServiceRoleClient(): SupabaseClient {
  const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL');
  const serviceKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY');

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

