import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { Role } from '@fixit247/auth';

// ─── Role cache cookie ────────────────────────────────────────────────────────
// We cache the DB-verified role in a short-lived HMAC-signed cookie to avoid a
// Supabase REST round-trip on every single middleware invocation.
// Format: <base64url(utf8-json)>.<base64url(hmac-sha256)>
// Verified with crypto.subtle (constant-time) before any payload is trusted.
const ROLE_CACHE_COOKIE = '__fixit_role_cache';
const ROLE_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface RoleCachePayload {
  role: Role;
  onboardingComplete: boolean;
  userId: string;
  expiresAt: number; // Unix ms
}

function b64urlEncode(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(str: string): Uint8Array<ArrayBuffer> {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/') +
    '='.repeat((4 - (str.length % 4)) % 4);
  const raw = atob(padded);
  const buf = new ArrayBuffer(raw.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < raw.length; i++) view[i] = raw.charCodeAt(i);
  return view;
}

function getHmacSecret(): string | undefined {
  // SUPABASE_JWT_SECRET is server-only (no NEXT_PUBLIC_ prefix) and already required
  // for Supabase JWT verification, making it a safe key material source here.
  return process.env.SUPABASE_JWT_SECRET;
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

async function serializeRoleCache(payload: RoleCachePayload): Promise<string | null> {
  const secret = getHmacSecret();
  if (!secret) return null;
  const payloadBytes = new TextEncoder().encode(JSON.stringify(payload));
  const key = await importHmacKey(secret);
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, payloadBytes));
  return `${b64urlEncode(payloadBytes)}.${b64urlEncode(sig)}`;
}

async function parseRoleCache(raw: string | undefined): Promise<RoleCachePayload | null> {
  if (!raw) return null;
  const secret = getHmacSecret();
  if (!secret) return null;
  const dot = raw.lastIndexOf('.');
  if (dot === -1) return null;
  try {
    const payloadBytes = b64urlDecode(raw.slice(0, dot));
    const sigBytes = b64urlDecode(raw.slice(dot + 1));
    const key = await importHmacKey(secret);
    // crypto.subtle.verify uses constant-time comparison internally
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, payloadBytes);
    if (!valid) return null;
    const payload = JSON.parse(new TextDecoder().decode(payloadBytes)) as RoleCachePayload;
    return payload.expiresAt > Date.now() ? payload : null;
  } catch {
    return null;
  }
}

// ─── Route Configuration ──────────────────────────────────────────────────────

// Exact-match public routes
const PUBLIC_EXACT: readonly string[] = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/auth/callback',
  '/about',
  '/contact',
  '/unauthorized',
  '/how-it-works',
  '/fixit-plus',
  '/join-as-tradie',
  '/refer',
  '/terms',
  '/privacy',
  '/blog',
  '/emergency',
  '/voice',
  '/api/health', // Render health checks + public status endpoint
];

// Prefix-match public routes (handles dynamic segments)
const PUBLIC_PREFIXES: readonly string[] = [
  '/blog/',
  '/emergency/',
  '/suburb/',
  '/trade/',
  '/tradie/',   // public tradie profiles (/tradie/[id])
  '/api/auth',
  '/api/voice/twilio', // Twilio webhooks — must be publicly reachable, no session
  '/api/twilio',       // Compatibility path (Twilio console may use either prefix)
  '/api/growth/events', // has its own mixed anon/auth logic
  '/_next',
  '/favicon',
];

const ROUTE_ROLES: { pattern: RegExp; roles: Role[] }[] = [
  { pattern: /^\/admin/, roles: ['ADMIN', 'SUPER_ADMIN'] },
  { pattern: /^\/tradie\/dashboard/, roles: ['TRADIE'] },
  { pattern: /^\/tradie\/jobs/, roles: ['TRADIE'] },
  { pattern: /^\/tradie\/messages/, roles: ['TRADIE'] },
  { pattern: /^\/tradie\/profile/, roles: ['TRADIE'] },
  { pattern: /^\/tradie\/earnings/, roles: ['TRADIE'] },
  { pattern: /^\/tradie\/wallet/, roles: ['TRADIE'] },
  { pattern: /^\/tradie\/subscription/, roles: ['TRADIE'] },
  { pattern: /^\/tradie\/availability/, roles: ['TRADIE'] },
  { pattern: /^\/tradie\/documents/, roles: ['TRADIE'] },
  { pattern: /^\/tradie\/onboarding/, roles: ['TRADIE'] },
  { pattern: /^\/dashboard/, roles: ['CUSTOMER'] },
  { pattern: /^\/jobs/, roles: ['CUSTOMER'] },
  { pattern: /^\/messages/, roles: ['CUSTOMER'] },
  { pattern: /^\/profile/, roles: ['CUSTOMER'] },
  { pattern: /^\/reviews/, roles: ['CUSTOMER'] },
  { pattern: /^\/book/, roles: ['CUSTOMER'] },
  { pattern: /^\/saved-tradies/, roles: ['CUSTOMER'] },
  { pattern: /^\/invoices/, roles: ['CUSTOMER'] },
  { pattern: /^\/onboarding/, roles: ['CUSTOMER'] },
];

