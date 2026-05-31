'use client';

import { AuthProvider } from '@/hooks/use-auth';
import { PHProvider } from '@/components/analytics/posthog-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PHProvider>
      <AuthProvider>{children}</AuthProvider>
    </PHProvider>
  );
}
