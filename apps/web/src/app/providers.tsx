'use client';

import { AuthProvider } from '@/hooks/use-auth';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { PHProvider } from '@/components/analytics/posthog-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PHProvider>
      <ThemeProvider defaultTheme="dark">
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </PHProvider>
  );
}
