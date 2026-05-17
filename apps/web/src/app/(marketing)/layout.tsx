import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/8 bg-[#0f0f0f]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-extrabold text-white">
            <Zap size={22} className="text-brand-400" />
            Fixit<span className="text-brand-400">247</span>
          </Link>
          <div className="hidden items-center gap-6 text-sm font-medium text-gray-400 md:flex">
            <Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/fixit-plus" className="hover:text-white transition-colors">
              Fixit <span className="text-brand-400">Plus</span>
            </Link>
            <Link href="/join-as-tradie" className="hover:text-white transition-colors">For Tradies</Link>
            <Link href="/emergency" className="font-semibold text-brand-400 hover:text-brand-300 transition-colors">Emergency</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Log in</Link>
            <Link href="/emergency" className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-bold text-gray-900 hover:bg-brand-400 transition-colors">
              Get Help Now
            </Link>
          </div>
        </div>
      </nav>

      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-white/8 bg-[#111111] py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 text-lg font-extrabold text-white mb-3">
                <Zap size={18} className="text-brand-400" />
                Fixit<span className="text-brand-400">247</span>
              </div>
              <p className="text-sm text-gray-500">Australia&apos;s #1 emergency tradie platform. Available 24/7.</p>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold text-white">Services</p>
              <div className="space-y-2 text-sm text-gray-500">
                <Link href="/emergency/plumbing/sydney-cbd" className="block hover:text-gray-300 transition-colors">Emergency Plumber</Link>
                <Link href="/emergency/electrical/sydney-cbd" className="block hover:text-gray-300 transition-colors">Emergency Electrician</Link>
                <Link href="/emergency/locksmith/sydney-cbd" className="block hover:text-gray-300 transition-colors">Emergency Locksmith</Link>
                <Link href="/fixit-plus" className="block hover:text-gray-300 transition-colors">Fixit Plus Membership</Link>
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold text-white">Company</p>
              <div className="space-y-2 text-sm text-gray-500">
                <Link href="/how-it-works" className="block hover:text-gray-300 transition-colors">How It Works</Link>
                <Link href="/pricing" className="block hover:text-gray-300 transition-colors">Pricing</Link>
                <Link href="/join-as-tradie" className="block hover:text-gray-300 transition-colors">Join as Tradie</Link>
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold text-white">Support</p>
              <div className="space-y-2 text-sm text-gray-500">
                <a href="mailto:hello@fixit247.com.au" className="block hover:text-gray-300 transition-colors">hello@fixit247.com.au</a>
                <a href="tel:1800348498" className="block hover:text-gray-300 transition-colors">1800-FIXIT-247</a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-white/8 pt-8 text-center text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Fixit247 Pty Ltd. ABN 12 345 678 901. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
