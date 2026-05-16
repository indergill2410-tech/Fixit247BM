import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@fixit247/ui', '@fixit247/auth', '@fixit247/database'],
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '*.supabase.co' }],
  },
};

export default nextConfig;
