import type { Metadata } from 'next';
import { requireRole } from '@/lib/auth/session';
import { TradieOnboarding } from '@/components/features/onboarding/tradie-onboarding';

export const metadata: Metadata = { title: 'Join as a Tradie' };

export default async function TradieOnboardingPage() {
  await requireRole('TRADIE');
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-0 h-1/2 w-1/2 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute -right-1/4 bottom-0 h-1/2 w-1/2 rounded-full bg-brand-400/10 blur-3xl" />
      </div>
      <div className="relative z-10 flex flex-1 items-center justify-center p-4 py-12">
        <TradieOnboarding />
      </div>
    </div>
  );
}
