'use client';

import React, { useState } from 'react';
import Link from 'next/link';

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
    <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-lg">
      <h3 className="mb-6 text-xl font-bold text-gray-900">Calculate Your Earnings</h3>

      {/* Jobs per week slider */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-700">Jobs per week</label>
          <span className="text-lg font-extrabold text-brand-600">{jobsPerWeek}</span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={jobsPerWeek}
          onChange={(e) => setJobsPerWeek(Number(e.target.value))}
          className="w-full accent-brand-600"
        />
        <div className="mt-1 flex justify-between text-xs text-gray-400">
          <span>1</span>
          <span>10</span>
        </div>
      </div>

      {/* Trade selector */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-semibold text-gray-700">Your trade</label>
        <select
          value={trade}
          onChange={(e) => setTrade(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        >
          {Object.entries(TRADE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Earnings breakdown */}
      <div className="mb-4 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-gray-50 p-3">
          <p className="text-xs text-gray-500">Weekly</p>
          <p className="text-lg font-extrabold text-gray-900">${grossWeekly.toLocaleString()}</p>
        </div>
        <div className="rounded-xl bg-gray-50 p-3">
          <p className="text-xs text-gray-500">Monthly</p>
          <p className="text-lg font-extrabold text-gray-900">${Math.round(netMonthly / (1 - PLATFORM_FEE)).toLocaleString()}</p>
        </div>
        <div className="rounded-xl bg-gray-50 p-3">
          <p className="text-xs text-gray-500">Yearly</p>
          <p className="text-lg font-extrabold text-gray-900">${Math.round(netYearly / (1 - PLATFORM_FEE)).toLocaleString()}</p>
        </div>
      </div>

      <p className="mb-4 text-center text-xs text-gray-400">Fixit takes only 15% platform fee — released when job is complete</p>

      {/* Net earnings highlight */}
      <div className="mb-6 rounded-2xl bg-green-50 border border-green-200 p-5 text-center">
        <p className="text-sm font-medium text-green-700">Your NET weekly take-home</p>
        <p className="mt-1 text-4xl font-extrabold text-green-700">${Math.round(netWeekly).toLocaleString()}</p>
        <p className="mt-1 text-xs text-green-600">= ${Math.round(netMonthly).toLocaleString()}/mo · ${Math.round(netYearly).toLocaleString()}/yr</p>
      </div>

      <Link
        href={`/auth/register?role=TRADIE`}
        className="block w-full rounded-xl bg-brand-600 py-3.5 text-center text-sm font-bold text-white hover:bg-brand-700 transition-colors"
      >
        Start earning ${Math.round(netWeekly).toLocaleString()}/week — Sign Up Free
      </Link>
    </div>
  );
}

// ─── Page (also client since it embeds EarningsCalculator) ──────────────────

const STATS = [
  { value: '$2.8M', label: 'paid to tradies this month' },
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
      '5 leads per month',
      'Standard dispatch priority',
      'Basic profile listing',
      'Email support',
    ],
    cta: 'Start Free',
    href: '/auth/register?role=TRADIE&plan=FREE',
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
    href: '/auth/register?role=TRADIE&plan=PROFESSIONAL',
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
    href: '/auth/register?role=TRADIE&plan=ELITE',
  },
];

const TRUST_BADGES = [
  { icon: '🔍', label: 'Background Checked' },
  { icon: '📋', label: 'License Verified' },
  { icon: '🛡️', label: 'Insurance Confirmed' },
  { icon: '⚡', label: 'Instant Payment' },
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
    <>
      {/* 1. Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-brand-900 px-4 py-24 text-center text-white">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="relative z-10 mx-auto max-w-4xl">
          <span className="mb-4 inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            🇦🇺 Join 5,000+ Australian tradies already earning on Fixit 24/7
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Earn More. Work Less.<br />
            <span className="text-brand-300">Grow Your Trade Business.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300 sm:text-xl">
            Join 5,000+ Australian tradies earning extra income on Fixit 24/7. Get matched with quality local jobs, get paid instantly, grow your reputation.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/register?role=TRADIE"
              className="rounded-xl bg-brand-500 px-8 py-4 text-base font-bold text-white hover:bg-brand-600 transition-colors shadow-lg shadow-brand-900/30"
            >
              Start Earning Today
            </Link>
            <a
              href="#how-it-works"
              className="rounded-xl border border-white/30 px-8 py-4 text-base font-bold text-white hover:bg-white/10 transition-colors"
            >
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* 2. Stats bar */}
      <section className="bg-brand-600 py-6">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-extrabold text-white">{stat.value}</p>
                <p className="mt-0.5 text-sm text-brand-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Earnings Calculator */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="mb-3 inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
                EARNINGS CALCULATOR
              </span>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                See exactly what you could earn
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Adjust the sliders to see your estimated earnings based on real job data from tradies on our platform.
              </p>
              <ul className="mt-6 space-y-3">
                {['No lock-in contracts', 'Cancel anytime', '85% of every job goes to you', 'Direct bank deposits'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 text-xs">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <EarningsCalculator />
          </div>
        </div>
      </section>

      {/* 4. How It Works */}
      <section id="how-it-works" className="bg-white py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
              HOW IT WORKS
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">From sign-up to paid in 4 steps</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS_STEPS.map((step) => (
              <div key={step.step} className="relative rounded-2xl border border-gray-100 bg-gray-50 p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-xl font-extrabold text-white">
                  {step.step}
                </div>
                <span className="mb-2 inline-block rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600">
                  {step.time}
                </span>
                <h3 className="mb-2 text-base font-bold text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Subscription Plans */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
              PLANS & PRICING
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Choose your plan</h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-600">Start free, upgrade when you&apos;re ready. No lock-in contracts.</p>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-3xl border p-8 ${
                  plan.highlight
                    ? 'border-brand-500 bg-white shadow-2xl shadow-brand-100 ring-2 ring-brand-500'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-brand-600 px-4 py-1 text-xs font-bold text-white shadow">
                      {plan.badge}
                    </span>
                  </div>
                )}
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">{plan.name}</h3>
                <div className="mt-3 flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                  <span className="mb-1 text-gray-500">{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 text-xs">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`mt-8 block w-full rounded-xl py-3 text-center text-sm font-bold transition-colors ${
                    plan.highlight
                      ? 'bg-brand-600 text-white hover:bg-brand-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Trust badges */}
      <section className="bg-white border-y border-gray-100 py-10 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {TRUST_BADGES.map((badge) => (
              <div key={badge.label} className="flex flex-col items-center gap-2 text-center">
                <span className="text-3xl">{badge.icon}</span>
                <p className="text-sm font-semibold text-gray-700">{badge.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Testimonials */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
              TESTIMONIALS
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900">What tradies are saying</h2>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-2xl bg-white border border-gray-100 p-7 shadow-sm">
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-gray-700">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-5">
                  <p className="text-sm font-bold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.trade}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="bg-white py-20 px-4">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
              FAQ
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900">Common questions</h2>
          </div>
          <div className="space-y-6">
            {FAQS.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
                <h3 className="mb-2 text-base font-bold text-gray-900">{faq.q}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Bottom CTA */}
      <section className="bg-gradient-to-br from-brand-600 to-brand-800 py-20 px-4 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-extrabold sm:text-4xl">Ready to grow your trade business?</h2>
          <p className="mx-auto mt-4 max-w-lg text-brand-100">
            Join 5,000+ Australian tradies already earning on Fixit 24/7. Free to start, no credit card required.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/register?role=TRADIE"
              className="rounded-xl bg-white px-8 py-4 text-base font-bold text-brand-700 hover:bg-brand-50 transition-colors shadow-lg"
            >
              Join Free Today
            </Link>
            <Link
              href="/how-it-works"
              className="rounded-xl border border-white/30 px-8 py-4 text-base font-bold text-white hover:bg-white/10 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
