import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { Role } from '@fixit247/auth';

const PUBLIC_PREFIXES = ['/_next', '/favicon', '/api/health'];
const PUBLIC_EXACT = ['/login'];

function isPublic(pathname: string): boolean {
  if (PUBLIC_EXACT.includes(pathname)) return true;
  return PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let response = NextResponse.next({ request });

  if (isPublic(pathname)) return response;

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
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const { data: dbUser, error: dbError } = await supabase
    .from('users')
    .select('role, "isActive"')
    .eq('id', user.id)
    .maybeSingle();

  if (dbError) {
    return NextResponse.redirect(new URL('/login?error=profile_unavailable', request.url));
  }

  const appMeta = (user.app_metadata ?? {}) as Record<string, unknown>;
  const metadataRole = appMeta.role === 'ADMIN' || appMeta.role === 'SUPER_ADMIN'
    ? appMeta.role as Role
    : undefined;
  const role = (dbUser?.role as Role | undefined) ?? metadataRole ?? 'CUSTOMER';
  const isActive = dbUser
    ? Boolean((dbUser as Record<string, unknown>).isActive)
    : Boolean(metadataRole);

  if (!isActive || (role !== 'ADMIN' && role !== 'SUPER_ADMIN')) {
    return NextResponse.redirect(new URL('/login?error=access_denied', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
