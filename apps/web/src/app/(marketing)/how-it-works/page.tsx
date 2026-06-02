import type { Metadata } from 'next';
import Link from 'next/link';
import { FxIcon } from '@/components/ui/fx-icon';
import { RevealSection } from '@/components/shared/reveal-section';

export const metadata: Metadata = {
  title: 'How It Works | Fixit247 — Emergency Trades Australia',
  description: 'Post a job, get matched with a verified local tradie, and have your problem fixed in 60 minutes or less. See how Fixit247 works for customers.',
};

const STEPS = [
  {
    number: '1',
    title: 'Post Your Job',
    description: 'Describe the issue in your own words — our AI analyses severity, categorises the trade required, and sets the right priority level automatically.',
    detail: 'Takes less than 2 minutes. No technical knowledge needed.',
    icon: 'clipboard' as const,
  },
  {
    number: '2',
    title: 'Get Matched',
    description: 'A verified, locally available tradie is dispatched instantly. For emergencies we alert the 3 closest available tradies simultaneously — whoever accepts first, gets the job.',
    detail: 'Avg. match time: under 60 seconds for emergencies.',
    icon: 'zap' as const,
  },
  {
    number: '3',
    title: 'Job Done',
    description: 'Your tradie arrives, completes the work, and you confirm completion in-app. Payment is released from escrow only after you\'re satisfied.',
    detail: 'Rate your tradie, leave a review, done.',
    icon: 'checkCircle' as const,
  },
];

const EMERGENCY_FEATURES = [
  'Tradies alerted within 5 seconds of posting',
  'Live GPS tracking once tradie is dispatched',
  'In-app chat with your tradie',
  'Estimated arrival time shown in real time',
  'Priority queue — jumps above standard jobs',
];

const STANDARD_FEATURES = [
  'Schedule for a specific date and time',
  'Compare multiple quotes from tradies',
  'Choose your preferred tradie',
  'Flexible rescheduling with no penalty',
  'Reminders 24 hrs and 1 hr before job',
];

const SAFETY_ITEMS = [
  { icon: 'search' as const, title: 'Background Checked', desc: 'Every tradie undergoes a national police check before they can work on our platform.' },
  { icon: 'clipboard' as const, title: 'Licence Verified', desc: "We verify each tradie's trade licence with the relevant state authority." },
  { icon: 'shield' as const, title: 'Insured', desc: 'All tradies carry a minimum $5M public liability policy — you\'re protected.' },
  { icon: 'creditCard' as const, title: 'Payment Protection', desc: 'Funds are held in secure escrow and only released when you confirm the job is complete.' },
];

const APP_FEATURES = [
  { icon: 'mapPin' as const, title: 'Live Tracking', desc: 'Watch your tradie travel to your location on a live map.' },
  { icon: 'message' as const, title: 'In-App Chat', desc: 'Message your tradie directly — no sharing your number.' },
  { icon: 'lock' as const, title: 'Payment Protection', desc: 'Pay by card in-app. Funds held safely until job is done.' },
  { icon: 'star' as const, title: 'Reviews & Ratings', desc: 'See verified reviews from real customers before choosing.' },
  { icon: 'settings' as const, title: 'AI Job Analysis', desc: 'AI assesses urgency and surfaces relevant job history.' },
  { icon: 'bell' as const, title: 'Status Notifications', desc: 'Push alerts at every stage — dispatched, en route, arrived.' },
];

