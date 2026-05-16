import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@fixit247/database';
import { ChevronRight, Phone, Clock, Shield, Star, MapPin, Zap } from 'lucide-react';

// Trade display names
const TRADE_MAP: Record<string, { name: string; singular: string; emoji: string }> = {
  plumbing: { name: 'Plumbing', singular: 'Plumber', emoji: '🔧' },
  electrical: { name: 'Electrical', singular: 'Electrician', emoji: '⚡' },
  hvac: { name: 'HVAC', singular: 'HVAC Technician', emoji: '❄️' },
  carpentry: { name: 'Carpentry', singular: 'Carpenter', emoji: '🪚' },
  painting: { name: 'Painting', singular: 'Painter', emoji: '🖌️' },
  roofing: { name: 'Roofing', singular: 'Roofer', emoji: '🏠' },
  tiling: { name: 'Tiling', singular: 'Tiler', emoji: '🔲' },
  'pest-control': { name: 'Pest Control', singular: 'Pest Controller', emoji: '🐛' },
  locksmith: { name: 'Locksmith', singular: 'Locksmith', emoji: '🔑' },
  glazing: { name: 'Glazing', singular: 'Glazier', emoji: '🪟' },
  plastering: { name: 'Plastering', singular: 'Plasterer', emoji: '🏗️' },
  landscaping: { name: 'Landscaping', singular: 'Landscaper', emoji: '🌿' },
  cleaning: { name: 'Cleaning', singular: 'Cleaner', emoji: '✨' },
  'appliance-repair': { name: 'Appliance Repair', singular: 'Appliance Technician', emoji: '🔌' },
  'general-maintenance': { name: 'General Maintenance', singular: 'Handyman', emoji: '🛠️' },
};

