import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  robots: { index: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background-alt">
      {/* Header */}
      <header className="relative z-10 flex h-16 items-center px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/15 shadow-lg">
            <span className="text-base font-black text-brand-600">F</span>
          </div>
          <span className="text-lg font-bold text-foreground">Fixit247</span>
        </Link>
      </header>

      {/* Content */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-xs text-foreground-subtle">
        © {new Date().getFullYear()} Fixit247 Pty Ltd · ABN 00 000 000 000 ·{' '}
        <Link href="/privacy" className="hover:text-foreground-muted transition-colors">Privacy</Link>{' '}·{' '}
        <Link href="/terms" className="hover:text-foreground-muted transition-colors">Terms</Link>
      </footer>
    </div>
  );
}
