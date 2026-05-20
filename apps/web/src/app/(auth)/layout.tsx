import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  robots: { index: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#080808]">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/[0.07] blur-[120px]" />
        <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-brand-600/[0.06] blur-[80px]" />
        <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-brand-500/[0.05] blur-[60px]" />
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
      <footer className="relative z-10 py-6 text-center text-xs text-gray-700">
        © {new Date().getFullYear()} Fixit247 Pty Ltd · ABN 00 000 000 000 ·{' '}
        <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy</Link>{' '}·{' '}
        <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms</Link>
      </footer>
    </div>
  );
}
