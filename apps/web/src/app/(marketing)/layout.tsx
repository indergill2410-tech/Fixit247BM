import Link from 'next/link';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#111111]">
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-white/8 bg-[#111111]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-base font-extrabold text-white">
            <span className="text-brand-400">🔑</span>
            Fixit <span className="text-brand-400">24/7</span>
          </Link>

          {/* Centre links */}
          <div className="hidden items-center gap-1 md:flex">
            <Link
              href="/how-it-works"
              className="rounded-xl px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-white/6 hover:text-white"
            >
              How it works
            </Link>
            <Link
              href="/fixit-plus"
              className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-white/6 hover:text-white"
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full border border-current text-[10px] font-bold">+</span>
              Plus
            </Link>
            <Link
              href="/join-as-tradie"
              className="rounded-xl px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-white/6 hover:text-white"
            >
              For Tradies
            </Link>
            <Link
              href="/how-it-works"
              className="rounded-xl px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-white/6 hover:text-white"
            >
              About
            </Link>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/auth/login"
              className="rounded-xl px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:text-white"
            >
              Sign in
            </Link>
            <Link
              href="/auth/register"
              className="rounded-xl bg-brand-400 px-4 py-2 text-sm font-bold text-gray-900 transition-colors hover:bg-brand-300"
            >
              Create account
            </Link>
          </div>
        </div>
      </nav>

      <main>{children}</main>

      {/* ── Footer ── */}
      <footer className="border-t border-white/8 bg-[#0d0d0d] py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-3 flex items-center gap-2 text-base font-extrabold text-white">
                <span className="text-brand-400">🔑</span>
                Fixit <span className="text-brand-400">24/7</span>
              </div>
              <p className="text-sm text-gray-600">Australia&apos;s trusted platform for emergency trade services — available 24/7.</p>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">Services</p>
              <div className="space-y-2 text-sm text-gray-600">
                <Link href="/emergency/plumbing/sydney-cbd" className="block hover:text-gray-300 transition-colors">Emergency Plumber</Link>
                <Link href="/emergency/electrical/sydney-cbd" className="block hover:text-gray-300 transition-colors">Emergency Electrician</Link>
                <Link href="/emergency/locksmith/sydney-cbd" className="block hover:text-gray-300 transition-colors">Emergency Locksmith</Link>
                <Link href="/fixit-plus" className="block hover:text-gray-300 transition-colors">Fixit Plus Membership</Link>
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">Company</p>
              <div className="space-y-2 text-sm text-gray-600">
                <Link href="/how-it-works" className="block hover:text-gray-300 transition-colors">How It Works</Link>
                <Link href="/pricing" className="block hover:text-gray-300 transition-colors">Pricing</Link>
                <Link href="/join-as-tradie" className="block hover:text-gray-300 transition-colors">Join as Tradie</Link>
                <Link href="/blog" className="block hover:text-gray-300 transition-colors">Blog</Link>
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">Support</p>
              <div className="space-y-2 text-sm text-gray-600">
                <a href="mailto:hello@fixit247.com.au" className="block hover:text-gray-300 transition-colors">hello@fixit247.com.au</a>
                <a href="tel:1800348498" className="block hover:text-gray-300 transition-colors">1800-FIXIT-247</a>
                <Link href="/emergency" className="block text-brand-400 hover:text-brand-300 transition-colors font-medium">Emergency Dispatch →</Link>
              </div>
            </div>
          </div>
          <div className="mt-10 border-t border-white/6 pt-8 flex flex-col items-center gap-2 sm:flex-row sm:justify-between text-xs text-gray-700">
            <span>© {new Date().getFullYear()} Fixit247 Pty Ltd. ABN 12 345 678 901. All rights reserved.</span>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
