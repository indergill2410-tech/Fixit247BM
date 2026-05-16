import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@fixit247/database';
import { ChevronRight, Clock, Shield, Star, MapPin, CheckCircle, Calendar } from 'lucide-react';

// Trade display names
const TRADE_MAP: Record<string, { name: string; singular: string; emoji: string; description: string }> = {
  plumbing: { name: 'Plumbing', singular: 'Plumber', emoji: '🔧', description: 'from blocked drains and burst pipes to hot water systems and bathroom renovations' },
  electrical: { name: 'Electrical', singular: 'Electrician', emoji: '⚡', description: 'from power points and lighting to switchboard upgrades and safety inspections' },
  hvac: { name: 'HVAC', singular: 'HVAC Technician', emoji: '❄️', description: 'from air conditioning installation and servicing to heating and ventilation systems' },
  carpentry: { name: 'Carpentry', singular: 'Carpenter', emoji: '🪚', description: 'from custom furniture and decking to door installations and timber repairs' },
  painting: { name: 'Painting', singular: 'Painter', emoji: '🖌️', description: 'from interior and exterior painting to feature walls and commercial painting projects' },
  roofing: { name: 'Roofing', singular: 'Roofer', emoji: '🏠', description: 'from roof repairs and replacement to guttering, downpipes, and skylights' },
  tiling: { name: 'Tiling', singular: 'Tiler', emoji: '🔲', description: 'from bathroom and kitchen tiling to outdoor pavers and feature walls' },
  'pest-control': { name: 'Pest Control', singular: 'Pest Controller', emoji: '🐛', description: 'from termite inspections and treatment to rodent control and general pest management' },
  locksmith: { name: 'Locksmith', singular: 'Locksmith', emoji: '🔑', description: 'from lock installations and replacements to key cutting and security upgrades' },
  glazing: { name: 'Glazing', singular: 'Glazier', emoji: '🪟', description: 'from window and door glass replacement to shower screens and splashbacks' },
  plastering: { name: 'Plastering', singular: 'Plasterer', emoji: '🏗️', description: 'from patch repairs and resurfacing to full room plasterboard installation' },
  landscaping: { name: 'Landscaping', singular: 'Landscaper', emoji: '🌿', description: 'from garden design and lawn care to retaining walls and irrigation systems' },
  cleaning: { name: 'Cleaning', singular: 'Cleaner', emoji: '✨', description: 'from regular house cleaning and end-of-lease cleans to commercial and deep cleaning' },
  'appliance-repair': { name: 'Appliance Repair', singular: 'Appliance Technician', emoji: '🔌', description: 'from washing machines and dishwashers to ovens, fridges, and dryers' },
  'general-maintenance': { name: 'General Maintenance', singular: 'Handyman', emoji: '🛠️', description: 'from flat-pack assembly and shelf mounting to general repairs and property maintenance' },
};

