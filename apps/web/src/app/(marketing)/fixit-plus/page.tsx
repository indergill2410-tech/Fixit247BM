import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, Shield, Star, Zap, Phone } from 'lucide-react';
import { FaqAccordion } from '@/components/shared/faq-accordion';

export const metadata: Metadata = {
  title: 'Fixit Plus — Homeowner Peace of Mind | Fixit 24/7',
  description: 'One flat monthly fee. Unlimited emergency call-outs. Priority dispatch 24/7. Cover for plumbing, electrical, locksmith, HVAC, and more — at home and on the road.',
};

const PLUS_TESTIMONIALS = [
  {
    text: "Locked out at midnight with my baby in the car. One call and a locksmith was there in 22 minutes. Fixit Plus paid for itself that night.",
    name: 'Priya R.',
    suburb: 'Fortitude Valley, QLD',
    plan: 'Plus Total',
  },
  {
    text: "Burst pipe on Christmas Eve. I thought I'd be dealing with damage for weeks. They sent a plumber within the hour and covered the whole job. Unreal.",
    name: 'James K.',
    suburb: 'Richmond, VIC',
    plan: 'Plus Home',
  },
  {
    text: "AC died in a 40-degree heatwave. Priority dispatch had a tech at my door in 45 minutes. Worth every cent of the $49 a month.",
    name: 'Sarah M.',
    suburb: 'Bondi, NSW',
    plan: 'Plus Total',
  },
];

const PLUS_FAQS = [
  {
    q: 'What is and isn\'t covered?',
    a: 'Fixit Plus covers emergency plumbing, electrical, locksmith, HVAC (Total plan), roofing emergencies (Total plan), and car lockouts (Total plan). It does not cover cosmetic repairs, pre-existing damage, routine maintenance, or structural issues outside normal wear. A full exclusions list is provided at signup.',
  },
  {
    q: 'Is there a limit per call-out?',
    a: 'Yes — Home plan covers up to $500 per incident, Total plan up to $1,500. Costs above these limits are quoted separately by the tradie before work begins.',
  },
  {
    q: 'How do I cancel?',
    a: 'Cancel any time from your account dashboard in under 60 seconds. No phone call required, no fees. Your coverage continues until the end of your current billing period.',
  },
  {
    q: 'Can I use it for rental properties?',
    a: 'Yes. Fixit Plus can be linked to a residential address you own or manage. Landlords and property managers use it for emergency call-outs on managed properties.',
  },
  {
    q: 'What happens during the 14-day free trial?',
    a: 'You get full access to all plan features from day one. No credit card is charged until after the trial ends. You can cancel before then with no obligation.',
  },
];

const PLANS = [
  {
    name: 'Fixit Plus Home',
    price: 29,
    period: 'month',
    highlight: false,
    icon: '🏠',
    tagline: 'Everything covered at home',
    features: [
      'Unlimited call-outs — no per-job fees',
      'Priority dispatch (avg 28 min response)',
      '24/7 emergency access',
      'Plumbing, electrical & locksmith covered',
      'Up to $500 per incident',
      'Annual safety inspection included',
    ],
    cta: 'Start Home Cover',
    href: '/register?plan=fixit-plus-home',
  },
  {
    name: 'Fixit Plus Total',
    price: 49,
    period: 'month',
    highlight: true,
    icon: '🛡️',
    tagline: 'Home + on the road',
    features: [
      'Everything in Home, plus:',
      'Roadside emergency dispatch',
      'Locksmith if locked out of your car',
      'Storm & flood damage response',
      'Up to $1,500 per incident',
      'HVAC & roofing emergencies included',
      'Dedicated support concierge',
    ],
    cta: 'Start Total Cover',
    href: '/register?plan=fixit-plus-total',
  },
];

