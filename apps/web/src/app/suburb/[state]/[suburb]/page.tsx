import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@fixit247/database';
import { ChevronRight, Shield, Star, MapPin, Zap, Users } from 'lucide-react';

export const revalidate = 3600; // Re-generate suburb pages at most once per hour

const STATE_MAP: Record<string, string> = {
  nsw: 'New South Wales',
  vic: 'Victoria',
  qld: 'Queensland',
  wa: 'Western Australia',
  sa: 'South Australia',
  tas: 'Tasmania',
  act: 'Australian Capital Territory',
  nt: 'Northern Territory',
};

const VALID_STATES = Object.keys(STATE_MAP);

const TRADE_CATEGORIES = [
  { slug: 'plumbing', name: 'Plumbing', singular: 'Plumber', emoji: '🔧' },
  { slug: 'electrical', name: 'Electrical', singular: 'Electrician', emoji: '⚡' },
  { slug: 'hvac', name: 'HVAC', singular: 'HVAC Technician', emoji: '❄️' },
  { slug: 'carpentry', name: 'Carpentry', singular: 'Carpenter', emoji: '🪚' },
  { slug: 'painting', name: 'Painting', singular: 'Painter', emoji: '🖌️' },
  { slug: 'roofing', name: 'Roofing', singular: 'Roofer', emoji: '🏠' },
  { slug: 'tiling', name: 'Tiling', singular: 'Tiler', emoji: '🔲' },
  { slug: 'pest-control', name: 'Pest Control', singular: 'Pest Controller', emoji: '🐛' },
  { slug: 'locksmith', name: 'Locksmith', singular: 'Locksmith', emoji: '🔑' },
  { slug: 'glazing', name: 'Glazing', singular: 'Glazier', emoji: '🪟' },
  { slug: 'plastering', name: 'Plastering', singular: 'Plasterer', emoji: '🏗️' },
  { slug: 'landscaping', name: 'Landscaping', singular: 'Landscaper', emoji: '🌿' },
  { slug: 'cleaning', name: 'Cleaning', singular: 'Cleaner', emoji: '✨' },
  { slug: 'appliance-repair', name: 'Appliance Repair', singular: 'Appliance Technician', emoji: '🔌' },
  { slug: 'general-maintenance', name: 'General Maintenance', singular: 'Handyman', emoji: '🛠️' },
];

const EMERGENCY_TRADES = ['plumbing', 'electrical', 'locksmith', 'hvac', 'roofing'];

