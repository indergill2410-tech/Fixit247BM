import type { Metadata } from 'next';
import Link from 'next/link';
import { Phone, Clock, CheckCircle, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Emergency Trades Australia | 24/7 Dispatch | Fixit247',
  description: 'Get emergency trade help now. Verified plumbers, electricians, locksmiths, HVAC technicians and roofers dispatched in under 60 minutes, 24/7 across Australia.',
  openGraph: {
    title: 'Emergency Trades Australia | 24/7 Dispatch | Fixit247',
    description: 'Get emergency trade help now. Verified tradies dispatched in under 60 minutes, 24/7 across Australia.',
    siteName: 'Fixit247',
    locale: 'en_AU',
    type: 'website',
  },
  alternates: { canonical: 'https://fixit247.com.au/emergency' },
  robots: { index: true, follow: true },
};

const EMERGENCY_TRADES = [
  { slug: 'plumbing', name: 'Plumbing', singular: 'Plumber', emoji: '🔧', examples: 'Burst pipes, blocked drains, hot water failure' },
  { slug: 'electrical', name: 'Electrical', singular: 'Electrician', emoji: '⚡', examples: 'Power outages, sparking outlets, exposed wiring' },
  { slug: 'locksmith', name: 'Locksmith', singular: 'Locksmith', emoji: '🔑', examples: 'Locked out, broken locks, security breach' },
  { slug: 'hvac', name: 'HVAC', singular: 'HVAC Technician', emoji: '❄️', examples: 'AC failure, gas leaks, heating breakdown' },
  { slug: 'roofing', name: 'Roofing', singular: 'Roofer', emoji: '🏠', examples: 'Storm damage, leaking roof, structural damage' },
  { slug: 'glazing', name: 'Glazing', singular: 'Glazier', emoji: '🪟', examples: 'Broken windows, smashed glass, security glazing' },
  { slug: 'pest-control', name: 'Pest Control', singular: 'Pest Controller', emoji: '🐛', examples: 'Termite swarms, rodent infestation, wasp nests' },
  { slug: 'general-maintenance', name: 'General Maintenance', singular: 'Handyman', emoji: '🛠️', examples: 'Urgent repairs, property damage, safety hazards' },
];

const RECENT_SUBURBS = [
  'Sydney CBD', 'Melbourne CBD', 'Brisbane CBD', 'Perth CBD',
  'Parramatta', 'Bondi', 'St Kilda', 'Southbank',
  'Gold Coast', 'Sunshine Coast', 'Fremantle', 'Glenelg',
];

const STATS = [
  { value: '2,847', label: 'Jobs completed this month' },
  { value: '< 60 min', label: 'Average response time' },
  { value: '4.9★', label: 'Customer rating' },
  { value: '24/7', label: 'Always available' },
];

const TRUST_POINTS = [
  { icon: '🔍', title: 'Background Checked', desc: 'Every tradie undergoes a police background check before joining.' },
  { icon: '📜', title: 'Fully Licensed', desc: 'All tradies hold valid Australian trade licences for their profession.' },
  { icon: '🛡️', title: 'Insured', desc: 'Public liability insurance of $20M+ covers every job on the platform.' },
  { icon: '⭐', title: 'Rated & Reviewed', desc: 'Real reviews from verified customers. Average 4.9 out of 5 stars.' },
];

