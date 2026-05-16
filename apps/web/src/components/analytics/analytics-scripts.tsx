'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    ttq?: any;
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;

export function AnalyticsScripts() {
  const pathname = usePathname();

  // Track page views on route change
  useEffect(() => {
    if (GA_ID && window.gtag) {
      window.gtag('config', GA_ID, { page_path: pathname });
    }
    if (META_PIXEL_ID && window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [pathname]);

  return (
    <>
      {/* Google Analytics 4 */}
      {GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', { page_path: window.location.pathname });
          `}</Script>
        </>
      )}

      {/* Meta Pixel */}
      {META_PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
          document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}</Script>
      )}

      {/* TikTok Pixel */}
      {TIKTOK_PIXEL_ID && (
        <Script id="tiktok-pixel" strategy="afterInteractive">{`
          !function (w, d, t) {
            w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._s=ttq._s||{},ttq.load.eq=ttq.load.eq||[],ttq.load.eq.push({e:e,n:n});var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
            ttq.load('${TIKTOK_PIXEL_ID}');
            ttq.page();
          }(window, document, 'ttq');
        `}</Script>
      )}
    </>
  );
}

// Helper functions for tracking conversion events
export function trackJobPosted(jobId: string, category: string, isEmergency: boolean) {
  if (window.gtag) window.gtag('event', 'job_posted', { job_id: jobId, category, is_emergency: isEmergency });
  if (window.fbq) window.fbq('track', 'Lead', { content_name: category, content_category: isEmergency ? 'emergency' : 'standard' });
}

export function trackSignup(role: string) {
  if (window.gtag) window.gtag('event', 'sign_up', { method: role });
  if (window.fbq) window.fbq('track', 'CompleteRegistration', { content_name: role });
}

export function trackEmergencyCTA(suburb?: string) {
  if (window.gtag) window.gtag('event', 'emergency_cta_click', { suburb });
  if (window.fbq) window.fbq('track', 'InitiateCheckout');
}
