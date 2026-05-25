import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pricing | Fixit 24/7 — Simple, Transparent Pricing',
  description: 'Free to post jobs as a customer. Flexible plans for tradies starting at $0/mo. See our full pricing breakdown.',
};

const TRADIE_PLANS = [
  {
    name: 'FREE',
    price: '$0',
    highlight: false,
    features: {
      leads: '5 / month',
      emergency: '✓ Standard',
      analytics: '✗',
      responseTime: 'Standard',
      discount: '0%',
      support: 'Email',
    },
    cta: 'Start Free',
    href: '/register?role=TRADIE&plan=FREE',
  },
  {
    name: 'PROFESSIONAL',
    price: '$99/mo',
    highlight: true,
    badge: 'Most Popular',
    features: {
      leads: 'Unlimited',
      emergency: '✓ Priority',
      analytics: '✓ Standard',
      responseTime: 'Fast',
      discount: '20%',
      support: 'Priority email',
    },
    cta: 'Start 14-day Trial',
    href: '/register?role=TRADIE&plan=PROFESSIONAL',
  },
  {
    name: 'ELITE',
    price: '$199/mo',
    highlight: false,
    features: {
      leads: 'Unlimited',
      emergency: '✓ First pick',
      analytics: '✓ Advanced',
      responseTime: 'Instant',
      discount: '35%',
      support: 'Dedicated manager',
    },
    cta: 'Go Elite',
    href: '/register?role=TRADIE&plan=ELITE',
  },
];

const PLAN_FEATURE_ROWS: { key: keyof typeof TRADIE_PLANS[0]['features']; label: string }[] = [
  { key: 'leads', label: 'Leads per month' },
  { key: 'emergency', label: 'Emergency dispatch' },
  { key: 'analytics', label: 'Analytics dashboard' },
  { key: 'responseTime', label: 'Response time' },
  { key: 'discount', label: 'Subscription discount on leads' },
  { key: 'support', label: 'Support' },
];

const LEAD_PRICING = [
  { trade: 'Plumbing', credits: 3, price: '$15' },
  { trade: 'Electrical', credits: 4, price: '$20' },
  { trade: 'HVAC / Air Con', credits: 5, price: '$25' },
  { trade: 'Locksmith', credits: 2, price: '$10' },
  { trade: 'Roofing', credits: 6, price: '$30' },
  { trade: 'Carpentry', credits: 3, price: '$15' },
  { trade: 'Painting', credits: 2, price: '$10' },
  { trade: 'Tiling', credits: 3, price: '$15' },
  { trade: 'Glazing', credits: 4, price: '$20' },
  { trade: 'Pest Control', credits: 2, price: '$10' },
  { trade: 'Plastering', credits: 3, price: '$15' },
  { trade: 'Landscaping', credits: 2, price: '$10' },
  { trade: 'Cleaning', credits: 1, price: '$5' },
  { trade: 'Appliance Repair', credits: 2, price: '$10' },
  { trade: 'General Maintenance', credits: 1, price: '$5' },
];

const PRICING_FAQS = [
  {
    q: 'Is it free to post a job as a customer?',
    a: 'Yes — completely free. There is no subscription or posting fee for customers. You only pay the agreed job price after the work is done.',
  },
  {
    q: 'How does the 15% platform fee work?',
    a: 'When a job is completed and the customer confirms, 85% of the payment goes directly to the tradie. Fixit 24/7 retains 15% to cover platform costs, payment processing, and support. This fee is always taken from the tradie side — never charged to customers.',
  },
  {
    q: 'What are lead credits and how do I buy them?',
    a: 'Each time a new job is posted in your area, you use lead credits to claim it. Credits can be purchased in bundles from your dashboard. Professional and Elite subscribers receive an automatic discount of 20% and 35% respectively on all credit purchases.',
  },
  {
    q: 'Can I upgrade or downgrade my plan at any time?',
    a: 'Yes. You can change your plan at any time from your tradie dashboard. Upgrades take effect immediately; downgrades take effect at the end of your current billing cycle.',
  },
  {
    q: 'Is there a free trial for paid plans?',
    a: 'Yes — the Professional plan comes with a 14-day free trial. No credit card required to start the trial.',
  },
];