export default function EmergencyHubPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 text-center md:py-28">
        <div className="pointer-events-none absolute inset-0 grid-pattern opacity-60" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[700px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-red-500/6 blur-[100px]" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[500px] -translate-x-1/2 rounded-full bg-brand-500/8 blur-[80px]" />
        <div className="relative z-10 mx-auto max-w-5xl px-4">
          <div className="mb-5 flex items-center justify-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-sm font-bold uppercase tracking-widest text-emerald-500 dark:text-emerald-400">Live · Tradies available right now</span>
          </div>

          <h1 className="text-[2.75rem] font-black leading-[1.06] tracking-tighter md:text-[4rem] lg:text-[5rem]">
            Emergency trade help,<br />
            <span className="text-gradient-brand">dispatched in minutes.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-foreground-muted sm:text-lg">
            Verified, licensed tradies dispatched to your door in under 60 minutes.
            Available 24 hours a day, 7 days a week, across Australia.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/jobs/new?emergency=true"
              className="group inline-flex items-center gap-2.5 rounded-2xl bg-brand-500 px-9 py-4 text-base font-extrabold text-gray-900 shadow-brand transition-all hover:bg-brand-400 hover:shadow-[0_0_50px_rgba(245,158,11,0.3)] active:scale-[0.98]"
            >
              <Zap size={18} />
              Get emergency help now
            </Link>
            <a
              href="tel:1800348498"
              className="inline-flex items-center gap-2.5 rounded-2xl border border-border px-9 py-4 text-base font-bold text-foreground transition-all hover:border-border-strong hover:bg-background-elevated active:scale-[0.98]"
            >
              <Phone size={18} />
              1800-FIXIT-247
            </a>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-background-elevated p-4 backdrop-blur-sm">
                <p className="text-2xl font-black text-brand-500">{s.value}</p>
                <p className="mt-1 text-xs text-foreground-subtle">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency trade links */}
      <section className="border-t border-border py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-2xl font-bold mb-2 text-center">
            Select Your Emergency Trade
          </h2>
          <p className="text-center text-foreground-subtle mb-10">
            Find a verified professional for your specific emergency
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {EMERGENCY_TRADES.map((t) => (
              <Link
                key={t.slug}
                href={`/emergency/${t.slug}/sydney-cbd`}
                className="flex items-start gap-4 rounded-2xl border border-border bg-background-elevated p-5 hover:border-brand-500/40 hover:bg-brand-500/8 transition-colors group"
              >
                <span className="text-3xl shrink-0">{t.emoji}</span>
                <div className="flex-1">
                  <p className="font-bold text-foreground group-hover:text-brand-500 transition-colors">
                    Emergency {t.singular} →
                  </p>
                  <p className="mt-0.5 text-sm text-foreground-subtle">{t.examples}</p>
                </div>
                <div className="shrink-0 rounded-full bg-brand-500/15 px-2.5 py-0.5 text-xs font-bold text-brand-500">
                  24/7
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border bg-background-alt py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-2xl font-bold mb-10 text-center">
            How Emergency Dispatch Works
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { step: '1', title: 'Describe Your Emergency', desc: 'Tell us what\'s happening. Our AI triages the urgency and identifies the right trade for your situation.', icon: '📋' },
              { step: '2', title: 'We Notify Local Tradies', desc: 'Verified tradies in your area are alerted instantly. The first available professional accepts your job.', icon: '📡' },
              { step: '3', title: 'Tradie En Route', desc: 'Track your tradie in real-time. Average arrival time across Australian cities: under 60 minutes.', icon: '🚗' },
            ].map((s) => (
              <div key={s.step} className="rounded-2xl border border-border bg-background-elevated p-6 text-center">
                <div className="mb-3 text-4xl">{s.icon}</div>
                <div className="mb-1 text-xs font-bold uppercase tracking-widest text-brand-500">Step {s.step}</div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="text-sm text-foreground-subtle">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="border-t border-border py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-2xl font-bold mb-10 text-center">
            Every Tradie is Verified
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_POINTS.map((p) => (
              <div key={p.title} className="rounded-2xl border border-border bg-background-elevated p-5 text-center">
                <div className="mb-3 text-3xl">{p.icon}</div>
                <h3 className="mb-2 font-semibold text-foreground">{p.title}</h3>
                <p className="text-sm text-foreground-subtle">{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-brand-500/30 bg-brand-500/8 p-5">
            <div className="flex items-start gap-3">
              <CheckCircle size={20} className="text-brand-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Satisfaction Guarantee</p>
                <p className="mt-1 text-sm text-foreground-muted">
                  Your payment is held securely in escrow and only released when you confirm the work is complete and you are satisfied. If something goes wrong, our support team steps in.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent suburbs */}
      <section className="border-t border-border bg-background-alt py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-2xl font-bold mb-2 text-center">
            Recently Served Suburbs
          </h2>
          <p className="text-center text-foreground-subtle mb-8">Emergency jobs completed in the last 24 hours</p>
          <div className="flex flex-wrap justify-center gap-3">
            {RECENT_SUBURBS.map((s) => (
              <span
                key={s}
                className="flex items-center gap-1.5 rounded-full border border-border bg-background-elevated px-4 py-2 text-sm text-foreground-muted"
              >
                <span className="h-2 w-2 rounded-full bg-brand-500" />
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border px-4 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Clock size={18} className="text-brand-500" />
            <span className="text-sm font-bold uppercase tracking-widest text-brand-500">Don&apos;t Wait</span>
          </div>
          <h2 className="text-3xl font-extrabold mb-4">
            Get Emergency Help in Minutes
          </h2>
          <p className="mb-8 text-foreground-muted">
            Post your emergency job for free. Our AI dispatch system connects you with the nearest available tradie immediately.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/jobs/new?emergency=true"
              className="inline-flex items-center gap-2 rounded-2xl bg-brand-500 px-10 py-5 text-lg font-bold text-gray-900 shadow-lg shadow-brand-500/20 hover:bg-brand-400 transition-colors"
            >
              <Zap size={20} />
              Get Help Now — It&apos;s Free to Post
            </Link>
            <a
              href="tel:1800348498"
              className="inline-flex items-center gap-2 text-foreground-subtle hover:text-foreground transition-colors"
            >
              <Phone size={18} />
              <span>or call 1800-FIXIT-247</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
