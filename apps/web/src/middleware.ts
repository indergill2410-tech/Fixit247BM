import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { Role } from '@fixit247/auth';
import { getDashboardTarget, toRedirectUrl } from '@/lib/auth/redirects';

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
  '/find-a-tradie',
  '/unauthorized',
  '/how-it-works',
  '/fixit-plus',
  '/join-as-tradie',
  '/post-job',
  '/refer',
  '/terms',
  '/privacy',
  '/blog',
  '/emergency',
  '/voice',
  '/api/health', // Render health checks + public status endpoint
  '/api/readiness',
  '/api/payments/webhook',
  '/api/sms/twilio/inbound',
];

// Prefix-match public routes (handles dynamic segments)
const PUBLIC_PREFIXES: readonly string[] = [
  '/blog/',
  '/emergency/',
  '/suburb/',
  '/trade/',
  '/api/auth',
  '/api/voice/twilio', // Twilio webhooks — must be publicly reachable, no session
  '/api/twilio',       // Compatibility path (Twilio console may use either prefix)
  '/_next',
  '/favicon',
];

const PUBLIC_PATTERNS: readonly RegExp[] = [
  /^\/tradie\/(?!dashboard$|jobs(?:\/|$)|messages$|profile$|earnings$|wallet$|subscription$|availability$|documents$|onboarding(?:\/|$))[^/]+$/,
];

const ROUTE_ROLES: { pattern: RegExp; roles: Role[] }[] = [
  { pattern: /^\/api\/admin(?:\/|$)/, roles: ['ADMIN', 'SUPER_ADMIN'] },
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
  '/api/admin',
  '/auth/callback',
];

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_EXACT.includes(pathname)) return true;
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) return true;
  if (PUBLIC_PATTERNS.some((pattern) => pattern.test(pathname))) return true;
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

function isApiRoute(pathname: string): boolean {
  return pathname.startsWith('/api/');
}

function unauthorized(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  if (isApiRoute(pathname)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('redirectTo', `${pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(loginUrl);
}

function forbidden(request: NextRequest): NextResponse {
  if (isApiRoute(request.nextUrl.pathname)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  return NextResponse.redirect(new URL('/unauthorized', request.url));
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    if (isPublicRoute(pathname)) return response;
    if (isApiRoute(pathname)) {
      return NextResponse.json({ error: 'Auth configuration missing' }, { status: 503 });
    }
    return NextResponse.redirect(new URL('/login?error=auth_config', request.url));
  }

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
      const meta = user.user_metadata as Record<string, unknown>;
      const role = (meta.role as Role | undefined) ?? 'CUSTOMER';
      const target = getDashboardTarget(role);
      return NextResponse.redirect(toRedirectUrl(target, request.nextUrl.origin));
    }
    return response;
  }

  if (!user) {
    return unauthorized(request);
  }

  const meta = user.user_metadata as Record<string, unknown>;
  const role = (meta.role as Role | undefined) ?? 'CUSTOMER';
  const onboardingComplete = (meta.onboardingComplete as boolean | undefined) ?? false;

  const requiredRoles = getRequiredRoles(pathname);
  if (requiredRoles && !requiredRoles.includes(role)) {
    return forbidden(request);
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
