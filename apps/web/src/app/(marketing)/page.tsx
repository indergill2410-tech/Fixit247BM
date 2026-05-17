import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, Shield, Star, Zap } from 'lucide-react';
import { RecentActivityFeed } from '@/components/features/growth/recent-activity-feed';
import { HowItWorksTabs } from '@/components/features/marketing/how-it-works-tabs';

export const metadata: Metadata = {
  title: 'Fixit 24/7 | Verified Tradies, Any Job, Any Time',
  description: 'From a leaky tap to a full reno. Fixit 24/7 connects homeowners with verified local tradies — plumbing, electrical, HVAC, locksmith and more.',
};

const TRUST_CHIPS = [
  { icon: <Shield size={13} />, label: '4,800+ licence-verified tradies' },
  { icon: <Zap size={13} />, label: 'Free to post — no commission' },
  { icon: <Clock size={13} />, label: 'First response ~20 min' },
  { icon: <Star size={13} />, label: '4.8★ average rating' },
];

export default function HomePage() {
  return (
    <main className="flex flex-col bg-[#111111]">
      {/* ── Hero ── */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_340px] lg:items-start">

          {/* Left — headline + CTAs */}
          <div>
            {/* Availability chip */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-400">
              <Clock size={13} className="text-brand-400" />
              Available 24/7 across Australia
            </div>

            <h1 className="text-[3.5rem] font-extrabold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
              <span className="text-white">From a leaky tap</span><br />
              <span className="text-brand-400">to a full reno.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-gray-400 leading-relaxed">
              Plumbing, electrical, lockouts, HVAC, carpentry and more. Fixit 24/7 connects homeowners with verified local tradies — for any job, any time.
            </p>

            {/* Dual CTA cards */}
            <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
              {/* Homeowner card — yellow */}
              <Link
                href="/jobs/new"
                className="group flex items-center justify-between rounded-2xl bg-brand-400 p-5 transition-all hover:bg-brand-300"
              >
                <div>
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-black/15">
                    <span className="text-lg">🏠</span>
                  </div>
                  <p className="font-bold text-gray-900">I need a tradie</p>
                  <p className="mt-0.5 text-xs text-gray-800/70">Post any job free — get quotes in minutes</p>
                </div>
                <span className="ml-3 shrink-0 text-gray-900/50 transition-transform group-hover:translate-x-0.5">›</span>
              </Link>

              {/* Tradie card — dark */}
              <Link
                href="/join-as-tradie"
                className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5 transition-all hover:bg-white/8"
              >
                <div>
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/20">
                    <span className="text-lg">👷</span>
                  </div>
                  <p className="font-bold text-white">I&apos;m a tradie</p>
                  <p className="mt-0.5 text-xs text-gray-500">$111 AUD in free job leads — every month for 6 months</p>
                </div>
                <span className="ml-3 shrink-0 text-gray-600 transition-transform group-hover:translate-x-0.5">›</span>
              </Link>
            </div>

            {/* Trust chips */}
            <div className="mt-6 flex flex-wrap gap-2">
              {TRUST_CHIPS.map((chip) => (
                <span
                  key={chip.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/4 px-3 py-1.5 text-xs text-gray-400"
                >
                  <span className="text-brand-400">{chip.icon}</span>
                  {chip.label}
                </span>
              ))}
            </div>
          </div>

          {/* Right — live activity */}
          <div className="lg:pt-4">
            <RecentActivityFeed />
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="border-t border-white/8 bg-[#0f0f0f] px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-brand-400">Simple Process</p>
            <h2 className="text-4xl font-extrabold text-white">How it works</h2>
            <p className="mt-3 text-gray-500">
              Whether you need a repair sorted or you&apos;re a tradie looking for work — we make it simple.
            </p>
          </div>
          <HowItWorksTabs />
        </div>
      </section>

      {/* ── Trade categories ── */}
      <section className="border-t border-white/8 px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-2 text-center text-2xl font-bold text-white">What do you need fixed?</h2>
          <p className="mb-8 text-center text-sm text-gray-500">Tap a category and get matched instantly</p>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
            {TRADE_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/emergency/${cat.slug}/sydney-cbd`}
                className="flex flex-col items-center gap-2 rounded-2xl border border-white/8 bg-white/4 p-3 text-center transition-all hover:border-brand-500/40 hover:bg-brand-500/8"
              >
                <span className="text-2xl">{cat.emoji}</span>
                <span className="text-xs font-medium text-gray-400">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Fixit 24/7 ── */}
      <section className="border-t border-white/8 bg-[#0f0f0f] px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-white">Why Fixit 24/7?</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl border border-white/8 bg-white/4 p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/15 text-xl">
                  {f.icon}
                </div>
                <h3 className="text-sm font-semibold text-white">{f.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="border-t border-white/8 px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-white">Trusted by thousands of Australians</h2>
            <p className="mt-2 text-sm text-gray-500">Real jobs. Real tradies. Real results.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-2xl border border-white/8 bg-white/4 p-5">
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} className="fill-brand-400 text-brand-400" />
                  ))}
                </div>
                <p className="mb-4 text-sm text-gray-300">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-gray-600">{t.suburb}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fixit Plus Banner ── */}
      <section className="border-t border-white/8 bg-[#0f0f0f] px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl border border-brand-500/25 bg-gradient-to-br from-brand-500/10 to-transparent p-8 md:p-12">
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl" />
            <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-brand-500/20 px-3 py-1 text-xs font-bold text-brand-400">
                  <Shield size={11} /> NEW — Fixit Plus
                </span>
                <h2 className="text-3xl font-extrabold text-white">
                  Peace of mind,<br />
                  <span className="text-brand-400">home or on the road.</span>
                </h2>
                <p className="mt-4 text-gray-400 text-sm leading-relaxed">
                  One flat monthly fee. Unlimited call-outs. Priority dispatch. Whether your pipe bursts at 2am or you&apos;re locked out of your car.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/fixit-plus" className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-gray-900 hover:bg-brand-400 transition-colors">
                    Learn more →
                  </Link>
                  <Link href="/auth/register?plan=fixit-plus-total" className="rounded-xl border border-white/15 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/8 transition-colors">
                    Start free trial
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: '🏠', title: 'Home Cover', desc: 'Plumbing, electrical, locksmith' },
                  { icon: '🚗', title: 'On The Road', desc: 'Car lockouts & roadside jobs' },
                  { icon: '⚡', title: 'Priority Dispatch', desc: 'Avg 28 min response' },
                  { icon: '💰', title: '$0 Call-out Fee', desc: 'Flat monthly, no surprises' },
                ].map((f) => (
                  <div key={f.title} className="rounded-2xl border border-white/8 bg-white/4 p-4">
                    <div className="mb-2 text-xl">{f.icon}</div>
                    <p className="text-xs font-semibold text-white">{f.title}</p>
                    <p className="mt-0.5 text-xs text-gray-500">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="border-t border-white/8 px-4 py-20 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="text-3xl font-extrabold text-white">Ready to get started?</h2>
          <p className="mt-4 text-gray-500">Free to post. Verified professionals. Secure payments.</p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/jobs/new" className="rounded-xl bg-brand-400 px-8 py-4 text-sm font-bold text-gray-900 hover:bg-brand-300 transition-colors">
              Post your first job — it&apos;s free →
            </Link>
            <Link href="/emergency" className="rounded-xl border border-white/15 px-8 py-4 text-sm font-bold text-white hover:bg-white/8 transition-colors">
              Emergency dispatch →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

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

const FEATURES = [
  { icon: '⚡', title: 'Emergency Response', description: 'Connect with available tradies in minutes. 24/7 coverage across Australia.' },
  { icon: '🔒', title: 'Verified & Licenced', description: 'Background checked, licenced, and fully insured for your peace of mind.' },
  { icon: '💳', title: 'Secure Escrow', description: 'Pay by card. Funds held in escrow until the job is done to your satisfaction.' },
  { icon: '🤖', title: 'AI Matching', description: 'Smart technology connects you with the best-fit tradie for your specific problem.' },
];

const TESTIMONIALS = [
  { name: 'Sarah M.', suburb: 'Bondi, NSW', text: 'Plumber arrived in 34 minutes at 11pm. Absolute lifesaver.' },
  { name: 'James K.', suburb: 'Richmond, VIC', text: 'Electrician fixed our switchboard same day. Fast and professional.' },
  { name: 'Priya R.', suburb: 'Fortitude Valley, QLD', text: 'Locked out at midnight — locksmith there in 25 mins. Amazing.' },
];
