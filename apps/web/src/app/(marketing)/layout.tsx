import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-extrabold text-gray-900">
            <Zap size={24} className="text-brand-600" />
            Fixit 24/7
          </Link>
          <div className="hidden items-center gap-6 text-sm font-medium text-gray-600 md:flex">
            <Link href="/how-it-works" className="hover:text-gray-900">How It Works</Link>
            <Link href="/pricing" className="hover:text-gray-900">Pricing</Link>
            <Link href="/join-as-tradie" className="hover:text-gray-900">For Tradies</Link>
            <Link href="/emergency" className="text-red-600 font-semibold hover:text-red-700">Emergency</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">Log in</Link>
            <Link href="/emergency" className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 transition-colors">
              Get Help Now
            </Link>
          </div>
        </div>
      </nav>

      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 text-lg font-extrabold text-gray-900 mb-3">
                <Zap size={20} className="text-brand-600" />
                Fixit 24/7
              </div>
              <p className="text-sm text-gray-500">Australia&apos;s #1 emergency tradie platform. Available 24/7.</p>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold text-gray-900">Services</p>
              <div className="space-y-2 text-sm text-gray-500">
                <Link href="/emergency/plumbing/sydney-cbd" className="block hover:text-gray-700">Emergency Plumber</Link>
                <Link href="/emergency/electrical/sydney-cbd" className="block hover:text-gray-700">Emergency Electrician</Link>
                <Link href="/emergency/locksmith/sydney-cbd" className="block hover:text-gray-700">Emergency Locksmith</Link>
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold text-gray-900">Company</p>
              <div className="space-y-2 text-sm text-gray-500">
                <Link href="/how-it-works" className="block hover:text-gray-700">How It Works</Link>
                <Link href="/pricing" className="block hover:text-gray-700">Pricing</Link>
                <Link href="/join-as-tradie" className="block hover:text-gray-700">Join as Tradie</Link>
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold text-gray-900">Support</p>
              <div className="space-y-2 text-sm text-gray-500">
                <a href="mailto:hello@fixit247.com.au" className="block hover:text-gray-700">hello@fixit247.com.au</a>
                <a href="tel:1800348498" className="block hover:text-gray-700">1800-FIXIT-247</a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Fixit 24/7 Pty Ltd. ABN 12 345 678 901. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
