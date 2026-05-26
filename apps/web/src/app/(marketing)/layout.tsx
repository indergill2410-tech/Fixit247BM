import Link from 'next/link';
import { MarketingNav } from '@/components/layout/marketing-nav';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <MarketingNav />

      <main>{children}</main>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.07] bg-[#080808] py-14">
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
                <Link href="/join-as-tradie" className="block hover:text-gray-300 transition-colors">Join as Tradie</Link>
                <Link href="/blog" className="block hover:text-gray-300 transition-colors">Blog</Link>
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">Support</p>
              <div className="space-y-2 text-sm text-gray-600">
                <a href="mailto:hello@fixit247.com.au" className="block hover:text-gray-300 transition-colors">hello@fixit247.com.au</a>
                <a href="tel:1800348498" className="block hover:text-gray-300 transition-colors">1800-FIXIT-247</a>
                <Link href="/emergency" className="block font-medium text-brand-400 hover:text-brand-300 transition-colors">Emergency Dispatch →</Link>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center gap-2 border-t border-white/6 pt-8 text-xs text-gray-700 sm:flex-row sm:justify-between">
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
