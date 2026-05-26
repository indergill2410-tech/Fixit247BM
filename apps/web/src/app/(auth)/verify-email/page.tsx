'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { Button } from '@fixit247/ui';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const [resent, setResent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  async function handleResend() {
    if (!email || loading) return;
    setLoading(true);
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.resend({ type: 'signup', email });
    setResent(true);
    setLoading(false);
  }

  return (
    <div className="text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/20">
        <Mail className="h-8 w-8 text-brand-300" />
      </div>
      <h1 className="text-3xl font-bold text-white">Verify your email</h1>
      <p className="mt-4 text-brand-200">
        We&apos;ve sent a verification link to{' '}
        {email && <span className="font-semibold text-white">{email}</span>}.
        {' '}Click the link to activate your account and get started.
      </p>
      <p className="mt-3 text-sm text-brand-300/70">
        Check your spam folder if you don&apos;t see it within a few minutes.
      </p>

      {resent ? (
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-green-400">
          <CheckCircle size={16} />
          Verification email resent!
        </div>
      ) : email ? (
        <button
          onClick={() => void handleResend()}
          disabled={loading}
          className="mt-6 text-sm text-brand-300 underline-offset-2 hover:underline disabled:opacity-60"
        >
          {loading ? 'Sending…' : "Didn't receive it? Resend verification email"}
        </button>
      ) : null}

      <Button asChild size="lg" className="mt-8 bg-white font-semibold text-brand-700 hover:bg-white/90">
        <Link href="/login">Back to login</Link>
      </Button>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
