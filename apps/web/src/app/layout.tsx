import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Toaster } from 'sonner';
import { Providers } from './providers';
import { AnalyticsScripts } from '@/components/analytics/analytics-scripts';
import '@fixit247/ui/src/styles/globals.css';

export const metadata: Metadata = {
  title: { default: 'Fixit247 | Emergency Trades Australia', template: '%s | Fixit247' },
  description: 'Australia\'s trusted platform for emergency trade services — plumbing, electrical, HVAC and more. Available 24/7.',
  keywords: ['emergency trades', 'plumber', 'electrician', 'HVAC', 'Australia', '24/7'],
  authors: [{ name: 'Fixit247' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://fixit247.com.au'),
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
    { media: '(prefers-color-scheme: light)', color: '#faf8f4' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0a09' },
  ],
};

/* Inline script that runs before paint to avoid flash of wrong theme */
const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('fixit-theme');
    var theme = stored === 'light' ? 'light' : stored === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : 'dark';
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch(e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" suppressHydrationWarning className="dark">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster richColors position="top-right" closeButton />
        </Providers>
        <AnalyticsScripts />
      </body>
    </html>
  );
}
