import type { NextConfig } from 'next';

const isProd = process.env['NODE_ENV'] === 'production';

// Content Security Policy — tightened per environment
const csp = [
  "default-src 'self'",
  // Next.js inline scripts + Stripe.js
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://maps.googleapis.com",
  // Tailwind/Geist inline styles
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  // Images: supabase storage + github avatars + google user content
  "img-src 'self' data: blob: https://*.supabase.co https://avatars.githubusercontent.com https://*.googleusercontent.com https://maps.gstatic.com https://maps.googleapis.com",
  // API calls: supabase, stripe, google maps, socket.io
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://maps.googleapis.com https://*.upstash.io https://*.sentry.io" +
    (isProd ? '' : ' ws://localhost:* http://localhost:*'),
  // Stripe hosted iframes for payment elements
  "frame-src https://js.stripe.com https://hooks.stripe.com https://www.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  ...(isProd ? ["upgrade-insecure-requests"] : []),
]
  .join('; ');

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  transpilePackages: [
    '@fixit247/ui',
    '@fixit247/auth',
    '@fixit247/database',
    '@fixit247/payments',
    '@fixit247/ai',
    '@fixit247/voice',      // ← was missing: used in /api/voice/twilio/* routes
    '@fixit247/matching',
    '@fixit247/realtime',
    '@fixit247/notifications',
    '@fixit247/fraud',
    '@fixit247/seo',
    '@fixit247/trust',
    '@fixit247/referral',
    '@fixit247/growth',
  ],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
    serverActions: {
      allowedOrigins: ['fixit247bm.onrender.com', '*.onrender.com'],
    },
  },
  async redirects() {
    return [
      { source: '/find-a-tradie', destination: '/emergency', permanent: true },
      { source: '/find-a-tradie/:path*', destination: '/emergency/:path*', permanent: true },
      { source: '/auth/login', destination: '/login', permanent: true },
      { source: '/auth/register', destination: '/register', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
          ...(isProd
            ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }]
            : []),
        ],
      },
      // Cache static assets aggressively
      {
        source: '/_next/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      // No caching for API responses
      {
        source: '/api/(.*)',
        headers: [{ key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' }],
      },
    ];
  },
};

export default nextConfig;
