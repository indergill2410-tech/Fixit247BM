'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Suspense } from 'react';

const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN'];
const SHOW_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';
const DEMO_EMAIL = 'admin@demo.fixit247.com.au';
const DEMO_PASSWORD = 'Demo1234!';
type LoadingMode = 'form' | 'demo' | null;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accessDenied = searchParams.get('error') === 'access_denied';

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(
    accessDenied ? 'Your account does not have admin access.' : null
  );
  const [loading, setLoading] = React.useState<LoadingMode>(null);

  async function signIn(emailValue: string, passwordValue: string, mode: Exclude<LoadingMode, null>) {
    setError(null);
    setLoading(mode);

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: emailValue,
      password: passwordValue,
    });

    if (authError || !data.user) {
      setError('Invalid email or password.');
      setLoading(null);
      return;
    }

    const appMeta = (data.user.app_metadata ?? {}) as Record<string, unknown>;
    const userMeta = (data.user.user_metadata ?? {}) as Record<string, unknown>;
    const role = (appMeta.role ?? userMeta.role) as string | undefined;

    if (!role || !ADMIN_ROLES.includes(role)) {
      await supabase.auth.signOut();
      setError('Your account does not have admin access.');
      setLoading(null);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await signIn(email, password, 'form');
  }

  async function handleDemoLogin() {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    await signIn(DEMO_EMAIL, DEMO_PASSWORD, 'demo');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900">
            <span className="text-lg font-black text-white">F</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Admin Console</h1>
          <p className="mt-1 text-sm text-gray-500">Fixit 24/7 — restricted access</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-4">
          <div>
            <label htmlFor="admin-email" className="mb-1.5 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              placeholder="admin@fixit247.com.au"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading !== null}
            className="mt-2 w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading === 'form' ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        {SHOW_DEMO && (
          <div className="mt-6 border-t border-gray-200 pt-5">
            <button
              type="button"
              disabled={loading !== null}
              onClick={() => void handleDemoLogin()}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading === 'demo' ? 'Opening demo dashboard…' : 'Open super admin demo'}
            </button>
            <p className="mt-2 text-center text-xs text-gray-500">
              Uses {DEMO_EMAIL}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