function formatSuburb(slug: string): string {
  return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export async function generateMetadata({ params }: { params: Promise<{ trade: string; suburb: string }> }): Promise<Metadata> {
  const { trade, suburb } = await params;
  const tradeInfo = TRADE_MAP[trade];
  if (!tradeInfo) return {};
  const suburbName = formatSuburb(suburb);
  const title = `Emergency ${tradeInfo.singular} ${suburbName} | 60-Min Response | Fixit 24/7`;
  const description = `Need an emergency ${tradeInfo.singular.toLowerCase()} in ${suburbName}? Fixit 24/7 dispatches verified local tradies in under 60 minutes, 24/7. Licensed, insured, available now.`;
  return {
    title,
    description,
    openGraph: { title, description, siteName: 'Fixit 24/7', locale: 'en_AU', type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `https://fixit247.com.au/emergency/${trade}/${suburb}` },
    robots: { index: true, follow: true },
  };
}

const FAQS_BY_TRADE: Record<string, { q: string; a: string }[]> = {
  plumbing: [
    { q: 'How quickly can a plumber arrive in an emergency?', a: 'Fixit 24/7 dispatches verified local plumbers within 60 minutes for emergencies, 24 hours a day, 7 days a week.' },
    { q: 'What counts as a plumbing emergency?', a: 'Burst pipes, severe leaks, blocked drains causing flooding, hot water system failures, and gas leaks all qualify as plumbing emergencies.' },
    { q: 'Are your plumbers licensed in Australia?', a: 'Yes. All tradies on Fixit 24/7 are fully licensed, insured, and background-checked before they can accept jobs.' },
    { q: 'What does emergency plumbing cost?', a: 'Emergency plumbing in Australia typically ranges from $150–$600+ depending on the issue. Fixit 24/7 provides upfront pricing before work begins.' },
  ],
  electrical: [
    { q: 'Is it safe to wait for an electrician in an emergency?', a: 'No — electrical emergencies like sparking outlets, burning smells, or power outages can be life-threatening. Call us immediately.' },
    { q: 'Do you provide 24/7 emergency electrical services?', a: 'Yes. Fixit 24/7 has licensed electricians on call 24 hours a day across all major Australian cities.' },
    { q: 'What electrical issues are considered emergencies?', a: 'Complete power loss, sparking/burning outlets, tripping circuit breakers, flickering lights with no cause, and exposed wiring.' },
    { q: 'How much does an emergency electrician cost?', a: 'Emergency electrician call-outs typically cost $200–$500 depending on the time of day and complexity of the work.' },
  ],
  locksmith: [
    { q: 'Can a locksmith open my door without damaging it?', a: 'Yes. Professional locksmiths use non-destructive entry methods in most cases. Fixit 24/7 tradies are trained to preserve your locks.' },
    { q: 'How fast can a locksmith arrive?', a: 'Our locksmith network guarantees a 60-minute response for emergency lockouts across major Australian cities.' },
    { q: "What if I'm locked out at 3am?", a: 'Fixit 24/7 operates 24/7/365. No matter the time, we can dispatch a verified locksmith to your location.' },
    { q: 'How much does an emergency locksmith cost?', a: "Emergency locksmith services typically cost $100–$300, depending on lock type and time of day. You'll see the price before booking." },
  ],
};

const DEFAULT_FAQS = [
  { q: 'How quickly can a tradie arrive in an emergency?', a: 'Fixit 24/7 dispatches verified local tradies within 60 minutes for emergencies, available 24 hours a day, 7 days a week.' },
  { q: 'Are tradies on Fixit 24/7 licensed and insured?', a: 'Yes. Every tradie is fully licensed, insured, and background-checked before they can accept jobs on the platform.' },
  { q: 'How does pricing work?', a: 'You get upfront pricing before confirming the job. Payment is held securely until the work is complete to your satisfaction.' },
  { q: 'What areas do you service?', a: 'Fixit 24/7 services all major cities and suburbs across Australia including Sydney, Melbourne, Brisbane, Perth, and Adelaide.' },
];

export default async function EmergencyTradePage({ params }: { params: Promise<{ trade: string; suburb: string }> }) {
  const { trade, suburb } = await params;
  const tradeInfo = TRADE_MAP[trade];
  if (!tradeInfo) notFound();

  const suburbName = formatSuburb(suburb);
  const tradeCategoryKey = trade.toUpperCase().replace(/-/g, '_');
  const faqs = FAQS_BY_TRADE[trade] ?? DEFAULT_FAQS;

  // Fetch real local tradies from DB
  const localTradies = await db.tradieProfile.findMany({
    where: {
      tradeCategories: { has: tradeCategoryKey as any },
      verificationStatus: 'VERIFIED',
      servicedSuburbs: { hasSome: [suburbName, suburb] },
    },
    include: { user: { select: { firstName: true, lastName: true, avatarUrl: true } } },
    take: 6,
    orderBy: { avgRating: 'desc' },
  }).catch(() => []);

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Emergency ${tradeInfo.singular} in ${suburbName}`,
    description: `24/7 emergency ${tradeInfo.name.toLowerCase()} services in ${suburbName}. Verified and licensed professionals.`,
    areaServed: suburbName,
    availableChannel: { '@type': 'ServiceChannel', serviceUrl: 'https://fixit247.com.au', servicePhone: '1800-FIXIT-247' },
    hoursAvailable: { '@type': 'OpeningHoursSpecification', opens: '00:00', closes: '23:59', dayOfWeek: ['Mo','Tu','We','Th','Fr','Sa','Su'] },
    provider: { '@type': 'Organization', name: 'Fixit 24/7', url: 'https://fixit247.com.au' },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://fixit247.com.au' },
      { '@type': 'ListItem', position: 2, name: 'Emergency Services', item: 'https://fixit247.com.au/emergency' },
      { '@type': 'ListItem', position: 3, name: tradeInfo.name, item: `https://fixit247.com.au/emergency/${trade}` },
      { '@type': 'ListItem', position: 4, name: suburbName, item: `https://fixit247.com.au/emergency/${trade}/${suburb}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="min-h-screen bg-white">
        {/* Hero — red emergency banner */}
        <section className="bg-red-600 py-16 text-white">
          <div className="mx-auto max-w-5xl px-4">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-1 text-sm text-red-200">
              <Link href="/" className="hover:text-white">Home</Link>
              <ChevronRight size={14} />
              <Link href="/emergency" className="hover:text-white">Emergency</Link>
              <ChevronRight size={14} />
              <Link href={`/emergency/${trade}`} className="hover:text-white">{tradeInfo.name}</Link>
              <ChevronRight size={14} />
              <span className="text-white">{suburbName}</span>
            </nav>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-5xl">{tradeInfo.emoji}</span>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex h-2 w-2 animate-pulse rounded-full bg-red-300" />
                  <span className="text-sm font-bold uppercase tracking-widest text-red-200">Available Now · 24/7</span>
                </div>
                <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
                  Emergency {tradeInfo.singular}<br />in {suburbName}
                </h1>
              </div>
            </div>

            <p className="mt-4 max-w-2xl text-lg text-red-100">
              Verified, licensed {tradeInfo.singular.toLowerCase()}s dispatched within 60 minutes.
              Available 24/7 across {suburbName} and surrounds.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/emergency"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-lg font-bold text-red-600 shadow-lg hover:bg-red-50 transition-colors"
              >
                <Zap size={20} />
                Get Emergency Help Now
              </Link>
              <a
                href="tel:1800348498"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-white px-8 py-4 text-lg font-bold text-white hover:bg-red-700 transition-colors"
              >
                <Phone size={20} />
                Call Now
              </a>
            </div>

            {/* Trust signals */}
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-red-100">
              <span className="flex items-center gap-1.5"><Clock size={14} /> 60-min response</span>
              <span className="flex items-center gap-1.5"><Shield size={14} /> Licensed &amp; insured</span>
              <span className="flex items-center gap-1.5"><Star size={14} /> 4.9★ average rating</span>
              <span className="flex items-center gap-1.5"><MapPin size={14} /> Local to {suburbName}</span>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 bg-gray-50">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              How Emergency Dispatch Works in {suburbName}
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { step: '1', title: 'Describe Your Emergency', desc: "Tell us what's wrong. Our AI analyses urgency and matches you to the nearest available tradie.", icon: '📋' },
                { step: '2', title: 'Instant Matching', desc: 'We notify verified local tradies in real-time. The first available one accepts your job immediately.', icon: '⚡' },
                { step: '3', title: 'Tradie En Route', desc: `Track your tradie live on the map. Average arrival time in ${suburbName}: under 60 minutes.`, icon: '🚗' },
              ].map((s) => (
                <div key={s.step} className="rounded-2xl bg-white p-6 shadow-sm text-center">
                  <div className="mb-3 text-4xl">{s.icon}</div>
                  <div className="mb-1 text-xs font-bold uppercase tracking-widest text-brand-600">Step {s.step}</div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">{s.title}</h3>
                  <p className="text-sm text-gray-500">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Local tradies (if any found) */}
        {localTradies.length > 0 && (
          <section className="py-16">
            <div className="mx-auto max-w-5xl px-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Verified {tradeInfo.singular}s Near {suburbName}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {localTradies.map((t) => (
                  <div key={t.id} className="rounded-2xl border border-gray-200 bg-white p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-lg font-bold text-brand-700">
                        {t.user.firstName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{t.user.firstName} {t.user.lastName}</p>
                        <div className="flex items-center gap-1 text-sm text-yellow-600">
                          <Star size={12} className="fill-yellow-500 text-yellow-500" />
                          <span>{t.avgRating ? Number(t.avgRating).toFixed(1) : 'New'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <Shield size={12} />
                      <span>Verified &amp; Licensed</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="py-16 bg-gray-50">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions — Emergency {tradeInfo.singular} {suburbName}
            </h2>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map(({ q, a }) => ({
                '@type': 'Question',
                name: q,
                acceptedAnswer: { '@type': 'Answer', text: a },
              })),
            }) }} />
            <div className="space-y-4">
              {faqs.map(({ q, a }, i) => (
                <details key={i} className="group rounded-2xl border border-gray-200 bg-white">
                  <summary className="flex cursor-pointer items-center justify-between p-5 font-semibold text-gray-900 hover:text-brand-700">
                    {q}
                    <ChevronRight size={16} className="shrink-0 rotate-90 transition-transform group-open:rotate-[270deg]" />
                  </summary>
                  <p className="px-5 pb-5 text-sm text-gray-600">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA footer */}
        <section className="bg-gray-900 py-16 text-white">
          <div className="mx-auto max-w-2xl px-4 text-center">
            <h2 className="text-3xl font-extrabold mb-4">
              Need an Emergency {tradeInfo.singular} in {suburbName}?
            </h2>
            <p className="mb-8 text-gray-400">
              Don&apos;t wait. Our AI dispatch system connects you with verified local tradies in minutes.
            </p>
            <Link
              href="/emergency"
              className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-10 py-5 text-lg font-bold text-white shadow-lg hover:bg-red-700 transition-colors"
            >
              <Zap size={20} />
              Get Help Now — It&apos;s Free to Post
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
