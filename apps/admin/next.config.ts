import type { NextConfig } from 'next';
import path from 'node:path';

const monorepoRoot = path.join(process.cwd(), '../..');
const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const standaloneOutput = process.platform === 'win32' ? {} : { output: 'standalone' as const };

const nextConfig: NextConfig = {
  ...standaloneOutput,
  outputFileTracingRoot: monorepoRoot,
  eslint: { ignoreDuringBuilds: false },
  transpilePackages: ['@fixit247/ui', '@fixit247/auth', '@fixit247/database'],
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '*.supabase.co' }],
  },
  async rewrites() {
    return [
      {
        source: '/api/admin/:path*',
        destination: `${appUrl}/api/admin/:path*`,
      },
    ];
  },
};

export default nextConfig;
