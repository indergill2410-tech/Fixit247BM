import { db } from '@fixit247/database';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fixit247.com.au';

export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export async function getSEOPageSitemapEntries(): Promise<SitemapEntry[]> {
  const pages = await db.sEOPage.findMany({
    where: { indexable: true, publishedAt: { not: null } },
    select: { slug: true, updatedAt: true, pageType: true },
  });
  return pages.map((p) => ({
    url: `${SITE_URL}/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: p.pageType === 'BLOG_ARTICLE' ? 'weekly' : 'monthly',
    priority: p.pageType === 'EMERGENCY_SERVICE' ? 0.9 : 0.7,
  }));
}

export async function getTradieProfileSitemapEntries(): Promise<SitemapEntry[]> {
  const tradies = await db.tradieProfile.findMany({
    where: { verificationStatus: 'VERIFIED' },
    select: { id: true, updatedAt: true },
  });
  return tradies.map((t) => ({
    url: `${SITE_URL}/tradie/${t.id}`,
    lastModified: t.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));
}

export const STATIC_SITEMAP_ENTRIES: SitemapEntry[] = [
  { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
  { url: `${SITE_URL}/emergency`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.95 },
  { url: `${SITE_URL}/find-a-tradie`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  { url: `${SITE_URL}/join-as-tradie`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
  { url: `${SITE_URL}/how-it-works`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  { url: `${SITE_URL}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
];
