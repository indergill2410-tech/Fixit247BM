import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { Role } from '@fixit247/auth';

// ─── Role cache cookie ────────────────────────────────────────────────────────
// We cache the DB-verified role in a short-lived signed-ish cookie to avoid a
// Supabase REST round-trip on every single middleware invocation.
const ROLE_CACHE_COOKIE = '__fixit_role_cache';
const ROLE_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface RoleCachePayload {
  role: Role;
  onboardingComplete: boolean;
  userId: string;
  expiresAt: number; // Unix ms
}

function parseRoleCache(raw: string | undefined): RoleCachePayload | null {
  if (!raw) return null;
  try {
    const payload = JSON.parse(raw) as RoleCachePayload;
    if (payload.expiresAt > Date.now()) return payload;
    return null; // expired
  } catch {
    return null;
  }
}

function serializeRoleCache(payload: RoleCachePayload): string {
  return JSON.stringify(payload);
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
      const cached = parseRoleCache(request.cookies.get(ROLE_CACHE_COOKIE)?.value);
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

  const cached = parseRoleCache(request.cookies.get(ROLE_CACHE_COOKIE)?.value);
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
      // DB lookup returned nothing — deny access rather than trust user-writable metadata.
      // This covers brand-new users not yet synced; redirect to login to re-auth.
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Write the cache cookie onto the response
    const cachePayload: RoleCachePayload = {
      role,
      onboardingComplete,
      userId: user.id,
      expiresAt: Date.now() + ROLE_CACHE_TTL_MS,
    };
    response.cookies.set(ROLE_CACHE_COOKIE, serializeRoleCache(cachePayload), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: Math.floor(ROLE_CACHE_TTL_MS / 1000),
      path: '/',
    });
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
