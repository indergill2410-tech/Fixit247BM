import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@fixit247/ui';
import { SocialProofBar, TrustStatsBar } from '@/components/features/growth/social-proof-bar';
import { RecentActivityFeed } from '@/components/features/growth/recent-activity-feed';

export const metadata: Metadata = {
  title: 'Fixit247 | Emergency Trades Australia',
};

const TRADE_CATEGORIES = [
  { emoji: '🔧', label: 'Plumber', slug: 'plumbing' },
  { emoji: '⚡', label: 'Electrician', slug: 'electrical' },
  { emoji: '❄️', label: 'HVAC', slug: 'hvac' },
  { emoji: '🔑', label: 'Locksmith', slug: 'locksmith' },
  { emoji: '🏠', label: 'Roofer', slug: 'roofing' },
  { emoji: '🐛', label: 'Pest Control', slug: 'pest-control' },
  { emoji: '🪟', label: 'Glazier', slug: 'glazing' },
  { emoji: '🎨', label: 'Painter', slug: 'painting' },
];

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero — dark + yellow */}
      <section className="relative flex flex-1 flex-col items-center justify-center bg-[#0f0f0f] px-4 py-28 text-center text-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/8 px-4 py-1.5 text-sm font-medium text-brand-300 backdrop-blur-sm ring-1 ring-white/10">
            <span className="h-2 w-2 rounded-full bg-brand-400 animate-pulse" />
            Urgent Fix 24/7 — tradies online now
          </span>
          <h1 className="mt-6 text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Emergency repairs,<br />
            <span className="text-brand-400">fixed fast.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400 sm:text-xl">
            Plumbing, electrical, locksmith and more — get matched with verified local tradies, day or night, anywhere in Australia.
          </p>

          {/* Search bar */}
          <div className="mx-auto mt-10 flex max-w-lg items-center gap-3 rounded-2xl bg-white/8 p-2 ring-1 ring-white/10 backdrop-blur-sm">
            <span className="pl-3 text-gray-400">📍</span>
            <input
              type="text"
              placeholder="Your suburb or postcode"
              className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
              readOnly
            />
            <Link
              href="/emergency"
              className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-gray-900 hover:bg-brand-400 transition-colors"
            >
              Find tradies
            </Link>
          </div>

          {/* CTAs */}
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/jobs/new"
              className="rounded-xl bg-brand-500 px-7 py-3.5 text-sm font-bold text-gray-900 hover:bg-brand-400 transition-colors shadow-lg shadow-brand-500/20"
            >
              Post a job — it&apos;s free →
            </Link>
            <Link
              href="/join-as-tradie"
              className="rounded-xl border border-white/15 px-7 py-3.5 text-sm font-bold text-white hover:bg-white/8 transition-colors"
            >
              Tradies — join free
            </Link>
          </div>

          {/* Trust chips */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
            <span>✓ Free to post</span>
            <span>✓ Verified tradies</span>
            <span>✓ No credit card</span>
          </div>
        </div>
      </section>

      {/* Trade Categories */}
      <section className="bg-[#0f0f0f] border-t border-white/8 py-14">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="mb-2 text-center text-2xl font-bold text-white">What do you need fixed?</h2>
          <p className="mb-8 text-center text-sm text-gray-500">Tap a category for emergency dispatch near you</p>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
            {TRADE_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/emergency/${cat.slug}/sydney-cbd`}
                className="flex flex-col items-center gap-2 rounded-2xl border border-white/8 bg-white/4 p-3 text-center hover:border-brand-500/50 hover:bg-brand-500/8 transition-colors"
              >
                <span className="text-2xl">{cat.emoji}</span>
                <span className="text-xs font-medium text-gray-300">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="bg-[#111111] border-t border-white/8 py-10">
        <div className="container mx-auto max-w-4xl px-4">
          <TrustStatsBar />
        </div>
      </section>

      {/* Live Activity + Features grid */}
      <section className="bg-[#0f0f0f] border-t border-white/8 py-14">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-xl font-bold text-white">Happening right now</h2>
              <RecentActivityFeed />
            </div>
            <div>
              <h2 className="mb-4 text-xl font-bold text-white">Why Choose Fixit247?</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {FEATURES.map((feature) => (
                  <div key={feature.title} className="flex flex-col gap-2 rounded-2xl border border-white/8 bg-white/4 p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/15 text-xl">
                      {feature.icon}
                    </div>
                    <h3 className="text-sm font-semibold text-white">{feature.title}</h3>
                    <p className="text-xs text-gray-500">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const FEATURES = [
  {
    icon: '⚡',
    title: 'Emergency Response',
    description: 'Connect with available tradies in minutes. 24/7 emergency coverage across Australia.',
  },
  {
    icon: '🔒',
    title: 'Verified & Licenced',
    description: 'All tradies are background checked, licenced, and fully insured for your peace of mind.',
  },
  {
    icon: '💳',
    title: 'Secure Escrow Payments',
    description: 'Pay securely with card. Funds held in escrow until the job is completed to your satisfaction.',
  },
  {
    icon: '🤖',
    title: 'AI-Powered Matching',
    description: 'Smart matching technology connects you with the best tradie for your specific problem.',
  },
];
