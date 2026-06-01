'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button, Card, CardContent, Input } from '@fixit247/ui';
import { loginSchema, type LoginValues } from '@/lib/validators/auth';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { normalizeRedirectTarget } from '@/lib/auth/redirects';

// Use NEXT_PUBLIC_SITE_URL so OAuth callbacks work correctly behind reverse proxies
// (window.location.origin resolves to the container's internal address, not the public URL)
function getSiteOrigin(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? window.location.origin;
}

const SHOW_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';

interface LoginResponse {
  redirectTo?: string;
  error?: string;
  code?: string;
}

const URL_ERROR_COPY: Record<string, string> = {
  auth_callback_failed: 'Google sign-in failed. Please try again or use email and password.',
  email_required: 'Your provider did not return an email address. Please use another sign-in method.',
  profile_unavailable: 'Your profile could not be loaded. Please try again in a minute.',
  access_denied: 'This account is not active or cannot access that area.',
};

const DEMO_ACCOUNTS = [
  {
    email: 'emma.williams@demo.fixit247.com',
    password: 'Demo1234!',
    role: 'CUSTOMER',
    label: 'Homeowner',
    description: 'Post jobs, hire tradies, track progress',
    icon: '🏠',
    badge: 'Customer view',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    email: 'mike.torres@demo.fixit247.com',
    password: 'Demo1234!',
    role: 'TRADIE',
    label: 'Tradie',
    description: 'Browse leads, manage jobs & earnings',
    icon: '🔧',
    badge: 'Tradie view',
    badgeColor: 'bg-brand-100 text-brand-700',
  },
  {
    email: 'admin@demo.fixit247.com.au',
    password: 'Demo1234!',
    role: 'SUPER_ADMIN',
    label: 'Super Admin',
    description: 'Platform control room, trust, revenue & support',
    icon: '⚙️',
    badge: 'Ops view',
    badgeColor: 'bg-purple-100 text-purple-700',
  },
] as const;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? '/dashboard';
  const urlError = searchParams.get('error');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [showGoogleRoleSelect, setShowGoogleRoleSelect] = React.useState(false);
  const [demoLoading, setDemoLoading] = React.useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  async function completePasswordLogin(email: string, password: string, successMessage: string) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, redirectTo }),
    });

    const payload = await response.json().catch(() => ({})) as LoginResponse;

    if (!response.ok || !payload.redirectTo) {
      if (payload.code === 'email_not_confirmed') {
        toast.error('Please verify your email first', {
          action: { label: 'Resend', onClick: () => void handleResendVerification(email) },
        });
      } else {
        toast.error(payload.error ?? 'Login failed. Please try again.');
      }
      return false;
    }

    toast.success(successMessage);
    const dest = payload.redirectTo;
    if (dest.startsWith('http')) {
      window.location.assign(dest);
    } else {
      router.push(dest);
      router.refresh();
    }
    return true;
  }

  async function onSubmit(values: LoginValues) {
    await completePasswordLogin(values.email, values.password, 'Welcome back!');
  }

  async function handleResendVerification(email: string) {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.resend({ type: 'signup', email });
    toast.success('Verification email sent');
  }

  async function loginAsDemo(email: string, password: string) {
    if (demoLoading !== null || isSubmitting || isGoogleLoading) return;
    setDemoLoading(email);
    try {
      const loggedIn = await completePasswordLogin(email, password, 'Signed in as demo user');
      if (!loggedIn) setDemoLoading(null);
    } catch {
      toast.error('An unexpected error occurred during demo login');
      setDemoLoading(null);
    }
  }

  function handleGoogleLogin() {
    setShowGoogleRoleSelect(true);
  }

  async function handleGoogleOAuth(role: 'CUSTOMER' | 'TRADIE') {
    setShowGoogleRoleSelect(false);
    setIsGoogleLoading(true);
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${getSiteOrigin()}/auth/callback?redirectTo=${encodeURIComponent(normalizeRedirectTarget(redirectTo, window.location.origin))}&googleRole=${role}`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    });
    if (error) {
      toast.error('Google login failed. Please try again.');
      setIsGoogleLoading(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
        <p className="mt-2 text-foreground-muted">Log in to your Fixit247 account</p>
      </div>

      <Card className="border-border bg-card shadow-card-warm">
        <CardContent className="px-6 pb-6 pt-8">
          {urlError && (
            <div className="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-700">
              {URL_ERROR_COPY[urlError] ?? 'An error occurred. Please try again.'}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-foreground-secondary">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="pl-10"
                  error={errors.email?.message}
                  {...register('email')}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-foreground-secondary">Password</label>
                <Link href="/forgot-password" className="text-xs text-brand-600 transition-colors hover:text-brand-700">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="pl-10 pr-10"
                  error={errors.password?.message}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => { setShowPassword(!showPassword); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-foreground-muted"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              loading={isSubmitting}
              size="lg"
              className="mt-1 w-full"
            >
              Log in
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 border-t border-border" />
            <span className="text-xs text-foreground-subtle">or continue with</span>
            <div className="flex-1 border-t border-border" />
          </div>

          {showGoogleRoleSelect ? (
            <div className="rounded-2xl border border-border bg-background-alt p-4">
              <p className="mb-3 text-center text-sm font-semibold text-foreground">
                Are you signing in as a customer or a tradie?
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => void handleGoogleOAuth('CUSTOMER')}
                  className="flex-1 rounded-xl border border-border bg-card py-3 text-sm font-semibold text-foreground transition-all hover:bg-background-elevated"
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => void handleGoogleOAuth('TRADIE')}
                  className="flex-1 rounded-xl border border-brand-500/40 bg-brand-500/15 py-3 text-sm font-semibold text-brand-700 transition-all hover:bg-brand-500/25"
                >
                  Tradie
                </button>
              </div>
              <button
                type="button"
                onClick={() => { setShowGoogleRoleSelect(false); }}
                className="mt-2 w-full text-center text-xs text-foreground-subtle hover:text-foreground-muted"
              >
                Cancel
              </button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="lg"
              loading={isGoogleLoading}
              onClick={handleGoogleLogin}
              className="w-full"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
          )}

          {/* Demo accounts — one-click instant login, shown when NEXT_PUBLIC_DEMO_MODE=true */}
          {SHOW_DEMO && (
            <>
              <div className="my-5 flex items-center gap-3">
                <div className="flex-1 border-t border-border" />
                <span className="text-xs text-foreground-subtle">or try a demo account</span>
                <div className="flex-1 border-t border-border" />
              </div>
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm-warm">
                <div className="divide-y divide-border">
                  {DEMO_ACCOUNTS.map(({ email, password, label, description, icon, badge, badgeColor }) => {
                    const isLoading = demoLoading === email;
                    const isDisabled = demoLoading !== null || isSubmitting || isGoogleLoading;
                    return (
                      <button
                        key={email}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => void loginAsDemo(email, password)}
                        className="group flex w-full items-center gap-4 px-5 py-4 text-left transition-all hover:bg-background-alt disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-background-alt text-lg group-hover:bg-background-elevated">
                          {icon}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-foreground">{label}</span>
                            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${badgeColor}`}>{badge}</span>
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-foreground-muted">{description}</span>
                        </span>
                        <span className="shrink-0">
                          {isLoading ? (
                            <svg className="h-4 w-4 animate-spin text-brand-600" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                          ) : (
                            <svg className="h-4 w-4 text-foreground-subtle transition-colors group-hover:text-foreground-muted" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="border-t border-border bg-background-alt px-5 py-2.5 text-center text-[11px] text-foreground-muted">
                  One click — instantly signed in, no password needed
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-foreground-muted">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-semibold text-brand-600 hover:underline">
          Sign up free
        </Link>
      </p>
    </motion.div>
  );
}
