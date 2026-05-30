import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { Role } from '@fixit247/auth';

const ADMIN_ROLES: readonly Role[] = ['ADMIN', 'SUPER_ADMIN'];

function loginRedirect(request: NextRequest): NextResponse {
  const loginUrl = new URL('/login', request.nextUrl.origin);
  loginUrl.searchParams.set('redirectTo', `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(loginUrl);
}

function forbiddenRedirect(request: NextRequest): NextResponse {
  const loginUrl = new URL('/login', request.nextUrl.origin);
  loginUrl.searchParams.set('error', 'forbidden');
  return NextResponse.redirect(loginUrl);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === '/api/health') return NextResponse.next();

  let response = NextResponse.next({ request });
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    if (pathname === '/login') return response;
    return process.env.NODE_ENV === 'production'
      ? loginRedirect(request)
      : response;
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
    if (pathname === '/login') return response;
    return loginRedirect(request);
  }

  const meta = user.user_metadata as Record<string, unknown>;
  const role = (meta.role as Role | undefined) ?? 'CUSTOMER';
  if (!ADMIN_ROLES.includes(role)) return forbiddenRedirect(request);
  if (pathname === '/login') return NextResponse.redirect(new URL('/dashboard', request.url));

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
