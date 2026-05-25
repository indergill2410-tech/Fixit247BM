import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Fixit 24/7',
  description: 'Terms and conditions for using the Fixit 24/7 platform.',
};

export default function TermsPage() {
  return (
    <div className="bg-background text-foreground transition-colors duration-300">
      <div className="mx-auto max-w-3xl px-4 py-20">
        <h1 className="text-4xl font-extrabold mb-2">Terms of Service</h1>
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
          Questions? Email <a href="mailto:legal@fixit247.com.au" className="text-brand-500 hover:underline">legal@fixit247.com.au</a>
        </div>
      </div>
    </div>
  );
}

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    content: 'By accessing or using the Fixit247 platform, you agree to be bound by these Terms of Service. If you do not agree, do not use our platform. These terms apply to all users including customers and tradies.',
  },
  {
    title: '2. Platform Description',
    content: 'Fixit247 is a marketplace platform connecting customers seeking trade services with independent tradies. Fixit247 does not employ tradies and is not responsible for the quality of work performed. All trade services are provided by independent contractors.',
  },
  {
    title: '3. Customer Obligations',
    content: 'Customers must provide accurate job descriptions, be available to provide access to the property, pay agreed amounts promptly through our escrow system, and treat tradies professionally and respectfully.',
  },
  {
    title: '4. Tradie Obligations',
    content: 'Tradies must hold valid trade licences and insurance as required by their state, complete jobs to a professional standard, communicate promptly with customers, and comply with all applicable Australian laws and safety standards.',
  },
  {
    title: '5. Payments and Escrow',
    content: 'All payments are processed through our secure escrow system. Customer funds are held until job completion is confirmed. Fixit247 charges tradies on a credit-based system. Refunds are subject to our dispute resolution process.',
  },
  {
    title: '6. Dispute Resolution',
    content: 'In the event of a dispute, both parties should first attempt resolution through the in-app messaging system. Fixit247\'s support team may mediate. For unresolved disputes, Australian consumer law applies. Fixit247\'s liability is limited to the transaction amount.',
  },
  {
    title: '7. Prohibited Conduct',
    content: 'Users must not: circumvent the platform to pay tradies directly, post fraudulent jobs, provide false reviews, harass other users, or violate any applicable law. Violations may result in account suspension.',
  },
  {
    title: '8. Limitation of Liability',
    content: 'Fixit247\'s liability is limited to the maximum extent permitted by Australian law. We are not liable for indirect, incidental, or consequential damages arising from use of the platform or services provided by tradies.',
  },
  {
    title: '9. Governing Law',
    content: 'These terms are governed by the laws of New South Wales, Australia. Disputes will be subject to the jurisdiction of NSW courts.',
  },
];
