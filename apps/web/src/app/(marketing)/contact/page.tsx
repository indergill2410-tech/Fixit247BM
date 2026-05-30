import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Fixit 24/7 | Emergency Tradie Support',
  description: 'Contact Fixit 24/7 for emergency trade bookings, customer support, tradie onboarding, and platform enquiries.',
};

const CONTACT_OPTIONS = [
  {
    icon: <Phone size={20} />,
    title: 'Emergency dispatch',
    detail: '1800-FIXIT-247',
    href: 'tel:1800348498',
    note: 'Available 24 hours a day',
  },
  {
    icon: <Mail size={20} />,
    title: 'Customer support',
    detail: 'hello@fixit247.com.au',
    href: 'mailto:hello@fixit247.com.au',
    note: 'Jobs, accounts, and bookings',
  },
  {
    icon: <ShieldCheck size={20} />,
    title: 'Tradie verification',
    detail: 'docs@fixit247.com.au',
    href: 'mailto:docs@fixit247.com.au',
    note: 'Licences, insurance, and onboarding',
  },
];

export default function ContactPage() {
  return (
    <div className="bg-[#0a0a0a] text-white">
      <section className="px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-400">Contact</p>
            <h1 className="text-5xl font-extrabold tracking-tight">Need help from Fixit 24/7?</h1>
            <p className="mt-5 text-lg leading-relaxed text-gray-400">
              For urgent repairs, call dispatch now. For account, booking, or tradie support, email the team and we will route your request to the right place.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {CONTACT_OPTIONS.map((option) => (
              <a
                key={option.title}
                href={option.href}
                className="rounded-2xl border border-white/8 bg-white/4 p-6 transition-colors hover:border-brand-400/40 hover:bg-white/6"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15 text-brand-400">
                  {option.icon}
                </div>
                <h2 className="text-lg font-bold">{option.title}</h2>
                <p className="mt-2 font-semibold text-brand-300">{option.detail}</p>
                <p className="mt-2 text-sm text-gray-500">{option.note}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/8 bg-[#0f0f0f] px-4 py-16">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          <div className="flex gap-4">
            <Clock className="mt-1 h-5 w-5 shrink-0 text-brand-400" />
            <div>
              <h2 className="font-bold">Response times</h2>
              <p className="mt-1 text-sm text-gray-500">Emergency calls are routed immediately. Email support is triaged by priority.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <MapPin className="mt-1 h-5 w-5 shrink-0 text-brand-400" />
            <div>
              <h2 className="font-bold">Service area</h2>
              <p className="mt-1 text-sm text-gray-500">Launching across Australian metro areas with verified local tradies.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-brand-400" />
            <div>
              <h2 className="font-bold">Safety first</h2>
              <p className="mt-1 text-sm text-gray-500">If anyone is in immediate danger, call 000 before contacting Fixit 24/7.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 text-center">
        <h2 className="text-3xl font-extrabold">Ready to book a tradie?</h2>
        <p className="mx-auto mt-3 max-w-xl text-gray-500">Post a job for scheduled work, or use emergency dispatch for urgent repairs.</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/jobs/new" className="rounded-xl bg-brand-400 px-7 py-3.5 text-sm font-bold text-gray-900 transition-colors hover:bg-brand-300">
            Post a job
          </Link>
          <Link href="/emergency" className="rounded-xl border border-red-500/30 bg-red-500/10 px-7 py-3.5 text-sm font-bold text-red-300 transition-colors hover:bg-red-500/15">
            Emergency dispatch
          </Link>
        </div>
      </section>
    </div>
  );
}
