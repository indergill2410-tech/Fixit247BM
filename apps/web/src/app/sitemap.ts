import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fixit247.com.au';

const TRADE_CATEGORIES = [
  'plumbing', 'electrical', 'hvac', 'carpentry', 'painting', 'roofing',
  'tiling', 'pest-control', 'locksmith', 'glazing', 'plastering', 'landscaping',
  'cleaning', 'appliance-repair', 'general-maintenance',
];

const MAJOR_SUBURBS = [
  { suburb: 'sydney-cbd', state: 'nsw' }, { suburb: 'melbourne-cbd', state: 'vic' },
  { suburb: 'brisbane-cbd', state: 'qld' }, { suburb: 'perth-cbd', state: 'wa' },
  { suburb: 'adelaide', state: 'sa' }, { suburb: 'parramatta', state: 'nsw' },
  { suburb: 'blacktown', state: 'nsw' }, { suburb: 'liverpool', state: 'nsw' },
  { suburb: 'penrith', state: 'nsw' }, { suburb: 'campbelltown', state: 'nsw' },
  { suburb: 'bondi', state: 'nsw' }, { suburb: 'manly', state: 'nsw' },
  { suburb: 'st-kilda', state: 'vic' }, { suburb: 'richmond', state: 'vic' },
  { suburb: 'fitzroy', state: 'vic' }, { suburb: 'southbank', state: 'vic' },
  { suburb: 'gold-coast', state: 'qld' }, { suburb: 'sunshine-coast', state: 'qld' },
  { suburb: 'fremantle', state: 'wa' }, { suburb: 'glenelg', state: 'sa' },
];

const BLOG_SLUGS = [
  'burst-pipe-emergency', 'electrical-safety', 'how-to-choose-a-tradie',
  'lockout-guide', 'hvac-maintenance', 'roof-leak-emergency',
  'tradie-pricing-guide', 'before-tradie-arrives',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/emergency`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.95 },
    { url: `${SITE_URL}/join-as-tradie`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${SITE_URL}/fixit-plus`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/how-it-works`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${SITE_URL}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.65 },
    { url: `${SITE_URL}/refer`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/voice`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  const blogPages: MetadataRoute.Sitemap = BLOG_SLUGS.map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Emergency pages: /emergency/[trade]/[suburb]
  const emergencyPages: MetadataRoute.Sitemap = TRADE_CATEGORIES.flatMap((trade) =>
    MAJOR_SUBURBS.map(({ suburb }) => ({
      url: `${SITE_URL}/emergency/${trade}/${suburb}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    }))
  );

  // Trade pages: /trade/[trade]/[suburb]
  const tradePages: MetadataRoute.Sitemap = TRADE_CATEGORIES.flatMap((trade) =>
    MAJOR_SUBURBS.map(({ suburb }) => ({
      url: `${SITE_URL}/trade/${trade}/${suburb}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  );

  // Suburb landing pages: /suburb/[state]/[suburb]
  const suburbPages: MetadataRoute.Sitemap = MAJOR_SUBURBS.map(({ suburb, state }) => ({
    url: `${SITE_URL}/suburb/${state}/${suburb}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }));

  return [...staticPages, ...blogPages, ...emergencyPages, ...tradePages, ...suburbPages];
}