function formatSuburb(slug: string): string {
  return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export async function generateMetadata({ params }: { params: Promise<{ trade: string; suburb: string }> }): Promise<Metadata> {
  const { trade, suburb } = await params;
  const tradeInfo = TRADE_MAP[trade];
  if (!tradeInfo) return {};
  const suburbName = formatSuburb(suburb);
  const title = `${tradeInfo.name} in ${suburbName} | Same-Day Service | Fixit 24/7`;
  const description = `Find trusted, verified ${tradeInfo.singular.toLowerCase()}s in ${suburbName}. Same-day bookings available. Licensed, insured professionals with upfront pricing. Book online in minutes.`;
  return {
    title,
    description,
    openGraph: { title, description, siteName: 'Fixit 24/7', locale: 'en_AU', type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `https://fixit247.com.au/trade/${trade}/${suburb}` },
    robots: { index: true, follow: true },
  };
}

const FAQS_BY_TRADE: Record<string, { q: string; a: string }[]> = {
  plumbing: [
    { q: 'How do I find a reliable plumber near me?', a: 'Fixit 24/7 connects you with verified, licensed plumbers in your area. All tradies are background-checked and carry public liability insurance.' },
    { q: 'How much does a plumber cost in Australia?', a: 'Plumbers in Australia typically charge $80–$200 per hour. Fixit 24/7 provides upfront fixed pricing before you confirm any booking.' },
    { q: 'Can I book a plumber for same-day service?', a: 'Yes. Fixit 24/7 has same-day availability for most plumbing jobs. Simply post your job and get matched within minutes.' },
    { q: 'What plumbing services are available?', a: 'Our network covers everything from blocked drains and leaking taps to hot water systems, bathroom renovations, and new installations.' },
  ],
  electrical: [
    { q: 'How do I find a licensed electrician near me?', a: 'All electricians on Fixit 24/7 hold valid Australian electrical licences and public liability insurance. Book online in minutes.' },
    { q: 'How much does an electrician cost?', a: 'Electricians in Australia typically charge $80–$150 per hour. You receive a fixed quote before any work begins on Fixit 24/7.' },
    { q: 'Can electricians do same-day work?', a: 'Yes. For non-emergency electrical work, Fixit 24/7 can often arrange same-day or next-day appointments with local electricians.' },
    { q: 'What electrical work can I book?', a: 'Power points, light fittings, ceiling fans, switchboard upgrades, safety switches, smoke alarms, and more.' },
  ],
  'general-maintenance': [
    { q: 'What can a handyman help with?', a: 'Our handymen handle a wide range of tasks including flat-pack assembly, shelf and picture mounting, minor repairs, painting touch-ups, and general property maintenance.' },
    { q: 'How much does a handyman cost?', a: 'Handymen typically charge $60–$120 per hour in Australia. Fixit 24/7 shows you upfront pricing before you commit.' },
    { q: 'How quickly can a handyman come?', a: 'Same-day and next-day bookings are often available. Post your job and get matched with a local handyman in minutes.' },
    { q: 'Do handymen need to be licensed?', a: 'For general maintenance tasks, licensing requirements vary. Fixit 24/7 ensures all tradies meet relevant Australian state requirements.' },
  ],
};

const DEFAULT_FAQS = [
  { q: 'How do I find a trusted tradie near me?', a: 'Fixit 24/7 verifies every tradie — checking licences, insurance, and conducting background checks before they join the platform.' },
  { q: 'How does same-day booking work?', a: 'Post your job on Fixit 24/7, and available local tradies will respond. Many jobs can be booked same-day or next-day.' },
  { q: 'How does pricing work?', a: 'You receive upfront pricing before confirming any job. No hidden fees — payment is held securely and released only when you are satisfied.' },
  { q: 'What if I am not happy with the work?', a: 'Fixit 24/7 offers a satisfaction guarantee. Payment is held in escrow until you confirm the job is complete to your standard.' },
];

const BENEFITS = [
  { icon: '✅', title: 'Verified & Licensed', desc: 'Every tradie holds valid Australian licences and public liability insurance.' },
  { icon: '💰', title: 'Upfront Pricing', desc: 'See fixed prices before you commit — no surprise call-out fees.' },
  { icon: '⭐', title: 'Rated & Reviewed', desc: 'Real reviews from real customers help you choose with confidence.' },
  { icon: '🔒', title: 'Secure Payments', desc: 'Payment held in escrow and released only when the job is done.' },
  { icon: '📍', title: 'Local Experts', desc: 'Tradies based in your suburb who know your area.' },
  { icon: '📱', title: 'Track in Real-Time', desc: 'Know exactly when your tradie will arrive with live tracking.' },
];

export default async function TradeLandingPage({ params }: { params: Promise<{ trade: string; suburb: string }> }) {
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
    name: `${tradeInfo.name} in ${suburbName}`,
    description: `Professional ${tradeInfo.name.toLowerCase()} services in ${suburbName}. Same-day bookings available.`,
    areaServed: suburbName,
    availableChannel: { '@type': 'ServiceChannel', serviceUrl: 'https://fixit247.com.au' },
    provider: { '@type': 'Organization', name: 'Fixit 24/7', url: 'https://fixit247.com.au' },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://fixit247.com.au' },
      { '@type': 'ListItem', position: 2, name: 'Find a Tradie', item: 'https://fixit247.com.au/find-a-tradie' },
      { '@type': 'ListItem', position: 3, name: tradeInfo.name, item: `https://fixit247.com.au/trade/${trade}` },
      { '@type': 'ListItem', position: 4, name: suburbName, item: `https://fixit247.com.au/trade/${trade}/${suburb}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="min-h-screen bg-white">
        {/* Hero — professional blue/white */}
        <section className="bg-brand-700 py-16 text-white">
          <div className="mx-auto max-w-5xl px-4">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-1 text-sm text-brand-200">
              <Link href="/" className="hover:text-white">Home</Link>
              <ChevronRight size={14} />
              <Link href="/find-a-tradie" className="hover:text-white">Find a Tradie</Link>
              <ChevronRight size={14} />
              <Link href={`/trade/${trade}`} className="hover:text-white">{tradeInfo.name}</Link>
              <ChevronRight size={14} />
              <span className="text-white">{suburbName}</span>
            </nav>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-5xl">{tradeInfo.emoji}</span>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={14} className="text-brand-300" />
                  <span className="text-sm font-bold uppercase tracking-widest text-brand-200">Verified Professionals</span>
                </div>
                <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
                  {tradeInfo.singular}s in {suburbName}
                </h1>
              </div>
            </div>

            <p className="mt-4 max-w-2xl text-lg text-brand-100">
              Trusted, local {tradeInfo.singular.toLowerCase()}s available for same-day bookings —{' '}
              {tradeInfo.description}. Licensed and insured professionals only.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/post-job"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-lg font-bold text-brand-700 shadow-lg hover:bg-brand-50 transition-colors"
              >
                <Calendar size={20} />
                Book a Tradie
              </Link>
              <Link
                href={`/emergency/${trade}/${suburb}`}
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-white px-8 py-4 text-lg font-bold text-white hover:bg-brand-600 transition-colors"
              >
                Need it urgent?
              </Link>
            </div>

            {/* Trust signals */}
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-brand-100">
              <span className="flex items-center gap-1.5"><Clock size={14} /> Same-day available</span>
              <span className="flex items-center gap-1.5"><Shield size={14} /> Licensed &amp; insured</span>
              <span className="flex items-center gap-1.5"><Star size={14} /> 4.9★ average rating</span>
              <span className="flex items-center gap-1.5"><MapPin size={14} /> Local to {suburbName}</span>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Why Book Through Fixit 24/7?
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {BENEFITS.map((b) => (
                <div key={b.title} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                  <div className="mb-2 text-2xl">{b.icon}</div>
                  <h3 className="mb-1 font-semibold text-gray-900">{b.title}</h3>
                  <p className="text-sm text-gray-500">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 bg-gray-50">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              How to Book a {tradeInfo.singular} in {suburbName}
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { step: '1', title: 'Describe Your Job', desc: `Tell us what you need. Our platform matches you with the best available ${tradeInfo.singular.toLowerCase()} in ${suburbName}.`, icon: '📋' },
                { step: '2', title: 'Get Matched', desc: 'Verified local tradies respond with upfront quotes. Compare profiles, ratings, and prices.', icon: '🤝' },
                { step: '3', title: 'Job Done', desc: 'Your tradie arrives on time and completes the work. Payment is released only when you\'re satisfied.', icon: '✅' },
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {tradeInfo.singular}s in {suburbName}
              </h2>
              <p className="text-gray-500 mb-8">Verified professionals ready to take your job</p>
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
              Frequently Asked Questions — {tradeInfo.name} in {suburbName}
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
        <section className="bg-brand-900 py-16 text-white">
          <div className="mx-auto max-w-2xl px-4 text-center">
            <h2 className="text-3xl font-extrabold mb-4">
              Ready to Book a {tradeInfo.singular} in {suburbName}?
            </h2>
            <p className="mb-8 text-brand-200">
              Get matched with a verified local {tradeInfo.singular.toLowerCase()} today. Upfront pricing, no surprises.
            </p>
            <Link
              href="/post-job"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-10 py-5 text-lg font-bold text-brand-700 shadow-lg hover:bg-brand-50 transition-colors"
            >
              <Calendar size={20} />
              Book a Tradie — Free to Post
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
