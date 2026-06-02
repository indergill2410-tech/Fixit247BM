'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaqAccordion } from '@/components/shared/faq-accordion';
import { FxIcon } from '@/components/ui/fx-icon';
import { RevealSection } from '@/components/shared/reveal-section';

// ─── Earnings Calculator (client component) ─────────────────────────────────

const AVG_JOB_VALUE: Record<string, number> = {
  PLUMBING: 280,
  ELECTRICAL: 320,
  HVAC: 350,
  LOCKSMITH: 180,
  ROOFING: 450,
  CARPENTRY: 280,
  PAINTING: 220,
  TILING: 260,
  GLAZING: 300,
  PEST_CONTROL: 180,
  PLASTERING: 240,
  LANDSCAPING: 200,
  CLEANING: 160,
  APPLIANCE_REPAIR: 200,
  GENERAL_MAINTENANCE: 180,
};

const TRADE_LABELS: Record<string, string> = {
  PLUMBING: 'Plumber',
  ELECTRICAL: 'Electrician',
  HVAC: 'HVAC / Air Con',
  LOCKSMITH: 'Locksmith',
  ROOFING: 'Roofer',
  CARPENTRY: 'Carpenter',
  PAINTING: 'Painter',
  TILING: 'Tiler',
  GLAZING: 'Glazier',
  PEST_CONTROL: 'Pest Control',
  PLASTERING: 'Plasterer',
  LANDSCAPING: 'Landscaper',
  CLEANING: 'Cleaner',
  APPLIANCE_REPAIR: 'Appliance Repair',
  GENERAL_MAINTENANCE: 'General Maintenance',
};

const PLATFORM_FEE = 0.15;

