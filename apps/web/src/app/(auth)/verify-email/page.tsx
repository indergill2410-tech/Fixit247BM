import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { Button } from '@fixit247/ui';

export const metadata: Metadata = { title: 'Verify Email' };

export default function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/20">
        <Mail className="h-8 w-8 text-brand-300" />
      </div>
      <h1 className="text-3xl font-bold text-white">Verify your email</h1>
      <p className="mt-4 text-brand-200">
        We&apos;ve sent a verification link to your email address. Click the link to activate your account and get started.
      </p>
      <p className="mt-3 text-sm text-brand-300/70">
        Check your spam folder if you don&apos;t see it within a few minutes.
      </p>
      <Button asChild size="lg" className="mt-8 bg-white font-semibold text-brand-700 hover:bg-white/90">
        <Link href="/login">Back to login</Link>
      </Button>
    </div>
  );
}
