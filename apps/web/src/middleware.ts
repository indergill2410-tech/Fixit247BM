import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const PUBLIC_PATHS = ['/', '/login', '/register', '/forgot-password', '/about', '/pricing'];
const CUSTOMER_PATHS = ['/dashboard', '/jobs', '/quotes', '/messages', '/profile'];
const TRADIE_PATHS = ['/tradie', '/my-jobs', '/earnings', '/availability'];
const ADMIN_PATHS = ['/admin'];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith('/api/auth'));
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env['NEXT_PUBLIC_SUPABASE_URL']!,
    process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  if (!user && !isPublicPath(pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user) {
    const role = (user.user_metadata as { role?: string })['role'];

    const isAdminPath = ADMIN_PATHS.some((p) => pathname.startsWith(p));
    const isTradiePath = TRADIE_PATHS.some((p) => pathname.startsWith(p));

    if (isAdminPath && role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (isTradiePath && role !== 'TRADIE') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if ((pathname === '/login' || pathname === '/register') && user) {
      const dest = role === 'TRADIE' ? '/tradie/dashboard' :
                   role === 'ADMIN' || role === 'SUPER_ADMIN' ? '/admin' : '/dashboard';
      return NextResponse.redirect(new URL(dest, request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
