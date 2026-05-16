import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@fixit247/database';
import { ChevronLeft, Star, Shield, Clock, MapPin, CheckCircle, Zap } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const tradie = await db.tradieProfile.findUnique({
    where: { id },
    include: { user: { select: { firstName: true, lastName: true } } },
  });
  if (!tradie) return {};

  const name = `${tradie.user.firstName} ${tradie.user.lastName}`;
  const trade = tradie.tradeCategories[0]?.replace(/_/g, ' ') ?? 'Tradie';
  const suburb = tradie.suburb ?? 'Australia';
  const rating = tradie.avgRating ? `${Number(tradie.avgRating).toFixed(1)}★ ` : '';

  const title = `${name} — ${rating}Verified ${trade} in ${suburb} | Fixit 24/7`;
  const description = `Book ${name}, a verified and licensed ${trade.toLowerCase()} in ${suburb}. ${rating ? `Rated ${rating}by customers. ` : ''}Fast response, upfront pricing, background checked.`;

  return {
    title,
    description,
    openGraph: { title, description, siteName: 'Fixit 24/7', locale: 'en_AU', type: 'profile' },
    twitter: { card: 'summary', title, description },
    alternates: { canonical: `https://fixit247.com.au/tradie/${id}` },
    robots: { index: tradie.verificationStatus === 'VERIFIED', follow: true },
  };
}

const TRADE_MAP: Record<string, string> = {
  PLUMBING: 'Plumber', ELECTRICAL: 'Electrician', HVAC: 'HVAC Technician',
  CARPENTRY: 'Carpenter', PAINTING: 'Painter', ROOFING: 'Roofer',
  TILING: 'Tiler', PEST_CONTROL: 'Pest Controller', LOCKSMITH: 'Locksmith',
  GLAZING: 'Glazier', PLASTERING: 'Plasterer', LANDSCAPING: 'Landscaper',
  CLEANING: 'Cleaner', APPLIANCE_REPAIR: 'Appliance Technician',
  GENERAL_MAINTENANCE: 'Handyman',
};

export default async function TradieProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const tradie = await db.tradieProfile.findUnique({
    where: { id },
    include: {
      user: { select: { firstName: true, lastName: true, avatarUrl: true, createdAt: true } },
      reviews: {
        include: { reviewer: { select: { firstName: true, avatarUrl: true } } },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  }).catch(() => null);

  if (!tradie) notFound();

  const fullName = `${tradie.user.firstName} ${tradie.user.lastName}`;
  const trades = tradie.tradeCategories.map((t) => TRADE_MAP[t] ?? t.replace(/_/g, ' '));
  const primaryTrade = trades[0] ?? 'Tradie';
  const suburb = tradie.suburb ?? 'Australia';
  const rating = tradie.avgRating ? Number(tradie.avgRating) : null;
  const isVerified = tradie.verificationStatus === 'VERIFIED';

  // JSON-LD Person schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: fullName,
    jobTitle: primaryTrade,
    worksFor: { '@type': 'Organization', name: 'Fixit 24/7', url: 'https://fixit247.com.au' },
    address: { '@type': 'PostalAddress', addressLocality: suburb, addressCountry: 'AU' },
    ...(rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating.toFixed(1),
        reviewCount: tradie.totalReviews ?? 1,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen bg-gray-50">
        {/* Back link */}
        <div className="mx-auto max-w-4xl px-4 pt-6">
          <Link href="/find-a-tradie" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
            <ChevronLeft size={14} /> Find a Tradie
          </Link>
        </div>

        {/* Profile header */}
        <div className="bg-white border-b">
          <div className="mx-auto max-w-4xl px-4 py-8">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-3xl font-bold text-brand-700">
                {tradie.user.avatarUrl
                  ? <img src={tradie.user.avatarUrl} alt={fullName} className="h-24 w-24 rounded-2xl object-cover" />
                  : fullName.charAt(0)
                }
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-extrabold text-gray-900">{fullName}</h1>
                    <p className="text-gray-500">{trades.join(' · ')}</p>
                    <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                      <MapPin size={13} />
                      <span>{suburb}</span>
                    </div>
                  </div>
                  {isVerified && (
                    <div className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                      <Shield size={14} />
                      Verified
                    </div>
                  )}
                </div>

                {/* Rating */}
                {rating && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} size={16} className={s <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{rating.toFixed(1)}</span>
                    <span className="text-sm text-gray-400">({tradie.totalReviews ?? 0} reviews)</span>
                  </div>
                )}

                {/* Trust badges */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {isVerified && <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"><CheckCircle size={11} />Licensed</span>}
                  {tradie.isInsured && <span className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700"><Shield size={11} />Insured</span>}
                  {tradie.responseTimeMinutes && <span className="flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700"><Clock size={11} />{tradie.responseTimeMinutes}min avg response</span>}
                  <span className="flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700"><CheckCircle size={11} />Background Checked</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-6 flex gap-3">
              <Link
                href={`/post-job?tradie=${id}`}
                className="flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 font-bold text-white hover:bg-brand-700 transition-colors"
              >
                <Zap size={16} />
                Book {tradie.user.firstName}
              </Link>
              <Link
                href="/emergency"
                className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-6 py-3 font-semibold text-red-700 hover:bg-red-100 transition-colors"
              >
                Emergency Job
              </Link>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="mx-auto max-w-4xl px-4 py-8 grid gap-6 lg:grid-cols-3">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            {tradie.bio && (
              <div className="rounded-2xl bg-white p-6">
                <h2 className="mb-3 font-semibold text-gray-900">About {tradie.user.firstName}</h2>
                <p className="text-sm text-gray-700 leading-relaxed">{tradie.bio}</p>
              </div>
            )}

            {/* Reviews */}
            {tradie.reviews.length > 0 && (
              <div className="rounded-2xl bg-white p-6">
                <h2 className="mb-4 font-semibold text-gray-900">Customer Reviews</h2>
                <div className="space-y-4">
                  {tradie.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-xs font-bold">
                          {review.reviewer.firstName.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{review.reviewer.firstName}</span>
                        <div className="flex items-center gap-0.5 ml-auto">
                          {[1,2,3,4,5].map((s) => (
                            <Star key={s} size={12} className={s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />
                          ))}
                        </div>
                      </div>
                      {review.comment && <p className="text-sm text-gray-600">{review.comment}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            <div className="rounded-2xl bg-white p-5">
              <h3 className="mb-3 font-semibold text-gray-900">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {trades.map((t) => (
                  <span key={t} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">{t}</span>
                ))}
              </div>
            </div>

            {tradie.servicedSuburbs && tradie.servicedSuburbs.length > 0 && (
              <div className="rounded-2xl bg-white p-5">
                <h3 className="mb-3 font-semibold text-gray-900">Service Areas</h3>
                <div className="flex flex-wrap gap-1.5">
                  {tradie.servicedSuburbs.slice(0, 10).map((s) => (
                    <span key={s} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">{s}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl bg-gray-900 p-5 text-white text-center">
              <p className="mb-2 font-semibold">Need {tradie.user.firstName} urgently?</p>
              <p className="mb-4 text-xs text-gray-400">Post an emergency job and they&apos;ll be notified immediately</p>
              <Link href="/emergency" className="inline-block w-full rounded-xl bg-red-600 py-2.5 text-sm font-bold hover:bg-red-700 transition-colors">
                Emergency Dispatch
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