export default function HowItWorksPage() {
  return (
    <div className="bg-background text-foreground transition-colors duration-300">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-24 text-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-background-elevated px-4 py-1.5 text-sm font-medium text-foreground">
            <FxIcon name="zap" size={14} className="text-brand-500" /> From Problem to Fixed in 60 Minutes
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            From Problem to Fixed<br />
            <span className="text-brand-500">in 60 Minutes</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground-muted sm:text-xl">
            Fixit247 connects you with verified, licensed local tradies instantly — any time of day or night. Emergency or scheduled, we&apos;ve got you covered.
          </p>
          <div className="mt-10">
            <Link
              href="/emergency"
              className="rounded-xl bg-brand-500 px-8 py-4 text-base font-bold text-gray-900 hover:bg-brand-400 transition-colors shadow-lg shadow-brand-500/20"
            >
              Post a Job Now →
            </Link>
          </div>
        </div>
      </section>

      {/* 3-Step Process */}
      <section className="border-t border-border bg-background-alt py-20 px-4">
        <RevealSection>
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <span className="mb-3 inline-block rounded-full bg-brand-500/15 px-3 py-1 text-xs font-semibold text-brand-500">
                THE PROCESS
              </span>
              <h2 className="text-3xl font-extrabold sm:text-4xl">Three simple steps</h2>
            </div>
            <div className="grid gap-8 lg:grid-cols-3">
              {STEPS.map((step, idx) => (
                <div key={step.number} className="relative">
                  {idx < STEPS.length - 1 && (
                    <div className="absolute right-0 top-10 hidden h-0.5 w-8 bg-brand-500/30 lg:block translate-x-full" />
                  )}
                  <div className="rounded-3xl border border-border bg-background-elevated p-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-500">
                      <FxIcon name={step.icon} size={28} />
                    </div>
                    <div className="mb-2 text-5xl font-extrabold text-brand-500/30">{step.number}</div>
                    <h3 className="mb-3 text-xl font-bold text-foreground">{step.title}</h3>
                    <p className="mb-4 text-sm leading-relaxed text-foreground-muted">{step.description}</p>
                    <p className="rounded-xl bg-brand-500/10 px-3 py-2 text-xs font-medium text-brand-500">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>
      </section>

      {/* For Emergencies */}
      <section className="border-t border-border py-20 px-4">
        <RevealSection>
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-500/15 px-3 py-1 text-xs font-semibold text-brand-500">
                  <FxIcon name="siren" size={12} /> EMERGENCY DISPATCH
                </span>
                <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                  For emergencies,<br />
                  <span className="text-brand-500">speed is everything</span>
                </h2>
                <p className="mt-4 text-lg text-foreground-muted">
                  Burst pipe at 2am? Power out? Locked out of your home? We dispatch the nearest available tradie in under 60 seconds — any time, any day.
                </p>
                <ul className="mt-6 space-y-3">
                  {EMERGENCY_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground-secondary">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-brand-500 text-xs font-bold">!</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link
                    href="/emergency"
                    className="inline-block rounded-xl bg-brand-500 px-6 py-3 text-sm font-bold text-gray-900 hover:bg-brand-400 transition-colors"
                  >
                    Get Emergency Help Now
                  </Link>
                </div>
              </div>
              <div className="rounded-3xl border border-brand-500/30 bg-brand-500/10 p-8">
                <p className="mb-2 text-sm font-medium text-brand-500">Average response time</p>
                <p className="text-7xl font-extrabold text-brand-500">58s</p>
                <p className="mt-2 text-foreground-subtle">from post to tradie accepted</p>
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-background-elevated p-3">
                    <FxIcon name="mapPin" size={24} className="text-brand-500 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Live GPS tracking</p>
                      <p className="text-xs text-foreground-subtle">Watch your tradie travel to you</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-background-elevated p-3">
                    <FxIcon name="clock" size={24} className="text-brand-500 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">ETA updates in real time</p>
                      <p className="text-xs text-foreground-subtle">Know exactly when help arrives</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealSection>
      </section>

      {/* For Standard Jobs */}
      <section className="border-t border-border bg-background-alt py-20 px-4">
        <RevealSection>
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="rounded-3xl border border-brand-500/30 bg-brand-500/10 p-8 order-last lg:order-first">
                <p className="mb-4 text-sm font-semibold text-brand-500">Schedule a job in seconds</p>
                <div className="space-y-3">
                  {['Select trade type', 'Describe the issue', 'Choose your time slot', 'Confirm and relax'].map((step, i) => (
                    <div key={step} className="flex items-center gap-3 rounded-xl border border-border bg-background-elevated p-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-brand-500 text-sm font-bold">
                        {i + 1}
                      </span>
                      <p className="text-sm font-medium text-foreground">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <span className="mb-3 inline-block rounded-full bg-brand-500/15 px-3 py-1 text-xs font-semibold text-brand-500">
                  SCHEDULED BOOKINGS
                </span>
                <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                  Not urgent?<br />
                  Schedule on your terms
                </h2>
                <p className="mt-4 text-lg text-foreground-muted">
                  For non-emergency work, schedule a tradie at a time that suits you. Compare quotes, choose your preferred tradie, and relax.
                </p>
                <ul className="mt-6 space-y-3">
                  {STANDARD_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground-secondary">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-brand-500 text-xs">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </RevealSection>
      </section>

      {/* Safety & Trust */}
      <section className="border-t border-border py-20 px-4">
        <RevealSection>
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <span className="mb-3 inline-block rounded-full bg-brand-500/15 px-3 py-1 text-xs font-semibold text-brand-500">
                SAFETY & TRUST
              </span>
              <h2 className="text-3xl font-extrabold sm:text-4xl">Your safety is our #1 priority</h2>
              <p className="mx-auto mt-4 max-w-xl text-foreground-subtle">
                Every tradie on Fixit247 goes through a rigorous vetting process before they can accept a single job.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {SAFETY_ITEMS.map((item) => (
                <div key={item.title} className="rounded-2xl border border-border bg-background-elevated p-6 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-500">
                    <FxIcon name={item.icon} size={24} />
                  </div>
                  <h3 className="mb-2 text-base font-bold text-foreground">{item.title}</h3>
                  <p className="text-sm text-foreground-subtle leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>
      </section>

      {/* Transparent Pricing */}
      <section className="border-t border-border bg-background-alt py-20 px-4">
        <RevealSection>
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-500/15 px-3 py-1 text-xs font-semibold text-brand-500">
              TRANSPARENT PRICING
            </span>
            <h2 className="text-3xl font-extrabold sm:text-4xl">You always see the price before confirming</h2>
            <p className="mt-6 text-lg text-foreground-muted">
              No surprises. Every job shows a clear price estimate before you confirm. Our AI analyses the scope, your location, and market rates to give you a fair quote instantly.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-background-elevated p-6">
                <p className="mb-2 text-3xl font-extrabold text-foreground">$0</p>
                <p className="text-sm font-semibold text-foreground-secondary">To post a job</p>
                <p className="mt-1 text-xs text-foreground-subtle">Free to use as a customer. No subscription.</p>
              </div>
              <div className="rounded-2xl border border-brand-500/30 bg-brand-500/8 p-6">
                <p className="mb-2 text-3xl font-extrabold text-brand-500">Fixed</p>
                <p className="text-sm font-semibold text-foreground-secondary">Price per job</p>
                <p className="mt-1 text-xs text-foreground-subtle">Agreed before work starts. No hidden extras.</p>
              </div>
              <div className="rounded-2xl border border-border bg-background-elevated p-6">
                <p className="mb-2 text-3xl font-extrabold text-foreground">Escrow</p>
                <p className="text-sm font-semibold text-foreground-secondary">Payment held safely</p>
                <p className="mt-1 text-xs text-foreground-subtle">Released only when you confirm job is done.</p>
              </div>
            </div>
          </div>
        </RevealSection>
      </section>

      {/* App Features */}
      <section className="border-t border-border py-20 px-4">
        <RevealSection>
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <span className="mb-3 inline-block rounded-full bg-brand-500/15 px-3 py-1 text-xs font-semibold text-brand-500">
                APP FEATURES
              </span>
              <h2 className="text-3xl font-extrabold sm:text-4xl">Everything in your pocket</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {APP_FEATURES.map((f) => (
                <div key={f.title} className="flex items-start gap-4 rounded-2xl border border-border bg-background-elevated p-5">
                  <div className="shrink-0 text-brand-500">
                    <FxIcon name={f.icon} size={28} />
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-bold text-foreground">{f.title}</h3>
                    <p className="text-sm text-foreground-subtle">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border bg-background-alt py-20 px-4 text-center">
        <RevealSection>
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-extrabold sm:text-4xl">Post Your First Job Free</h2>
            <p className="mx-auto mt-4 max-w-lg text-foreground-muted">
              No signup fees, no subscription. Free to post a job and get matched with verified local tradies today.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/emergency"
                className="rounded-xl bg-brand-500 px-8 py-4 text-base font-bold text-gray-900 hover:bg-brand-400 transition-colors shadow-lg shadow-brand-500/20"
              >
                Post a Job Now
              </Link>
              <Link
                href="/join-as-tradie"
                className="rounded-xl border border-border px-8 py-4 text-base font-bold text-foreground hover:bg-background-elevated transition-colors"
              >
                Join as a Tradie
              </Link>
            </div>
          </div>
        </RevealSection>
      </section>
    </div>
  );
}
