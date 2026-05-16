import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fixit247.com.au';
const SITE_NAME = 'Fixit 24/7';

interface SuburbTradeMetaInput {
  trade: string;        // e.g. "PLUMBING"
  suburb: string;       // e.g. "Parramatta"
  state: string;        // e.g. "NSW"
  isEmergency: boolean;
}

// Format trade category for display: PLUMBING -> Plumber, ELECTRICAL -> Electrician, etc.
export function formatTrade(trade: string): string {
  const MAP: Record<string, string> = {
    PLUMBING: 'Plumber', ELECTRICAL: 'Electrician', HVAC: 'HVAC Technician',
    CARPENTRY: 'Carpenter', PAINTING: 'Painter', ROOFING: 'Roofer',
    TILING: 'Tiler', PEST_CONTROL: 'Pest Controller', LOCKSMITH: 'Locksmith',
    GLAZING: 'Glazier', PLASTERING: 'Plasterer', LANDSCAPING: 'Landscaper',
    CLEANING: 'Cleaner', APPLIANCE_REPAIR: 'Appliance Technician',
    GENERAL_MAINTENANCE: 'Handyman', OTHER: 'Tradie',
  };
  return MAP[trade] ?? trade.replace(/_/g, ' ');
}

export function generateSuburbTradeMeta({ trade, suburb, state, isEmergency }: SuburbTradeMetaInput): Metadata {
  const tradeName = formatTrade(trade);
  const prefix = isEmergency ? 'Emergency ' : '';
  const title = `${prefix}${tradeName} ${suburb} ${state} | 24/7 Same-Day Service | ${SITE_NAME}`;
  const description = isEmergency
    ? `Need an emergency ${tradeName.toLowerCase()} in ${suburb}? Fixit 24/7 dispatches verified local tradies in under 60 minutes. Available now.`
    : `Find a trusted ${tradeName.toLowerCase()} in ${suburb}, ${state}. Same-day bookings, verified professionals, upfront pricing. Book instantly on Fixit 24/7.`;

  const slug = isEmergency
    ? `/emergency/${trade.toLowerCase()}/${suburb.toLowerCase().replace(/\s+/g, '-')}`
    : `/trade/${trade.toLowerCase()}/${suburb.toLowerCase().replace(/\s+/g, '-')}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${slug}`,
      siteName: SITE_NAME,
      locale: 'en_AU',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `${SITE_URL}${slug}` },
    robots: { index: true, follow: true },
  };
}

export function generateTradieProfileMeta(tradie: { firstName: string; lastName: string; trade: string; suburb: string; avgRating?: number }): Metadata {
  const tradeName = formatTrade(tradie.trade);
  const name = `${tradie.firstName} ${tradie.lastName}`;
  const rating = tradie.avgRating ? ` · ${tradie.avgRating.toFixed(1)}★` : '';
  const title = `${name} — Verified ${tradeName} in ${tradie.suburb}${rating} | ${SITE_NAME}`;
  const description = `Book ${name}, a verified ${tradeName.toLowerCase()} in ${tradie.suburb}. Fast response, upfront pricing, background checked. Available on Fixit 24/7.`;
  return {
    title, description,
    openGraph: { title, description, siteName: SITE_NAME, locale: 'en_AU', type: 'profile' },
    twitter: { card: 'summary', title, description },
  };
}