function formatSuburb(slug: string): string {
  return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export async function generateMetadata({ params }: { params: Promise<{ state: string; suburb: string }> }): Promise<Metadata> {
  const { state, suburb } = await params;
  if (!VALID_STATES.includes(state)) return {};
  const suburbName = formatSuburb(suburb);
  const stateName = STATE_MAP[state] ?? state.toUpperCase();
  const title = `Tradies in ${suburbName}, ${stateName} | All Trades · Same Day | Fixit 24/7`;
  const description = `Find trusted local tradies in ${suburbName}, ${stateName}. Plumbers, electricians, carpenters, painters and more. Same-day bookings, licensed & insured professionals.`;
  return {
    title,
    description,
    openGraph: { title, description, siteName: 'Fixit 24/7', locale: 'en_AU', type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `https://fixit247.com.au/suburb/${state}/${suburb}` },
    robots: { index: true, follow: true },
  };
}

export default async function SuburbLandingPage({ params }: { params: Promise<{ state: string; suburb: string }> }) {
  const { state, suburb } = await params;
  if (!VALID_STATES.includes(state)) notFound();

  const suburbName = formatSuburb(suburb);
  const stateName = STATE_MAP[state] ?? state.toUpperCase();

  // Fetch verified tradie count in the suburb
  const tradieCount = await db.tradieProfile.count({
    where: {
      verificationStatus: 'VERIFIED',
    },
  }).catch(() => 0);

  // JSON-LD structured data
  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `Fixit 24/7 — ${suburbName}`,
    description: `Australia's trusted trade services platform serving ${suburbName}, ${stateName}. All trades available same-day.`,
    url: 'https://fixit247.com.au',
    areaServed: {
      '@type': 'City',
      name: suburbName,
      containedInPlace: { '@type': 'State', name: stateName },
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      opens: '00:00',
      closes: '23:59',
      dayOfWeek: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://fixit247.com.au' },
      { '@type': 'ListItem', position: 2, name: 'Find a Tradie', item: 'https://fixit247.com.au/find-a-tradie' },
      { '@type': 'ListItem', position: 3, name: stateName, item: `https://fixit247.com.au/suburb/${state}` },
      { '@type': 'ListItem', position: 4, name: suburbName, item: `https://fixit247.com.au/suburb/${state}/${suburb}` },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How do I find a tradie in ${suburbName}?`,
        acceptedAnswer: { '@type': 'Answer', text: `Post your job on Fixit 24/7 and get matched with verified local tradies in ${suburbName} within minutes. All tradies are licensed, insured, and background-checked.` },
      },
      {
        '@type': 'Question',
        name: `What trades are available in ${suburbName}?`,
        acceptedAnswer: { '@type': 'Answer', text: `Fixit 24/7 offers all major trades in ${suburbName} including plumbing, electrical, HVAC, carpentry, painting, roofing, tiling, pest control, locksmith, glazing, plastering, landscaping, cleaning, appliance repair, and general maintenance.` },
      },
      {
        '@type': 'Question',
        name: `Are tradies in ${suburbName} available for emergencies?`,
        acceptedAnswer: { '@type': 'Answer', text: `Yes. Fixit 24/7 provides 24/7 emergency trade services in ${suburbName} for plumbing, electrical, locksmith, HVAC, and roofing emergencies. Average response time is under 60 minutes.` },
      },
      {
        '@type': 'Question',
        name: 'How does payment work?',
        acceptedAnswer: { '@type': 'Answer', text: 'Fixit 24/7 uses secure escrow payments. Your payment is held safely until you confirm the job is complete to your satisfaction. No payment is released until you approve.' },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-600 py-16 text-white">
          <div className="mx-auto max-w-5xl px-4">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-1 text-sm text-brand-200">
              <Link href="/" className="hover:text-white">Home</Link>
              <ChevronRight size={14} />
              <Link href="/find-a-tradie" className="hover:text-white">Find a Tradie</Link>
              <ChevronRight size={14} />
              <span className="text-white">{suburbName}</span>
            </nav>

            <div className="flex items-start gap-3 mb-4">
              <MapPin size={40} className="mt-1 shrink-0 text-brand-300" />
              <div>
                <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
                  Find Trusted Local Tradies<br />in {suburbName}
                </h1>
                <p className="mt-3 text-lg text-brand-100">
                  {stateName} · All trades available · Same-day bookings
                </p>
              </div>
            </div>

            {tradieCount > 0 && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
                <Users size={14} />
                <span><strong>{tradieCount}</strong> verified tradies in {suburbName}</span>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/post-job"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-lg font-bold text-brand-700 shadow-lg hover:bg-brand-50 transition-colors"
              >
                Post a Job — Free
              </Link>
              <Link
                href={`/emergency?suburb=${suburb}`}
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-red-400 bg-red-600 px-8 py-4 text-lg font-bold text-white hover:bg-red-700 transition-colors"
              >
                <Zap size={18} />
                Emergency Help
              </Link>
            </div>

            {/* Trust signals */}
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-brand-100">
              <span className="flex items-center gap-1.5"><Shield size={14} /> Licensed &amp; insured</span>
              <span className="flex items-center gap-1.5"><Star size={14} /> 4.9★ average rating</span>
              <span className="flex items-center gap-1.5"><Zap size={14} /> Same-day available</span>
            </div>
          </div>
        </section>

        {/* All trades grid */}
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              All Trades Available in {suburbName}
            </h2>
            <p className="text-gray-500 mb-8">Choose a trade to find verified local professionals</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {TRADE_CATEGORIES.map((t) => (
                <Link
                  key={t.slug}
                  href={`/trade/${t.slug}/${suburb}`}
                  className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 hover:border-brand-300 hover:bg-brand-50 transition-colors group"
                >
                  <span className="text-2xl">{t.emoji}</span>
                  <div>
                    <p className="font-semibold text-gray-900 group-hover:text-brand-700">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.singular}s near you</p>
                  </div>
                  <ChevronRight size={16} className="ml-auto text-gray-300 group-hover:text-brand-400" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Emergency services */}
        <section className="py-16 bg-red-50">
          <div className="mx-auto max-w-5xl px-4">
            <div className="flex items-center gap-3 mb-2">
              <Zap size={24} className="text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Emergency Services in {suburbName}
              </h2>
            </div>
            <p className="text-gray-500 mb-8">
              24/7 emergency dispatch — verified tradies on call around the clock
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {TRADE_CATEGORIES.filter((t) => EMERGENCY_TRADES.includes(t.slug)).map((t) => (
                <Link
                  key={t.slug}
                  href={`/emergency/${t.slug}/${suburb}`}
                  className="flex items-center gap-3 rounded-2xl border border-red-200 bg-white p-4 hover:border-red-400 hover:bg-red-50 transition-colors group"
                >
                  <span className="text-2xl">{t.emoji}</span>
                  <div>
                    <p className="font-semibold text-gray-900 group-hover:text-red-700">
                      Emergency {t.singular}
                    </p>
                    <p className="text-xs text-red-400">60-min response · 24/7</p>
                  </div>
                  <ChevronRight size={16} className="ml-auto text-red-200 group-hover:text-red-400" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-gray-50">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions — Tradies in {suburbName}
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: `How do I find a tradie in ${suburbName}?`,
                  a: `Post your job on Fixit 24/7 and get matched with verified local tradies in ${suburbName} within minutes. All tradies are licensed, insured, and background-checked.`,
                },
                {
                  q: `What trades are available in ${suburbName}?`,
                  a: `Fixit 24/7 offers all major trades in ${suburbName} including plumbing, electrical, HVAC, carpentry, painting, roofing, tiling, pest control, locksmith, glazing, plastering, landscaping, cleaning, appliance repair, and general maintenance.`,
                },
                {
                  q: `Are tradies in ${suburbName} available for emergencies?`,
                  a: `Yes. Fixit 24/7 provides 24/7 emergency trade services in ${suburbName} for plumbing, electrical, locksmith, HVAC, and roofing emergencies. Average response time is under 60 minutes.`,
                },
                {
                  q: 'How does payment work?',
                  a: "Fixit 24/7 uses secure escrow payments. Your payment is held safely until you confirm the job is complete to your satisfaction. No payment is released until you approve.",
                },
              ].map(({ q, a }, i) => (
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
        <section className="bg-[#0a0a0a] py-16 text-white">
          <div className="mx-auto max-w-2xl px-4 text-center">
            <h2 className="text-3xl font-extrabold mb-4">
              Ready to Find a Tradie in {suburbName}?
            </h2>
            <p className="mb-8 text-gray-400">
              Post your job free and get matched with verified local professionals in minutes.
            </p>
            <Link
              href="/post-job"
              className="inline-flex items-center gap-2 rounded-2xl bg-brand-600 px-10 py-5 text-lg font-bold text-white shadow-lg hover:bg-brand-700 transition-colors"
            >
              Post a Job — It&apos;s Free
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
