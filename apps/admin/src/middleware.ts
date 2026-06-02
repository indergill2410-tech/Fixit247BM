import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { Role } from '@fixit247/auth';

const PUBLIC_PREFIXES = ['/_next', '/favicon', '/api/health', '/api/auth'];
const PUBLIC_EXACT = ['/login'];

function isPublic(pathname: string): boolean {
  if (PUBLIC_EXACT.includes(pathname)) return true;
  return PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let response = NextResponse.next({ request });

  if (isPublic(pathname)) return response;

  // API routes should fail with a JSON 401/403 rather than an HTML redirect,
  // so the admin console's fetch().json() calls degrade gracefully.
  const isApi = pathname.startsWith('/api/');
  const deny = (status: number, error: string) =>
    isApi
      ? NextResponse.json({ error }, { status })
      : NextResponse.redirect(new URL(`/login${status === 403 ? '?error=access_denied' : ''}`, request.url));

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 503 });
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

  if (!user) {
    return deny(401, 'Unauthorized');
  }

  const { data: dbUser, error: dbError } = await supabase
    .from('users')
    .select('role, "isActive"')
    .eq('id', user.id)
    .maybeSingle();

  if (dbError) {
    return isApi
      ? NextResponse.json({ error: 'Profile unavailable' }, { status: 503 })
      : NextResponse.redirect(new URL('/login?error=profile_unavailable', request.url));
  }

  const appMeta = (user.app_metadata as Record<string, unknown> | null) ?? {};
  const metadataRole = appMeta.role === 'ADMIN' || appMeta.role === 'SUPER_ADMIN'
    ? appMeta.role as Role
    : undefined;
  const role = (dbUser?.role as Role | undefined) ?? metadataRole ?? 'CUSTOMER';
  const isActive = dbUser
    ? Boolean((dbUser as Record<string, unknown>).isActive)
    : Boolean(metadataRole);

  if (!isActive || (role !== 'ADMIN' && role !== 'SUPER_ADMIN')) {
    return deny(403, 'Forbidden');
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
