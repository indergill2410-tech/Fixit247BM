import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock, MapPin, Phone, Shield, Star, Zap } from 'lucide-react';
import { RecentActivityFeed } from '@/components/features/growth/recent-activity-feed';
import { HowItWorksTabs } from '@/components/features/marketing/how-it-works-tabs';

export const metadata: Metadata = {
  title: 'Fixit 24/7 | Emergency Tradies, Verified & Available Now',
  description: 'Australia\'s most trusted emergency trades platform. Verified plumbers, electricians, locksmiths & more — dispatched in minutes, 24/7.',
};

export default function HomePage() {
  return (
    <main className="flex flex-col bg-[#0a0a0a]">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Background grid + glow */}
        <div className="pointer-events-none absolute inset-0 grid-pattern opacity-100" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/8 blur-[120px]" />
        <div className="pointer-events-none absolute -right-64 top-1/3 h-96 w-96 rounded-full bg-brand-500/5 blur-[80px]" />

        <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-14 md:pb-24 md:pt-20 lg:pb-28 lg:pt-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:items-start xl:grid-cols-[1fr_400px]">

            {/* Left column */}
            <div className="flex flex-col">
              {/* Live status badge */}
              <div className="mb-8 inline-flex w-fit items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-gray-400 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-gray-300">247 tradies online right now</span>
                <span className="ml-1 rounded-full bg-brand-500/20 px-2 py-0.5 text-[10px] font-bold text-brand-400">LIVE</span>
              </div>

              {/* Main headline */}
              <h1 className="text-[3.25rem] font-black leading-[1.04] tracking-tighter text-white sm:text-[4rem] lg:text-[5rem] xl:text-[5.5rem]">
                Emergency tradie,<br />
                <span className="text-gradient-brand">dispatched in</span><br />
                <span className="text-white">minutes.</span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-relaxed text-gray-400 sm:text-lg lg:text-base xl:text-lg">
                Plumbing, electrical, lockouts, HVAC. Australia&apos;s largest network of verified, insured tradies — available every hour of every day.
              </p>

              {/* Primary CTA row */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/emergency"
                  className="group inline-flex items-center justify-center gap-2.5 rounded-2xl bg-brand-500 px-7 py-4 text-sm font-bold text-gray-900 shadow-brand transition-all hover:bg-brand-400 hover:shadow-[0_0_50px_rgba(245,158,11,0.3)] active:scale-[0.98]"
                >
                  <Phone size={16} className="shrink-0" />
                  Get emergency help now
                  <ArrowRight size={15} className="shrink-0 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/jobs/new"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/[0.04] px-7 py-4 text-sm font-semibold text-white transition-all hover:border-white/20 hover:bg-white/[0.07] active:scale-[0.98]"
                >
                  Post a job — free
                </Link>
              </div>

              {/* Trust row */}
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                {TRUST_ITEMS.map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-xs text-gray-500">
                    <item.icon size={13} className="shrink-0 text-brand-500" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Platform stats */}
              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/[0.06] pt-8 sm:grid-cols-3">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <div className="text-2xl font-black text-white lg:text-3xl">{s.value}</div>
                    <div className="mt-0.5 text-xs text-gray-600">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column — live feed */}
            <div className="lg:pt-2">
              <RecentActivityFeed />
            </div>
          </div>
        </div>
      </section>

      {/* ── Trade category grid ── */}
      <section className="border-t border-white/[0.06] bg-[#0d0d0d] px-4 py-14">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-500">All trades covered</p>
            <h2 className="text-2xl font-bold text-white">What do you need fixed?</h2>
          </div>
          <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-8">
            {TRADE_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/emergency/${cat.slug}/sydney-cbd`}
                className="group flex flex-col items-center gap-2.5 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3.5 text-center transition-all hover:border-brand-500/30 hover:bg-brand-500/[0.06] active:scale-[0.97]"
              >
                <span className="text-2xl transition-transform group-hover:scale-110">{cat.emoji}</span>
                <span className="text-[11px] font-medium text-gray-500 group-hover:text-gray-300">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="border-t border-white/[0.06] px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-500">Simple process</p>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">From post to fixed — fast</h2>
            <p className="mx-auto mt-3 max-w-lg text-gray-500">
              Whether you need a repair sorted today or you&apos;re a tradie looking for steady work.
            </p>
          </div>
          <HowItWorksTabs />
        </div>
      </section>

      {/* ── Why Fixit 24/7 ── */}
      <section className="border-t border-white/[0.06] bg-[#0d0d0d] px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-500">Built different</p>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Why 30,000+ Australians choose us</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 transition-all hover:border-brand-500/20 hover:bg-brand-500/[0.04]"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/12 text-xl transition-transform group-hover:scale-110">
                  {f.icon}
                </div>
                <h3 className="text-sm font-semibold text-white">{f.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-500">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social proof — Tradie CTA ── */}
      <section className="border-t border-white/[0.06] px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0d0d0d] p-8 md:p-12">
            {/* Background accent */}
            <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-brand-500/8 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-brand-500/5 blur-2xl" />

            <div className="relative grid gap-10 md:grid-cols-2 md:items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/25 bg-brand-500/10 px-3 py-1.5 text-xs font-bold text-brand-400">
                  👷 For Tradies
                </div>
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                  Grow your trade business.<br />
                  <span className="text-gradient-brand">On your terms.</span>
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-gray-500">
                  Join 4,800+ verified tradies earning consistent income from verified homeowners. Set your availability, choose your jobs, get paid securely.
                </p>
                <ul className="mt-5 space-y-2">
                  {TRADIE_BENEFITS.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-gray-400">
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-brand-500" />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href="/join-as-tradie"
                    className="inline-flex items-center gap-2 rounded-2xl bg-brand-500 px-6 py-3 text-sm font-bold text-gray-900 transition-all hover:bg-brand-400"
                  >
                    Start free — 6 months included
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/[0.06]"
                  >
                    View pricing
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {TRADIE_STATS.map((s) => (
                  <div key={s.label} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5">
                    <div className="text-2xl font-black text-brand-400">{s.value}</div>
                    <div className="mt-1 text-xs font-medium text-white">{s.label}</div>
                    <div className="mt-0.5 text-[11px] text-gray-600">{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="border-t border-white/[0.06] bg-[#0d0d0d] px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-500">Real people, real results</p>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Trusted by thousands of Australians</h2>
            <div className="mt-4 flex items-center justify-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="fill-brand-400 text-brand-400" />
              ))}
              <span className="ml-2 text-sm font-semibold text-white">4.8</span>
              <span className="text-sm text-gray-600">/ 5 from 3,200+ reviews</span>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="flex flex-col rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
                <div className="mb-3 flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="fill-brand-400 text-brand-400" />
                  ))}
                </div>
                <p className="flex-1 text-sm leading-relaxed text-gray-300">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-4 flex items-center gap-3 border-t border-white/[0.06] pt-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/15 text-xs font-bold text-brand-400">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{t.name}</p>
                    <p className="flex items-center gap-1 text-[11px] text-gray-600">
                      <MapPin size={9} />
                      {t.suburb}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fixit Plus membership banner ── */}
      <section className="border-t border-white/[0.06] px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl border border-brand-500/20 bg-gradient-to-br from-brand-500/[0.08] via-brand-500/[0.04] to-transparent p-8 md:p-12">
            <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-brand-500/10 blur-[80px]" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-64 rounded-full bg-brand-500/5 blur-3xl" />

            <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/15 px-3 py-1.5 text-xs font-bold text-brand-400">
                  <Shield size={11} />
                  Fixit Plus Membership
                </span>
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                  Unlimited call-outs.<br />
                  <span className="text-gradient-brand">One flat fee.</span>
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-gray-400">
                  Home or on the road — pipe bursts at 2am, locked out of your car, power failure. One monthly fee covers it all.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/fixit-plus"
                    className="inline-flex items-center gap-2 rounded-2xl bg-brand-500 px-6 py-3 text-sm font-bold text-gray-900 transition-all hover:bg-brand-400"
                  >
                    Learn more
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="/register?plan=fixit-plus-total"
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/[0.06]"
                  >
                    Start free trial
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {PLUS_FEATURES.map((f) => (
                  <div key={f.title} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
                    <div className="mb-2 text-xl">{f.icon}</div>
                    <p className="text-xs font-semibold text-white">{f.title}</p>
                    <p className="mt-0.5 text-[11px] text-gray-600">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="border-t border-white/[0.06] bg-[#0d0d0d] px-4 py-24 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-500">No lock-in. No call-out fees.</p>
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            Need a tradie right now?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base text-gray-500">
            Post your job free in 60 seconds. Verified tradies respond fast. Secure payments — only pay when you&apos;re satisfied.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/jobs/new"
              className="group inline-flex items-center gap-2.5 rounded-2xl bg-brand-500 px-8 py-4 text-sm font-bold text-gray-900 shadow-brand transition-all hover:bg-brand-400 hover:shadow-[0_0_50px_rgba(245,158,11,0.3)]"
            >
              Post your first job — free
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/emergency"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/12 px-8 py-4 text-sm font-semibold text-white transition-all hover:border-white/20 hover:bg-white/[0.05]"
            >
              <Phone size={14} />
              Emergency dispatch
            </Link>
          </div>
          <p className="mt-6 text-xs text-gray-700">
            Join 30,000+ Australians who&apos;ve already used Fixit 24/7
          </p>
        </div>
      </section>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.08] bg-[#0a0a0a]/95 p-3 backdrop-blur-md sm:hidden">
        <Link
          href="/emergency"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-500 py-3.5 text-sm font-bold text-gray-900 transition-all active:scale-[0.98]"
        >
          <Phone size={15} />
          Emergency tradie — dispatch now
        </Link>
      </div>
    </main>
  );
}

const TRUST_ITEMS = [
  { icon: Shield, label: '4,800+ verified tradies' },
  { icon: Zap, label: 'Free to post' },
  { icon: Clock, label: 'First response ~20 min' },
  { icon: Star, label: '4.8★ average rating' },
];

const STATS = [
  { value: '4,800+', label: 'Active tradies' },
  { value: '98k+', label: 'Jobs completed' },
  { value: '~20m', label: 'Avg response time' },
];

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
  { icon: '⚡', title: 'Emergency Response', description: 'Connect with available tradies in under 20 minutes. 24/7 across all major Australian cities.' },
  { icon: '🔒', title: 'Verified & Licenced', description: 'Every tradie is background checked, licence verified, and fully insured before going live.' },
  { icon: '💳', title: 'Secure Escrow', description: 'Pay by card. Funds held in escrow until the job is done to your satisfaction. Dispute resolution included.' },
  { icon: '🤖', title: 'AI-Powered Matching', description: 'Our AI analyses your job and instantly matches the best-fit tradie for your specific problem and location.' },
];

const TRADIE_BENEFITS = [
  '$111 AUD in free job leads every month for your first 6 months',
  'AI-powered job matching — only see relevant leads',
  'Secure payments — no chasing invoices',
  'Build your verified reputation with every review',
];

const TRADIE_STATS = [
  { value: '$4.2k', label: 'Avg monthly earnings', sub: 'for top Elite tradies' },
  { value: '6mo', label: 'Free trial included', sub: 'no credit card needed' },
  { value: '4.8★', label: 'Tradie satisfaction', sub: 'based on 800+ reviews' },
  { value: '24/7', label: 'Job flow', sub: 'day, night, weekends' },
];

const TESTIMONIALS = [
  { name: 'Sarah M.', suburb: 'Bondi, NSW', text: 'Plumber arrived in 34 minutes at 11pm on a Sunday. I was panicking — Fixit sorted it in minutes. Absolute lifesaver.' },
  { name: 'James K.', suburb: 'Richmond, VIC', text: 'Electrician fixed our switchboard same day. Professional, fast and the escrow payment gave me full confidence to pay safely.' },
  { name: 'Priya R.', suburb: 'Fortitude Valley, QLD', text: 'Locked out at midnight with my kids in the car. Locksmith was there in 25 mins. I use Fixit Plus now — wouldn\'t be without it.' },
];

const PLUS_FEATURES = [
  { icon: '🏠', title: 'Home Cover', desc: 'Plumbing, electrical, locksmith' },
  { icon: '🚗', title: 'On The Road', desc: 'Car lockouts & roadside jobs' },
  { icon: '⚡', title: 'Priority Dispatch', desc: 'Avg 28 min response' },
  { icon: '💰', title: '$0 Call-out Fee', desc: 'Flat monthly, no surprises' },
];
