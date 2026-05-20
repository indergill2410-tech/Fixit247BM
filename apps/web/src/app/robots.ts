import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fixit247.com.au';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard',
          '/dashboard/',
          '/admin',
          '/admin/',
          '/tradie/dashboard',
          '/tradie/jobs',
          '/tradie/messages',
          '/tradie/earnings',
          '/tradie/wallet',
          '/tradie/profile',
          '/tradie/subscription',
          '/tradie/availability',
          '/tradie/documents',
          '/tradie/onboarding',
          '/jobs/',
          '/messages',
          '/profile',
          '/reviews',
          '/book',
          '/invoices',
          '/saved-tradies',
          '/onboarding',
          '/login',
          '/register',
          '/forgot-password',
          '/reset-password',
          '/verify-email',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
