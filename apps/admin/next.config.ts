import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  output: 'standalone',
  // Trace from workspace root so @fixit247/database (Prisma engine) is bundled.
  outputFileTracingRoot: path.resolve(__dirname, '../../'),
  transpilePackages: ['@fixit247/ui', '@fixit247/auth', '@fixit247/database'],
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '*.supabase.co' }],
  },
};

export default nextConfig;