const COVER_SCENARIOS = [
  {
    icon: '🚰',
    title: 'Burst Pipe at 2am',
    scenario: 'Water flooding your kitchen. We dispatch a licensed plumber to your door — no call-out fee, no wait.',
    cover: 'Home + Total',
  },
  {
    icon: '🔑',
    title: 'Locked Out of Home',
    scenario: 'Forgot your keys on a Sunday night. Our locksmith is there in under 30 minutes.',
    cover: 'Home + Total',
  },
  {
    icon: '⚡',
    title: 'Power Goes Out',
    scenario: 'RCD tripping and you don\'t know why. A licensed electrician diagnoses and fixes it — covered.',
    cover: 'Home + Total',
  },
  {
    icon: '🚗',
    title: 'Locked Out of Your Car',
    scenario: 'Keys inside the car at the shops. Fixit Plus Total dispatches a locksmith wherever you are.',
    cover: 'Total only',
    totalOnly: true,
  },
  {
    icon: '🌩️',
    title: 'Storm Damage',
    scenario: 'Roof damaged in a storm. Emergency tarping and repair team dispatched same day.',
    cover: 'Total only',
    totalOnly: true,
  },
  {
    icon: '❄️',
    title: 'AC Fails in a Heatwave',
    scenario: '42°C outside, AC dead. Priority HVAC dispatch gets you cooling within the hour.',
    cover: 'Home + Total',
  },
];

const TRUST_STATS = [
  { value: '50,000+', label: 'Fixit Plus members' },
  { value: '28 min', label: 'Average response time' },
  { value: '4.9★', label: 'Member satisfaction' },
  { value: '$0', label: 'Per call-out fee' },
];