const ONBOARDING_EXEMPT = [
  '/onboarding',
  '/tradie/onboarding',
  '/api/onboarding',
  '/api/auth',
  '/auth/callback',
];

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_EXACT.includes(pathname)) return true;
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) return true;
  return false;
}

function getRequiredRoles(pathname: string): Role[] | null {
  for (const { pattern, roles } of ROUTE_ROLES) {
    if (pattern.test(pathname)) return roles;
  }
  return null;
}

function isOnboardingExempt(pathname: string): boolean {
  return ONBOARDING_EXEMPT.some((p) => pathname.startsWith(p));
}

function getDashboardPath(role: Role): string {
  if (role === 'TRADIE') return '/tradie/dashboard';
  if (role === 'ADMIN' || role === 'SUPER_ADMIN') return '/admin';
  return '/dashboard';
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Supabase OAuth sends the `code` to the Site URL when the redirectTo URL is
  // not in the allowed list. Catch any misdirected callback and forward it to
  // the correct handler so the session exchange still works.
  if (pathname === '/' && request.nextUrl.searchParams.has('code')) {
    const callbackUrl = new URL('/auth/callback', request.url);
    callbackUrl.search = request.nextUrl.search;
    return NextResponse.redirect(callbackUrl);
  }

  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return response;

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options as never),
        );
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  if (isPublicRoute(pathname)) {
    if (user && (pathname === '/login' || pathname === '/register')) {
      // Use cached role if available; otherwise read from app_metadata (service-role-only)
      // with user_metadata as fallback. Never redirect to a privileged path based solely
      // on user_metadata which the client can write via supabase.auth.updateUser().
      const cached = await parseRoleCache(request.cookies.get(ROLE_CACHE_COOKIE)?.value);
      let role: Role;
      if (cached && cached.userId === user.id) {
        role = cached.role;
      } else {
        const appMeta = (user.app_metadata ?? {}) as Record<string, unknown>;
        const userMeta = user.user_metadata as Record<string, unknown>;
        role = ((appMeta.role ?? userMeta.role) as Role | undefined) ?? 'CUSTOMER';
      }
      return NextResponse.redirect(new URL(getDashboardPath(role), request.url));
    }
    return response;
  }

  if (!user) {
    // API routes expect JSON — never redirect them to the login page.
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── DB-verified role lookup (with 5-minute cookie cache) ──────────────────
  let role: Role;
  let onboardingComplete: boolean;

  const cached = await parseRoleCache(request.cookies.get(ROLE_CACHE_COOKIE)?.value);
  if (cached && cached.userId === user.id) {
    // Cache hit — use the DB-verified values
    role = cached.role;
    onboardingComplete = cached.onboardingComplete;
  } else {
    // Cache miss — query the users table via Supabase REST (Edge-compatible)
    const { data: dbUser } = await supabase
      .from('users')
      .select('role, onboarding_complete')
      .eq('id', user.id)
      .single();

    if (dbUser) {
      role = (dbUser.role as Role | undefined) ?? 'CUSTOMER';
      onboardingComplete = Boolean(dbUser.onboarding_complete ?? false);
    } else {
      // DB row not found — can happen when:
      //   (a) RLS is not yet configured for anon reads, or
      //   (b) auth callback hasn't created the DB user yet (race on first login).
      // Fall back to app_metadata.role (service-role-written, not user-writable)
      // so we don't cause a redirect loop. Treat as unboarded so we route to
      // onboarding where the DB user gets created.
      const appMeta = (user.app_metadata ?? {}) as Record<string, unknown>;
      const userMeta = (user.user_metadata ?? {}) as Record<string, unknown>;
      role = ((appMeta.role ?? userMeta.role) as Role | undefined) ?? 'CUSTOMER';
      onboardingComplete = false;
    }

    // Write the HMAC-signed cache cookie onto the response.
    // If the secret is absent (misconfigured deploy), skip caching — the fresh
    // DB lookup above already populated role/onboardingComplete.
    const cachePayload: RoleCachePayload = {
      role,
      onboardingComplete,
      userId: user.id,
      expiresAt: Date.now() + ROLE_CACHE_TTL_MS,
    };
    const signedCookie = await serializeRoleCache(cachePayload);
    if (signedCookie) {
      response.cookies.set(ROLE_CACHE_COOKIE, signedCookie, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: Math.floor(ROLE_CACHE_TTL_MS / 1000),
        path: '/',
      });
    }
  }

  const requiredRoles = getRequiredRoles(pathname);
  if (requiredRoles && !requiredRoles.includes(role)) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  if (!onboardingComplete && !isOnboardingExempt(pathname)) {
    const onboardPath = role === 'TRADIE' ? '/tradie/onboarding/business' : '/onboarding';
    if (pathname !== onboardPath) {
      return NextResponse.redirect(new URL(onboardPath, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