export default function PricingPage() {
  return (
    <div className="bg-background text-foreground transition-colors duration-300">
      {/* 1. Hero */}
      <section className="relative px-4 py-20 text-center">
        <div className="relative z-10 mx-auto max-w-3xl">
          <span className="mb-4 inline-flex items-center rounded-full border border-border bg-background-elevated px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            💰 No hidden fees, ever
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-foreground-muted">
            Free for customers. Flexible plans for tradies. You always know what you&apos;re paying before you commit.
          </p>
        </div>
      </section>

      {/* 2. Customer Pricing */}
      <section className="bg-background-alt py-20 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-500/20 px-3 py-1 text-xs font-semibold text-brand-500">
              FOR CUSTOMERS
            </span>
            <h2 className="text-3xl font-extrabold">Free to use — pay only for the job</h2>
            <p className="mx-auto mt-4 max-w-xl text-foreground-muted">
              No subscription, no posting fees. Post a job for free and pay only when work is done.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-brand-500/30 bg-brand-500/10 p-6 text-center">
              <p className="mb-2 text-3xl font-extrabold text-brand-500">$0</p>
              <p className="text-sm font-semibold text-foreground">To post a job</p>
              <p className="mt-2 text-xs text-foreground-subtle">No credit card required to get started</p>
            </div>
            <div className="rounded-2xl border border-border bg-background-elevated p-6 text-center">
              <p className="mb-2 text-3xl font-extrabold text-foreground">Fixed</p>
              <p className="text-sm font-semibold text-foreground">Price before you confirm</p>
              <p className="mt-2 text-xs text-foreground-subtle">AI-generated quote shown upfront</p>
            </div>
            <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-6 text-center">
              <p className="mb-2 text-3xl font-extrabold text-green-500 dark:text-green-400">Escrow</p>
              <p className="text-sm font-semibold text-foreground">Payment protection</p>
              <p className="mt-2 text-xs text-foreground-subtle">Funds held until you confirm job done</p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/emergency"
              className="inline-block rounded-xl bg-brand-500 px-6 py-3 text-sm font-bold text-gray-900 hover:bg-brand-400 transition-colors"
            >
              Post Your First Job Free →
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Tradie Pricing — 3-tier table */}
      <section className="bg-background py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-500/20 px-3 py-1 text-xs font-semibold text-brand-500">
              FOR TRADIES
            </span>
            <h2 className="text-3xl font-extrabold">Tradie subscription plans</h2>
            <p className="mx-auto mt-4 max-w-xl text-foreground-muted">
              Start free, upgrade when you&apos;re ready. No lock-in contracts — cancel anytime.
            </p>
          </div>

          {/* Plan cards (mobile-friendly) */}
          <div className="mb-12 grid gap-8 lg:grid-cols-3">
            {TRADIE_PLANS.map((plan) => (
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
                <h3 className="text-xs font-bold uppercase tracking-widest text-foreground-subtle">{plan.name}</h3>
                <p className="mt-2 text-3xl font-extrabold text-foreground">{plan.price}</p>
                <Link
                  href={plan.href}
                  className={`mt-6 block w-full rounded-xl py-3 text-center text-sm font-bold transition-colors ${
                    plan.highlight
                      ? 'bg-brand-500 text-gray-900 hover:bg-brand-400'
                      : 'bg-background-alt text-foreground hover:bg-background-elevated border border-border'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Feature comparison table */}
          <div className="overflow-x-auto rounded-2xl border border-border bg-background-elevated shadow-sm">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-foreground-subtle">Feature</th>
                  {TRADIE_PLANS.map((plan) => (
                    <th
                      key={plan.name}
                      className={`p-4 text-center text-xs font-bold uppercase tracking-wide ${
                        plan.highlight ? 'text-brand-500' : 'text-foreground-muted'
                      }`}
                    >
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PLAN_FEATURE_ROWS.map((row, idx) => (
                  <tr key={row.key} className={idx % 2 === 0 ? 'bg-transparent' : 'bg-background-alt'}>
                    <td className="p-4 font-medium text-foreground-muted">{row.label}</td>
                    {TRADIE_PLANS.map((plan) => (
                      <td
                        key={plan.name}
                        className={`p-4 text-center ${
                          plan.highlight ? 'font-semibold text-brand-500' : 'text-foreground-muted'
                        }`}
                      >
                        {plan.features[row.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. Lead Pricing Breakdown */}
      <section className="bg-background-alt py-20 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-500/20 px-3 py-1 text-xs font-semibold text-brand-500">
              LEAD CREDITS
            </span>
            <h2 className="text-3xl font-extrabold">Lead credit pricing by trade</h2>
            <p className="mx-auto mt-4 max-w-xl text-foreground-muted">
              Credits are purchased in bundles. 1 credit = $5. Professional and Elite subscribers get automatic discounts.
            </p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-border bg-background-elevated shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background-alt">
                  <th className="p-4 text-left font-semibold text-foreground-muted">Trade</th>
                  <th className="p-4 text-center font-semibold text-foreground-muted">Credits per lead</th>
                  <th className="p-4 text-center font-semibold text-foreground-muted">Standard price</th>
                  <th className="p-4 text-center font-semibold text-brand-500">Pro price (−20%)</th>
                  <th className="p-4 text-center font-semibold text-purple-500 dark:text-purple-400">Elite price (−35%)</th>
                </tr>
              </thead>
              <tbody>
                {LEAD_PRICING.map((row, idx) => {
                  const basePrice = parseInt(row.price.replace('$', ''));
                  const proPrice = Math.round(basePrice * 0.8);
                  const elitePrice = Math.round(basePrice * 0.65);
                  return (
                    <tr key={row.trade} className={idx % 2 === 0 ? 'bg-transparent' : 'bg-background-alt'}>
                      <td className="p-4 font-medium text-foreground">{row.trade}</td>
                      <td className="p-4 text-center text-foreground-muted">{row.credits}</td>
                      <td className="p-4 text-center text-foreground-muted">{row.price}</td>
                      <td className="p-4 text-center font-medium text-brand-500">${proPrice}</td>
                      <td className="p-4 text-center font-medium text-purple-500 dark:text-purple-400">${elitePrice}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. Platform Fee */}
      <section className="bg-background py-20 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-3 inline-block rounded-full bg-brand-500/20 px-3 py-1 text-xs font-semibold text-brand-500">
            PLATFORM FEE
          </span>
          <h2 className="text-3xl font-extrabold">15% — released only when the job is done</h2>
          <p className="mt-6 text-lg text-foreground-muted">
            Fixit 24/7 charges tradies a 15% platform fee on each completed job. The fee is deducted automatically when the customer marks the job as complete and funds are released from escrow.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-background-elevated p-6 text-center shadow-sm">
              <p className="text-4xl font-extrabold text-foreground">85%</p>
              <p className="mt-1 text-sm font-semibold text-foreground-muted">Goes to you</p>
              <p className="mt-1 text-xs text-foreground-subtle">Direct bank deposit</p>
            </div>
            <div className="rounded-2xl border border-brand-500/30 bg-brand-500/10 p-6 text-center shadow-sm">
              <p className="text-4xl font-extrabold text-brand-500">15%</p>
              <p className="mt-1 text-sm font-semibold text-foreground-muted">Fixit platform fee</p>
              <p className="mt-1 text-xs text-foreground-subtle">Covers platform, support & payments</p>
            </div>
            <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-6 text-center shadow-sm">
              <p className="text-4xl font-extrabold text-green-500 dark:text-green-400">$0</p>
              <p className="mt-1 text-sm font-semibold text-foreground-muted">Fee before completion</p>
              <p className="mt-1 text-xs text-foreground-subtle">Only charged when job is done</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="bg-background-alt py-20 px-4">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-500/20 px-3 py-1 text-xs font-semibold text-brand-500">
              FAQ
            </span>
            <h2 className="text-3xl font-extrabold">Pricing questions</h2>
          </div>
          <div className="space-y-5">
            {PRICING_FAQS.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-border bg-background-elevated p-6">
                <h3 className="mb-2 text-base font-bold text-foreground">{faq.q}</h3>
                <p className="text-sm leading-relaxed text-foreground-muted">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA */}
      <section className="bg-gradient-to-br from-brand-600 to-brand-800 py-20 px-4 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Start Free, Upgrade When Ready</h2>
          <p className="mx-auto mt-4 max-w-lg text-brand-100">
            No lock-in, no credit card required to get started. Join thousands of Australians already using Fixit 24/7.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/register?role=TRADIE"
              className="rounded-xl bg-brand-400 px-8 py-4 text-base font-bold text-gray-900 hover:bg-brand-300 transition-colors shadow-lg"
            >
              Join as a Tradie — Free
            </Link>
            <Link
              href="/emergency"
              className="rounded-xl border border-white/30 px-8 py-4 text-base font-bold text-white hover:bg-white/10 transition-colors"
            >
              Post a Job as Customer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
