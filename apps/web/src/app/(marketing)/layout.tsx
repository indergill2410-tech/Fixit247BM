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

          {/* Trust bar */}
          <div className="mb-10 flex flex-wrap items-center justify-center gap-6 border-b border-border pb-10">
            {[
              { label: 'Background checked tradies' },
              { label: 'Licence verified' },
              { label: 'Secure escrow payments' },
              { label: 'Available 24/7 across Australia' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-xs text-foreground-muted">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-500/20 text-brand-600 text-[10px] font-bold">✓</span>
                {item.label}
              </div>
            ))}
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-3 flex items-center gap-2 text-base font-extrabold text-foreground">
                <span className="text-brand-500">🔑</span>
                Fixit <span className="text-brand-500">24/7</span>
              </div>
              <p className="text-sm text-foreground-muted leading-relaxed">
                Australia&apos;s emergency trade platform. Verified tradies dispatched in minutes — any hour, any day.
              </p>
              <div className="mt-4 flex gap-3">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-foreground-subtle hover:text-foreground transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-foreground-subtle hover:text-foreground transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-foreground-subtle hover:text-foreground transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
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
                <Link href="/about" className="block transition-colors hover:text-foreground">About Us</Link>
                <Link href="/join-as-tradie" className="block transition-colors hover:text-foreground">Join as Tradie</Link>
                <Link href="/blog" className="block transition-colors hover:text-foreground">Blog</Link>
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-foreground-subtle">Support</p>
              <div className="space-y-2 text-sm text-foreground-muted">
                <a href="mailto:hello@fixit247.com.au" className="block transition-colors hover:text-foreground">hello@fixit247.com.au</a>
                <a href="tel:1800348498" className="block transition-colors hover:text-foreground">1800-FIXIT-247</a>
                <p className="text-[11px] text-foreground-subtle">Available 24 hours, 7 days</p>
                <Link href="/emergency" className="mt-1 block font-medium text-brand-600 transition-colors hover:text-brand-500">Emergency Dispatch →</Link>
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