export default function FixitPlusPage() {
  return (
    <div className="bg-background text-foreground transition-colors duration-300">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-24 text-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-brand-500/8 blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/25 bg-brand-500/10 px-4 py-1.5 text-sm font-medium text-brand-500">
            <Shield size={14} />
            Fixit Plus — Peace of Mind, All Year
          </span>
          <h1 className="mt-5 text-5xl font-extrabold tracking-tight sm:text-6xl">
            Your home covered,<br />
            <span className="text-brand-500">wherever you are.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground-muted">
            One flat monthly fee. Unlimited call-outs. Priority dispatch. Whether something breaks at home
            at midnight or you&apos;re stranded on the road — we&apos;ve got you.
          </p>
          {/* Price anchoring */}
          <p className="mx-auto mt-3 max-w-sm text-sm text-foreground-subtle">
            A single emergency call-out averages <span className="font-semibold text-foreground-muted">$180–$300</span>.
            {' '}Fixit Plus is <span className="font-semibold text-brand-600 dark:text-brand-400">$29–$49/month</span> for unlimited coverage.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/register?plan=fixit-plus-total"
              className="rounded-xl bg-brand-500 px-8 py-4 text-base font-bold text-gray-900 hover:bg-brand-400 transition-colors shadow-lg shadow-brand-500/20"
            >
              Start free 14-day trial →
            </Link>
            <Link
              href="#plans"
              className="rounded-xl border border-border px-8 py-4 text-base font-bold text-foreground hover:bg-background-elevated transition-colors"
            >
              Compare plans
            </Link>
          </div>
          <p className="mt-4 text-sm text-foreground-subtle">No lock-in. No credit card for trial. Cancel in 60 seconds.</p>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="border-y border-border bg-background-alt py-8">
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {TRUST_STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-extrabold text-brand-500">{s.value}</p>
                <p className="mt-1 text-xs text-foreground-subtle">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's covered */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Real scenarios. Real coverage.</h2>
            <p className="mt-3 text-foreground-muted">When life doesn&apos;t go to plan, Fixit Plus is ready.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COVER_SCENARIOS.map((s) => (
              <div
                key={s.title}
                className={`rounded-2xl border p-5 ${s.totalOnly ? 'border-brand-500/30 bg-brand-500/5' : 'border-border bg-background-elevated'}`}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <span className="text-3xl">{s.icon}</span>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${s.totalOnly ? 'bg-brand-500/20 text-brand-500' : 'bg-background-alt text-foreground-muted'}`}>
                    {s.cover}
                  </span>
                </div>
                <h3 className="mb-1.5 font-semibold text-foreground">{s.title}</h3>
                <p className="text-sm text-foreground-subtle">{s.scenario}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="bg-background-alt px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Choose your cover</h2>
            <p className="mt-3 text-foreground-muted">Flat monthly fee. No surprise bills. No per-call charges.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-3xl border p-8 ${
                  plan.highlight
                    ? 'border-brand-500/50 bg-brand-500/8 shadow-lg shadow-brand-500/10'
                    : 'border-border bg-background-elevated'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-4 py-1 text-xs font-bold text-gray-900">
                    Most popular
                  </div>
                )}
                <div className="mb-2 text-3xl">{plan.icon}</div>
                <p className="text-xs font-semibold uppercase tracking-widest text-foreground-subtle">{plan.tagline}</p>
                <h3 className="mt-1 text-xl font-bold text-foreground">{plan.name}</h3>
                <div className="my-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-foreground">${plan.price}</span>
                  <span className="text-foreground-subtle">/{plan.period}</span>
                </div>
                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-foreground-secondary">
                      <CheckCircle size={16} className="mt-0.5 shrink-0 text-brand-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block rounded-xl px-6 py-3.5 text-center text-sm font-bold transition-colors ${
                    plan.highlight
                      ? 'bg-brand-500 text-gray-900 hover:bg-brand-400'
                      : 'border border-border text-foreground hover:bg-background-alt'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-foreground-subtle">
            All plans include a 14-day free trial. No credit card required to start.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">How Fixit Plus works</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { step: '1', icon: <Shield size={24} />, title: 'Subscribe once', desc: 'Pick Home or Total cover. Set and forget — we handle everything else.' },
              { step: '2', icon: <Phone size={24} />, title: 'Call us anytime', desc: 'Emergency? Call or tap the app. We dispatch a verified tradie to your location immediately.' },
              { step: '3', icon: <Star size={24} />, title: 'Zero bill surprise', desc: 'Your monthly plan covers it. No call-out fees, no hidden charges. Just peace of mind.' },
            ].map((s) => (
              <div key={s.step} className="rounded-2xl border border-border bg-background-elevated p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/15 text-brand-500">
                  {s.icon}
                </div>
                <div className="mb-1 text-xs font-bold uppercase tracking-widest text-brand-500">Step {s.step}</div>
                <h3 className="mb-2 font-semibold text-foreground">{s.title}</h3>
                <p className="text-sm text-foreground-subtle">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Member Testimonials */}
      <section className="border-t border-border px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="section-label mb-3">Member stories</p>
            <h2 className="text-3xl font-bold">Real emergencies. Real coverage.</h2>
            <div className="mt-4 flex items-center justify-center gap-1.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={14} className="fill-brand-500 text-brand-500" />
              ))}
              <span className="ml-2 text-sm font-semibold text-foreground">4.9</span>
              <span className="text-sm text-foreground-muted">member satisfaction</span>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {PLUS_TESTIMONIALS.map((t) => (
              <div key={t.name} className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-card-warm transition-all hover:shadow-card-warm-hover dark:border-white/[0.07] dark:bg-white/[0.03] dark:shadow-none">
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={11} className="fill-brand-500 text-brand-500" />
                  ))}
                </div>
                <p className="flex-1 text-sm leading-relaxed text-foreground-secondary">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/15 text-xs font-bold text-brand-700 dark:text-brand-400">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{t.name}</p>
                      <p className="text-[11px] text-foreground-subtle">{t.suburb}</p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-brand-500/15 px-2 py-0.5 text-[10px] font-bold text-brand-700 dark:text-brand-400">
                    {t.plan}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-background-alt px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <p className="section-label mb-3">Common questions</p>
            <h2 className="text-3xl font-bold">Everything you need to know</h2>
          </div>
          <FaqAccordion faqs={PLUS_FAQS} namespace="fixit-plus" />
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border px-4 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="mb-3 flex items-center justify-center gap-2 text-brand-500">
            <Zap size={18} />
            <span className="text-sm font-bold uppercase tracking-widest">Start today</span>
          </div>
          <h2 className="text-3xl font-extrabold">
            Stop worrying.<br />Start your free trial.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-foreground-muted">
            Join 50,000+ Australian homeowners who sleep easy knowing Fixit Plus has them covered — at home and on the road.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/register?plan=fixit-plus-total"
              className="rounded-xl bg-brand-500 px-8 py-4 text-base font-bold text-gray-900 hover:bg-brand-400 transition-colors shadow-lg shadow-brand-500/20"
            >
              Try free for 14 days →
            </Link>
            <Link
              href="/emergency"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground-muted hover:text-foreground transition-colors"
            >
              <Phone size={13} />
              Need help right now? Emergency dispatch
            </Link>
          </div>
          <p className="mt-4 text-xs text-foreground-subtle">No credit card required. Cancel anytime in under 60 seconds.</p>
        </div>
      </section>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 p-3 backdrop-blur-md sm:hidden">
        <Link
          href="/register?plan=fixit-plus-total"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-500 py-3.5 text-sm font-bold text-gray-900 shadow-brand-md transition-all active:scale-[0.98]"
        >
          <Shield size={15} />
          Start 14-day free trial
        </Link>
      </div>
    </div>
  );
}
