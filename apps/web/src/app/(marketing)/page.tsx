import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Star, Clock } from 'lucide-react';
import { SocialProofBar, TrustStatsBar } from '@/components/features/growth/social-proof-bar';
import { RecentActivityFeed } from '@/components/features/growth/recent-activity-feed';

export const metadata: Metadata = {
  title: 'Fixit247 | Emergency Trades Australia — 24/7 Dispatch',
  description: 'Emergency plumber, electrician, locksmith and more. Verified local tradies dispatched in under 60 minutes, day or night, anywhere in Australia.',
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

const SOCIAL_PROOF_ITEMS = [
  { name: 'Sarah M.', suburb: 'Bondi, NSW', text: 'Plumber arrived in 34 minutes at 11pm. Absolute lifesaver.', stars: 5 },
  { name: 'James K.', suburb: 'Richmond, VIC', text: 'Electrician fixed our switchboard same day. Fast and professional.', stars: 5 },
  { name: 'Priya R.', suburb: 'Fortitude Valley, QLD', text: 'Locked out at midnight — locksmith there in 25 mins. Amazing.', stars: 5 },
];

export default function HomePage() {
  return (
    <main className="flex flex-col bg-[#0f0f0f]">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-4 py-28 text-center text-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl" />
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
            <span>✓ Secure escrow payments</span>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="border-t border-white/8 bg-[#111111] py-4">
        <div className="container mx-auto max-w-5xl px-4">
          <SocialProofBar />
        </div>
      </section>

      {/* Trade Categories */}
      <section className="border-t border-white/8 py-14">
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
      <section className="border-t border-white/8 bg-[#111111] py-10">
        <div className="container mx-auto max-w-4xl px-4">
          <TrustStatsBar />
        </div>
      </section>

      {/* Fixit Plus Banner */}
      <section className="border-t border-white/8 py-14">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="relative overflow-hidden rounded-3xl border border-brand-500/30 bg-gradient-to-br from-brand-500/10 via-brand-500/5 to-transparent p-8 md:p-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl" />
            <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-brand-500/20 px-3 py-1 text-xs font-bold text-brand-400">
                  <Shield size={12} />
                  NEW — Fixit Plus
                </span>
                <h2 className="text-3xl font-extrabold text-white">
                  Peace of mind,<br />
                  <span className="text-brand-400">at home or on the road.</span>
                </h2>
                <p className="mt-4 text-gray-400">
                  One flat monthly fee. Unlimited call-outs. Priority dispatch. Whether your pipe bursts at 2am or you&apos;re locked out of your car — we&apos;ve got you covered.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/fixit-plus"
                    className="rounded-xl bg-brand-500 px-6 py-3 text-sm font-bold text-gray-900 hover:bg-brand-400 transition-colors"
                  >
                    Learn about Fixit Plus →
                  </Link>
                  <Link
                    href="/auth/register?plan=fixit-plus-total"
                    className="rounded-xl border border-white/15 px-6 py-3 text-sm font-bold text-white hover:bg-white/8 transition-colors"
                  >
                    Start free trial
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: '🏠', title: 'Home Cover', desc: 'Plumbing, electrical, locksmith & more' },
                  { icon: '🚗', title: 'On The Road', desc: 'Car lockouts & roadside trade emergencies' },
                  { icon: '⚡', title: 'Priority Dispatch', desc: 'Jump the queue — avg 28 min response' },
                  { icon: '💰', title: '$0 Call-out Fee', desc: 'Flat monthly. No per-job surprises.' },
                ].map((f) => (
                  <div key={f.title} className="rounded-2xl border border-white/8 bg-white/4 p-4">
                    <div className="mb-2 text-2xl">{f.icon}</div>
                    <p className="text-sm font-semibold text-white">{f.title}</p>
                    <p className="mt-1 text-xs text-gray-500">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Activity + Features */}
      <section className="border-t border-white/8 bg-[#111111] py-14">
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

      {/* Social proof testimonials */}
      <section className="border-t border-white/8 py-14">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-white">Trusted by thousands of Australians</h2>
            <p className="mt-2 text-sm text-gray-500">Real jobs. Real tradies. Real results.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {SOCIAL_PROOF_ITEMS.map((item) => (
              <div key={item.name} className="rounded-2xl border border-white/8 bg-white/4 p-5">
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: item.stars }).map((_, i) => (
                    <Star key={i} size={14} className="fill-brand-400 text-brand-400" />
                  ))}
                </div>
                <p className="mb-4 text-sm text-gray-300">&ldquo;{item.text}&rdquo;</p>
                <div>
                  <p className="text-sm font-semibold text-white">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.suburb}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA banner */}
      <section className="border-t border-white/8 bg-[#111111] px-4 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="mb-3 flex items-center justify-center gap-2 text-brand-400">
            <Clock size={18} />
            <span className="text-sm font-bold uppercase tracking-widest">Average 28-min response</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            Need a tradie right now?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-gray-400">
            Free to post. Verified professionals. Secure payments. Available 24/7 across Australia.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/jobs/new"
              className="rounded-xl bg-brand-500 px-8 py-4 text-base font-bold text-gray-900 hover:bg-brand-400 transition-colors shadow-lg shadow-brand-500/20"
            >
              Post a job — it&apos;s free →
            </Link>
            <Link
              href="/emergency"
              className="rounded-xl border border-white/15 px-8 py-4 text-base font-bold text-white hover:bg-white/8 transition-colors"
            >
              Emergency dispatch →
            </Link>
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
