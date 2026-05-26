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

  // Role from app_metadata (service-role-only, tamper-proof) with user_metadata fallback
  const appMeta = (user.app_metadata ?? {}) as Record<string, unknown>;
  const userMeta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const role = ((appMeta.role ?? userMeta.role) as Role | undefined) ?? 'CUSTOMER';

  if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
    return NextResponse.redirect(new URL('/login?error=access_denied', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