function EarningsCalculator() {
  const [jobsPerWeek, setJobsPerWeek] = useState(3);
  const [trade, setTrade] = useState('PLUMBING');

  const avgValue = AVG_JOB_VALUE[trade] ?? 280;
  const grossWeekly = jobsPerWeek * avgValue;
  const fee = grossWeekly * PLATFORM_FEE;
  const netWeekly = grossWeekly - fee;
  const netMonthly = netWeekly * 4.33;
  const netYearly = netWeekly * 52;

  return (
    <div className="rounded-3xl border border-border bg-background-elevated p-8 shadow-lg">
      <h3 className="mb-6 text-xl font-bold text-foreground">Calculate Your Earnings</h3>

      {/* Jobs per week slider */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-semibold text-foreground-muted">Jobs per week</label>
          <span className="text-lg font-extrabold text-brand-500">{jobsPerWeek}</span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={jobsPerWeek}
          onChange={(e) => { setJobsPerWeek(Number(e.target.value)); }}
          className="w-full accent-brand-500"
        />
        <div className="mt-1 flex justify-between text-xs text-foreground-subtle">
          <span>1</span>
          <span>10</span>
        </div>
      </div>

      {/* Trade selector */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-semibold text-foreground-muted">Your trade</label>
        <select
          value={trade}
          onChange={(e) => { setTrade(e.target.value); }}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground placeholder:text-foreground-subtle focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        >
          {Object.entries(TRADE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Earnings breakdown */}
      <div className="mb-4 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-background-alt border border-border p-3">
          <p className="text-xs text-foreground-subtle">Weekly</p>
          <p className="text-lg font-extrabold text-foreground">${grossWeekly.toLocaleString()}</p>
        </div>
        <div className="rounded-xl bg-background-alt border border-border p-3">
          <p className="text-xs text-foreground-subtle">Monthly</p>
          <p className="text-lg font-extrabold text-foreground">${Math.round(netMonthly / (1 - PLATFORM_FEE)).toLocaleString()}</p>
        </div>
        <div className="rounded-xl bg-background-alt border border-border p-3">
          <p className="text-xs text-foreground-subtle">Yearly</p>
          <p className="text-lg font-extrabold text-foreground">${Math.round(netYearly / (1 - PLATFORM_FEE)).toLocaleString()}</p>
        </div>
      </div>

      <p className="mb-4 text-center text-xs text-foreground-subtle">Fixit takes only 15% platform fee — released when job is complete</p>

      {/* Net earnings highlight */}
      <div className="mb-6 rounded-2xl bg-green-500/10 border border-green-500/30 p-5 text-center">
        <p className="text-sm font-medium text-green-600 dark:text-green-400">Your NET weekly take-home</p>
        <p className="mt-1 text-4xl font-extrabold text-green-600 dark:text-green-400">${Math.round(netWeekly).toLocaleString()}</p>
        <p className="mt-1 text-xs text-green-600/70 dark:text-green-500">= ${Math.round(netMonthly).toLocaleString()}/mo · ${Math.round(netYearly).toLocaleString()}/yr</p>
      </div>

      <Link
        href={`/register?role=TRADIE`}
        className="block w-full rounded-xl bg-brand-500 py-3.5 text-center text-sm font-bold text-gray-900 hover:bg-brand-400 transition-colors"
      >
        Start earning ${Math.round(netWeekly).toLocaleString()}/week — Sign Up Free
      </Link>
    </div>
  );
}

// ─── Page (also client since it embeds EarningsCalculator) ──────────────────

const STATS = [
  { value: '$111/mo', label: 'free credits for your first 6 months' },
  { value: '4.9★', label: 'average tradie rating' },
  { value: '< 60s', label: 'to receive a lead' },
  { value: '5,000+', label: 'active tradies' },
];

const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Create your profile',
    desc: 'Set up your trade profile in under 5 minutes. Add your trade type, service area, and availability.',
    time: '5 min',
  },
  {
    step: '02',
    title: 'Get verified',
    desc: 'We run a background check and verify your licence and insurance. Most tradies are approved within 24 hours.',
    time: '24 hrs',
  },
  {
    step: '03',
    title: 'Receive instant job alerts',
    desc: 'Get SMS and push notifications the moment a matching job is posted in your area. First to claim, first to win.',
    time: 'Instant',
  },
  {
    step: '04',
    title: 'Get paid directly',
    desc: 'Payments are released to your account as soon as the customer marks the job complete. No chasing invoices.',
    time: 'Same day',
  },
];

const PLANS = [
  {
    name: 'FREE',
    price: '$0',
    period: '/mo',
    highlight: false,
    features: [
      '$111/month free credits for 6 months',
      '5 leads per month after bonus period',
      'Standard dispatch priority',
      'Basic profile listing',
    ],
    cta: 'Start Free',
    href: '/register?role=TRADIE&plan=FREE',
  },
  {
    name: 'PROFESSIONAL',
    price: '$99',
    period: '/mo',
    highlight: true,
    badge: 'Most Popular',
    features: [
      'Unlimited leads',
      'Priority dispatch',
      'Analytics dashboard',
      '20% discount on lead credits',
      'Priority support',
    ],
    cta: 'Start 14-day Trial',
    href: '/register?role=TRADIE&plan=PROFESSIONAL',
  },
  {
    name: 'ELITE',
    price: '$199',
    period: '/mo',
    highlight: false,
    features: [
      'Everything in Professional',
      'First pick on emergency jobs',
      'Advanced analytics',
      '35% discount on lead credits',
      'Dedicated account manager',
      'Featured profile badge',
      'Emergency boost alerts',
    ],
    cta: 'Go Elite',
    href: '/register?role=TRADIE&plan=ELITE',
  },
];

const TRUST_BADGES = [
  { icon: 'search' as const, label: 'Background Checked' },
  { icon: 'clipboard' as const, label: 'License Verified' },
  { icon: 'shield' as const, label: 'Insurance Confirmed' },
  { icon: 'zap' as const, label: 'Instant Payment' },
];

const TESTIMONIALS = [
  {
    quote: "I was sceptical at first, but Fixit 24/7 now accounts for 40% of my monthly revenue. The leads are quality and the platform handles all the admin.",
    name: 'Marcus T.',
    trade: 'Plumber · Sydney',
    rating: 5,
  },
  {
    quote: "Switched from another platform six months ago. Better leads, faster payment, and the priority dispatch on the Pro plan means I'm always busy.",
    name: 'Sarah K.',
    trade: 'Electrician · Melbourne',
    rating: 5,
  },
  {
    quote: "As a locksmith, emergencies are my bread and butter. The 60-second alert system is a game-changer — I've never missed a local job.",
    name: 'Dave R.',
    trade: 'Locksmith · Brisbane',
    rating: 5,
  },
];

const FAQS = [
  {
    q: 'Is there a cost to sign up?',
    a: 'No. Registration is completely free. You only start paying when you upgrade to a Professional or Elite plan, or purchase additional lead credits.',
  },
  {
    q: 'How does the 15% platform fee work?',
    a: 'When a customer pays for a completed job, Fixit takes 15% and releases the remaining 85% directly to your nominated bank account. There are no hidden fees.',
  },
  {
    q: 'How quickly will I receive leads?',
    a: 'Leads are dispatched within seconds of a customer posting. You\'ll receive an SMS and push notification instantly. On the Professional plan, you get priority dispatch before free members.',
  },
  {
    q: 'What documents do I need to get verified?',
    a: 'We require a valid trade licence, proof of insurance (public liability minimum $5M), and photo ID. The verification process typically takes 24–48 hours.',
  },
  {
    q: 'Can I set my service area and availability?',
    a: 'Yes. You control exactly which suburbs you service and your available hours. You can update this anytime from your tradie dashboard.',
  },
];

export default function JoinAsTradiePageWrapper() {
  return <JoinAsTradiePageInner />;
}

function JoinAsTradiePageInner() {
  return (
    <div className="bg-background text-foreground transition-colors duration-300">
      {/* 1. Hero */}
      <section className="relative overflow-hidden px-4 py-24 text-center">
        <div className="pointer-events-none absolute inset-0 grid-pattern" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-brand-500/8 blur-[100px]" />
        <div className="relative z-10 mx-auto max-w-4xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/[0.08] px-4 py-2 text-sm font-bold text-emerald-600 dark:text-emerald-400">
            🎁 Sign up bonus: $111/month in free credits for your first 6 months
          </div>
          <h1 className="text-[2.75rem] font-black leading-[1.06] tracking-tighter sm:text-5xl lg:text-[4rem]">
            Earn more.<br />
            <span className="text-gradient-brand">Grow your trade business.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-foreground-muted sm:text-lg">
            Join 5,000+ Australian tradies earning consistent income on Fixit 24/7. Quality leads, secure payments, zero invoice chasing.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/register?role=TRADIE"
              className="inline-flex items-center gap-2 rounded-2xl bg-brand-500 px-8 py-4 text-base font-bold text-gray-900 shadow-brand transition-all hover:bg-brand-400 hover:shadow-[0_0_50px_rgba(245,158,11,0.3)]"
            >
              Claim $111/mo bonus — sign up free
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-2xl border border-border px-8 py-4 text-base font-semibold text-foreground transition-all hover:bg-background-elevated"
            >
              See how it works
            </a>
          </div>
          <p className="mt-4 text-sm text-foreground-subtle">No credit card. No lock-in. Cancel anytime.</p>
        </div>
      </section>

      {/* 2. Stats bar */}
      <section className="border-y border-border bg-background-alt py-8">
        <RevealSection>
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-extrabold text-brand-600 dark:text-brand-400">{stat.value}</p>
                  <p className="mt-0.5 text-sm text-foreground-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>
      </section>

      {/* 3. Earnings Calculator */}
      <section className="bg-background-alt py-20 px-4">
        <RevealSection>
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="mb-3 inline-block rounded-full bg-brand-500/20 px-3 py-1 text-xs font-semibold text-brand-500">
                EARNINGS CALCULATOR
              </span>
              <h2 className="text-3xl font-extrabold sm:text-4xl">
                See exactly what you could earn
              </h2>
              <p className="mt-4 text-lg text-foreground-muted">
                Adjust the sliders to see your estimated earnings based on real job data from tradies on our platform.
              </p>
              <ul className="mt-6 space-y-3">
                {['No lock-in contracts', 'Cancel anytime', '85% of every job goes to you', 'Direct bank deposits'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm font-medium text-foreground-muted">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20 text-green-600 dark:text-green-400 text-xs">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <EarningsCalculator />
          </div>
        </div>
        </RevealSection>
      </section>

      {/* 4. How It Works */}
      <section id="how-it-works" className="border-t border-border bg-background py-20 px-4">
        <RevealSection>
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-500/20 px-3 py-1 text-xs font-semibold text-brand-500">
              HOW IT WORKS
            </span>
            <h2 className="text-3xl font-extrabold sm:text-4xl">From sign-up to paid in 4 steps</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS_STEPS.map((step) => (
              <div key={step.step} className="relative rounded-2xl border border-border bg-background-elevated p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-xl font-extrabold text-gray-900">
                  {step.step}
                </div>
                <span className="mb-2 inline-block rounded-full bg-brand-500/20 px-2 py-0.5 text-xs font-medium text-brand-500">
                  {step.time}
                </span>
                <h3 className="mb-2 text-base font-bold text-foreground">{step.title}</h3>
                <p className="text-sm text-foreground-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
        </RevealSection>
      </section>

      {/* 5. Testimonials — proof before pricing */}
      <section className="border-t border-border bg-background-alt py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-500/20 px-3 py-1 text-xs font-semibold text-brand-500">
              TESTIMONIALS
            </span>
            <h2 className="text-3xl font-extrabold">What tradies are saying</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="flex flex-col rounded-2xl border border-border bg-background-elevated p-7">
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: t.rating }, (_, i) => (
                    <span key={i} className="text-brand-500">★</span>
                  ))}
                </div>
                <p className="flex-1 text-sm leading-relaxed text-foreground-muted">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-5 border-t border-border pt-4">
                  <p className="text-sm font-bold text-foreground">{t.name}</p>
                  <p className="text-xs text-foreground-subtle">{t.trade}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Trust badges */}
      <section className="border-t border-border bg-background py-10 px-4">
        <RevealSection>
          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {TRUST_BADGES.map((badge) => (
                <div key={badge.label} className="flex flex-col items-center gap-2 text-center">
                  <div className="text-brand-500">
                    <FxIcon name={badge.icon} size={32} />
                  </div>
                  <p className="text-sm font-semibold text-foreground-muted">{badge.label}</p>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>
      </section>

      {/* 7. Subscription Plans — after proof */}
      <section className="border-t border-border bg-background-alt py-20 px-4">
        <RevealSection>
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-500/20 px-3 py-1 text-xs font-semibold text-brand-500">
              PLANS & PRICING
            </span>
            <h2 className="text-3xl font-extrabold sm:text-4xl">Choose your plan</h2>
            <p className="mx-auto mt-4 max-w-xl text-foreground-muted">Start free, upgrade when you&apos;re ready. No lock-in contracts.</p>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-3xl border p-8 ${
                  plan.highlight
                    ? 'border-brand-500/50 bg-brand-500/10 ring-1 ring-brand-500/30'
                    : 'border-border bg-background-elevated'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-brand-500 px-4 py-1 text-xs font-bold text-gray-900 shadow">
                      {plan.badge}
                    </span>
                  </div>
                )}
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground-subtle">{plan.name}</h3>
                <div className="mt-3 flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                  <span className="mb-1 text-foreground-subtle">{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground-muted">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-500/20 text-green-600 dark:text-green-400 text-xs">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`mt-8 block w-full rounded-xl py-3 text-center text-sm font-bold transition-colors ${
                    plan.highlight
                      ? 'bg-brand-500 text-gray-900 hover:bg-brand-400'
                      : 'bg-background-alt text-foreground border border-border hover:bg-background-elevated'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
        </RevealSection>
      </section>

      {/* 8. FAQ — accordion */}
      <section className="border-t border-border bg-background py-20 px-4">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-500/20 px-3 py-1 text-xs font-semibold text-brand-500">
              FAQ
            </span>
            <h2 className="text-3xl font-extrabold">Common questions</h2>
          </div>
          <FaqAccordion faqs={FAQS} namespace="join-tradie" />
        </div>
      </section>

      {/* 9. Bottom CTA */}
      <section className="border-t border-brand-500/20 bg-background-alt py-20 px-4 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Ready to start earning?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-foreground-muted">
            Join 5,000+ Australian tradies already earning on Fixit 24/7. Your first 6 months include $111/month in free job credits — no credit card required.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/register?role=TRADIE"
              className="rounded-xl bg-brand-500 px-8 py-4 text-base font-bold text-gray-900 hover:bg-brand-400 transition-colors shadow-lg shadow-brand-500/20"
            >
              Claim your $111/mo bonus — free
            </Link>
            <Link
              href="/pricing"
              className="rounded-xl border border-border px-8 py-4 text-base font-bold text-foreground hover:bg-background-elevated transition-colors"
            >
              See full pricing
            </Link>
          </div>
          <p className="mt-4 text-xs text-foreground-subtle">No credit card. No lock-in. Cancel anytime.</p>
        </div>
      </section>
    </div>
  );
}
