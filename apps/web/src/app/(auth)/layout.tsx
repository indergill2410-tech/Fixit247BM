import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  robots: { index: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-brand-400/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex h-16 items-center px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-lg">
            <span className="text-base font-black text-brand-700">F</span>
          </div>
          <span className="text-lg font-bold text-white">Fixit247</span>
        </Link>
      </header>

      {/* Content */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-xs text-brand-300/70">
        © {new Date().getFullYear()} Fixit247 Pty Ltd · ABN 00 000 000 000 ·{' '}
        <Link href="/privacy" className="hover:text-white">Privacy</Link>{' '}·{' '}
        <Link href="/terms" className="hover:text-white">Terms</Link>
      </footer>
    </div>
  );
}
