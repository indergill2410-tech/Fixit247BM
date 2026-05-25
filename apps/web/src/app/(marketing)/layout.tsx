import Link from 'next/link';
import { MarketingNav } from '@/components/layout/marketing-nav';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <MarketingNav />

      <main>{children}</main>

      {/* ── Footer ── */}
      <footer className="border-t border-border bg-background-alt py-14 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-3 flex items-center gap-2 text-base font-extrabold text-foreground">
                <span className="text-brand-500">🔑</span>
                Fixit <span className="text-brand-500">24/7</span>
              </div>
              <p className="text-sm text-foreground-muted">
                Australia&apos;s trusted platform for emergency trade services — available 24/7.
              </p>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-foreground-subtle">Services</p>
              <div className="space-y-2 text-sm text-foreground-muted">
                <Link href="/emergency/plumbing/sydney-cbd" className="block transition-colors hover:text-foreground">Emergency Plumber</Link>
                <Link href="/emergency/electrical/sydney-cbd" className="block transition-colors hover:text-foreground">Emergency Electrician</Link>
                <Link href="/emergency/locksmith/sydney-cbd" className="block transition-colors hover:text-foreground">Emergency Locksmith</Link>
                <Link href="/fixit-plus" className="block transition-colors hover:text-foreground">Fixit Plus Membership</Link>
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-foreground-subtle">Company</p>
              <div className="space-y-2 text-sm text-foreground-muted">
                <Link href="/how-it-works" className="block transition-colors hover:text-foreground">How It Works</Link>
                <Link href="/pricing" className="block transition-colors hover:text-foreground">Pricing</Link>
                <Link href="/join-as-tradie" className="block transition-colors hover:text-foreground">Join as Tradie</Link>
                <Link href="/blog" className="block transition-colors hover:text-foreground">Blog</Link>
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-foreground-subtle">Support</p>
              <div className="space-y-2 text-sm text-foreground-muted">
                <a href="mailto:hello@fixit247.com.au" className="block transition-colors hover:text-foreground">hello@fixit247.com.au</a>
                <a href="tel:1800348498" className="block transition-colors hover:text-foreground">1800-FIXIT-247</a>
                <Link href="/emergency" className="block font-medium text-brand-600 transition-colors hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300">Emergency Dispatch →</Link>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center gap-2 border-t border-border pt-8 text-xs text-foreground-subtle sm:flex-row sm:justify-between">
            <span>© {new Date().getFullYear()} Fixit247 Pty Ltd. ABN 12 345 678 901. All rights reserved.</span>
            <div className="flex gap-4">
              <Link href="/privacy" className="transition-colors hover:text-foreground-muted">Privacy</Link>
              <Link href="/terms" className="transition-colors hover:text-foreground-muted">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
