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
    href: '/auth/register?role=TRADIE&plan=FREE',
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
    href: '/auth/register?role=TRADIE&plan=PROFESSIONAL',
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
    href: '/auth/register?role=TRADIE&plan=ELITE',
  },
];

const PLAN_FEATURE_ROWS: Array<{ key: keyof typeof TRADIE_PLANS[0]['features']; label: string }> = [
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
    <>
      {/* 1. Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-20 text-center text-white">
        <div className="relative z-10 mx-auto max-w-3xl">
          <span className="mb-4 inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            💰 No hidden fees, ever
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-gray-300">
            Free for customers. Flexible plans for tradies. You always know what you&apos;re paying before you commit.
          </p>
        </div>
      </section>

      {/* 2. Customer Pricing */}
      <section className="bg-white py-20 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
              FOR CUSTOMERS
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900">Free to use — pay only for the job</h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-600">
              No subscription, no posting fees. Post a job for free and pay only when work is done.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-brand-200 bg-brand-50 p-6 text-center">
              <p className="mb-2 text-3xl font-extrabold text-brand-700">$0</p>
              <p className="text-sm font-semibold text-gray-800">To post a job</p>
              <p className="mt-2 text-xs text-gray-500">No credit card required to get started</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center">
              <p className="mb-2 text-3xl font-extrabold text-gray-900">Fixed</p>
              <p className="text-sm font-semibold text-gray-800">Price before you confirm</p>
              <p className="mt-2 text-xs text-gray-500">AI-generated quote shown upfront</p>
            </div>
            <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
              <p className="mb-2 text-3xl font-extrabold text-green-700">Escrow</p>
              <p className="text-sm font-semibold text-gray-800">Payment protection</p>
              <p className="mt-2 text-xs text-gray-500">Funds held until you confirm job done</p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/emergency"
              className="inline-block rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white hover:bg-brand-700 transition-colors"
            >
              Post Your First Job Free →
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Tradie Pricing — 3-tier table */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
              FOR TRADIES
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900">Tradie subscription plans</h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-600">
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
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">{plan.name}</h3>
                <p className="mt-2 text-3xl font-extrabold text-gray-900">{plan.price}</p>
                <Link
                  href={plan.href}
                  className={`mt-6 block w-full rounded-xl py-3 text-center text-sm font-bold transition-colors ${
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

          {/* Feature comparison table */}
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Feature</th>
                  {TRADIE_PLANS.map((plan) => (
                    <th
                      key={plan.name}
                      className={`p-4 text-center text-xs font-bold uppercase tracking-wide ${
                        plan.highlight ? 'bg-brand-50 text-brand-700' : 'text-gray-700'
                      }`}
                    >
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PLAN_FEATURE_ROWS.map((row, idx) => (
                  <tr key={row.key} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-4 font-medium text-gray-700">{row.label}</td>
                    {TRADIE_PLANS.map((plan) => (
                      <td
                        key={plan.name}
                        className={`p-4 text-center ${
                          plan.highlight ? 'bg-brand-50/50 font-semibold text-brand-700' : 'text-gray-600'
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
      <section className="bg-white py-20 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
              LEAD CREDITS
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900">Lead credit pricing by trade</h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-600">
              Credits are purchased in bundles. 1 credit = $5. Professional and Elite subscribers get automatic discounts.
            </p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="p-4 text-left font-semibold text-gray-700">Trade</th>
                  <th className="p-4 text-center font-semibold text-gray-700">Credits per lead</th>
                  <th className="p-4 text-center font-semibold text-gray-700">Standard price</th>
                  <th className="p-4 text-center font-semibold text-brand-700">Pro price (−20%)</th>
                  <th className="p-4 text-center font-semibold text-purple-700">Elite price (−35%)</th>
                </tr>
              </thead>
              <tbody>
                {LEAD_PRICING.map((row, idx) => {
                  const basePrice = parseInt(row.price.replace('$', ''));
                  const proPrice = Math.round(basePrice * 0.8);
                  const elitePrice = Math.round(basePrice * 0.65);
                  return (
                    <tr key={row.trade} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-4 font-medium text-gray-800">{row.trade}</td>
                      <td className="p-4 text-center text-gray-600">{row.credits}</td>
                      <td className="p-4 text-center text-gray-600">{row.price}</td>
                      <td className="p-4 text-center font-medium text-brand-700">${proPrice}</td>
                      <td className="p-4 text-center font-medium text-purple-700">${elitePrice}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. Platform Fee */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-3 inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
            PLATFORM FEE
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900">15% — released only when the job is done</h2>
          <p className="mt-6 text-lg text-gray-600">
            Fixit 24/7 charges tradies a 15% platform fee on each completed job. The fee is deducted automatically when the customer marks the job as complete and funds are released from escrow.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
              <p className="text-4xl font-extrabold text-gray-900">85%</p>
              <p className="mt-1 text-sm font-semibold text-gray-700">Goes to you</p>
              <p className="mt-1 text-xs text-gray-500">Direct bank deposit</p>
            </div>
            <div className="rounded-2xl border border-brand-200 bg-brand-50 p-6 text-center shadow-sm">
              <p className="text-4xl font-extrabold text-brand-700">15%</p>
              <p className="mt-1 text-sm font-semibold text-gray-700">Fixit platform fee</p>
              <p className="mt-1 text-xs text-gray-500">Covers platform, support & payments</p>
            </div>
            <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center shadow-sm">
              <p className="text-4xl font-extrabold text-green-700">$0</p>
              <p className="mt-1 text-sm font-semibold text-gray-700">Fee before completion</p>
              <p className="mt-1 text-xs text-gray-500">Only charged when job is done</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="bg-white py-20 px-4">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
              FAQ
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900">Pricing questions</h2>
          </div>
          <div className="space-y-5">
            {PRICING_FAQS.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
                <h3 className="mb-2 text-base font-bold text-gray-900">{faq.q}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA */}
      <section className="bg-gradient-to-br from-brand-600 to-brand-800 py-20 px-4 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-extrabold sm:text-4xl">Start Free, Upgrade When Ready</h2>
          <p className="mx-auto mt-4 max-w-lg text-brand-100">
            No lock-in, no credit card required to get started. Join thousands of Australians already using Fixit 24/7.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/register?role=TRADIE"
              className="rounded-xl bg-white px-8 py-4 text-base font-bold text-brand-700 hover:bg-brand-50 transition-colors shadow-lg"
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
    </>
  );
}
