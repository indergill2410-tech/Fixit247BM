import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Fixit 24/7',
  description: 'How Fixit 24/7 collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="bg-background text-foreground transition-colors duration-300">
      <div className="mx-auto max-w-3xl px-4 py-20">
        <h1 className="text-4xl font-extrabold mb-2">Privacy Policy</h1>
        <p className="text-foreground-subtle mb-10">Last updated: May 2026</p>

        <div className="space-y-10 text-foreground-muted leading-relaxed">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="text-xl font-bold text-foreground mb-3">{s.title}</h2>
              <p>{s.content}</p>
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-background-elevated p-6 text-sm text-foreground-subtle">
          Questions? Email <a href="mailto:privacy@fixit247.com.au" className="text-brand-500 hover:underline">privacy@fixit247.com.au</a>
        </div>
      </div>
    </div>
  );
}

const SECTIONS = [
  {
    title: '1. Information We Collect',
    content: 'We collect information you provide when registering (name, email, phone, address), information tradies provide for verification (licence numbers, insurance certificates, ABN), job details you post, payment information processed through our secure payment provider, and usage data collected automatically through cookies and analytics.',
  },
  {
    title: '2. How We Use Your Information',
    content: 'We use your information to match customers with appropriate tradies, process payments and escrow, verify tradie credentials, send notifications about your jobs, improve our platform and AI matching, comply with Australian legal obligations, and prevent fraud.',
  },
  {
    title: '3. Sharing Your Information',
    content: 'We share your information with tradies you are matched with (limited contact details), payment processors (Stripe) for transaction processing, identity verification services for tradie onboarding, and government authorities when required by law. We do not sell your personal information.',
  },
  {
    title: '4. Data Security',
    content: 'We implement industry-standard security measures including TLS encryption, secure data storage, and regular security audits. Payments are processed by Stripe and we do not store card details.',
  },
  {
    title: '5. Your Rights',
    content: 'Under the Australian Privacy Act 1988, you have the right to access your personal information, correct inaccurate data, request deletion of your account and associated data, and opt out of marketing communications. Contact us at privacy@fixit247.com.au to exercise these rights.',
  },
  {
    title: '6. Cookies',
    content: 'We use cookies for authentication, analytics (Google Analytics), and improving user experience. You can disable cookies in your browser settings, though this may affect platform functionality.',
  },
  {
    title: '7. Contact',
    content: 'Fixit247 Pty Ltd, ABN 12 345 678 901. For privacy enquiries: privacy@fixit247.com.au or 1800-FIXIT-247.',
  },
];
