import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import { Providers } from './providers';
import { AnalyticsScripts } from '@/components/analytics/analytics-scripts';
import '@fixit247/ui/src/styles/globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: 'Fixit247 | Emergency Trades Australia', template: '%s | Fixit247' },
  description: 'Australia\'s trusted platform for emergency trade services — plumbing, electrical, HVAC and more. Available 24/7.',
  keywords: ['emergency trades', 'plumber', 'electrician', 'HVAC', 'Australia', '24/7'],
  authors: [{ name: 'Fixit247' }],
  metadataBase: new URL(process.env['NEXT_PUBLIC_APP_URL'] ?? 'https://fixit247.com.au'),
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    siteName: 'Fixit247',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster richColors position="top-right" closeButton />
        </Providers>
        <AnalyticsScripts />
      </body>
    </html>
  );
}
