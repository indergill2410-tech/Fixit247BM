import type { Metadata } from 'next';
import Link from 'next/link';
import { requireOnboarding } from '@/lib/auth/session';
import { DashboardShell, PageHeader } from '@/components/shared/dashboard-shell';
import { Download, CheckCircle, Clock } from 'lucide-react';

export const metadata: Metadata = { title: 'Invoices' };

const MOCK_INVOICES = [
  { id: 'INV-0014', date: '12 May 2025', tradie: 'Chris Nguyen', trade: 'Plumbing', description: 'Hot water system repair', amount: '$340.00', status: 'paid' },
  { id: 'INV-0013', date: '28 Apr 2025', tradie: 'James Sullivan', trade: 'Electrical', description: 'Switchboard inspection & repair', amount: '$520.00', status: 'paid' },
  { id: 'INV-0012', date: '10 Apr 2025', tradie: 'Tony Morales', trade: 'Locksmith', description: 'Deadlock installation × 2', amount: '$280.00', status: 'paid' },
  { id: 'INV-0011', date: '3 Mar 2025', tradie: 'Marcus Bell', trade: 'HVAC', description: 'AC service & regas', amount: '$180.00', status: 'paid' },
];

const STATUS_STYLE: Record<string, string> = {
  paid: 'bg-green-500/15 text-green-400',
  pending: 'bg-brand-500/15 text-brand-400',
  disputed: 'bg-red-500/15 text-red-400',
};

export default async function InvoicesPage() {
  await requireOnboarding();

  const totalSpent = MOCK_INVOICES.reduce((acc, inv) => {
    const num = parseFloat(inv.amount.replace('$', '').replace(',', ''));
    return acc + num;
  }, 0);

  return (
    <DashboardShell role="CUSTOMER">
      <PageHeader
        title="Invoices"
        description="All your completed job invoices in one place"
      />

      {/* Summary */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-white/8 bg-white/4 p-4 text-center">
          <p className="text-2xl font-extrabold text-white">${totalSpent.toLocaleString()}</p>
          <p className="mt-1 text-xs text-gray-500">Total spent (AUD)</p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/4 p-4 text-center">
          <p className="text-2xl font-extrabold text-white">{MOCK_INVOICES.length}</p>
          <p className="mt-1 text-xs text-gray-500">Invoices</p>
        </div>
        <div className="rounded-2xl border border-green-500/20 bg-green-500/8 p-4 text-center">
          <p className="text-2xl font-extrabold text-green-400">{MOCK_INVOICES.filter((i) => i.status === 'paid').length}</p>
          <p className="mt-1 text-xs text-gray-500">Paid</p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/4 p-4 text-center">
          <p className="text-2xl font-extrabold text-white">{MOCK_INVOICES.filter((i) => i.status === 'pending').length}</p>
          <p className="mt-1 text-xs text-gray-500">Pending</p>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-white/8 bg-white/4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-white/8">
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Invoice</th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Date</th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Tradie</th>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Description</th>
                <th className="p-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Amount</th>
                <th className="p-4 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                <th className="p-4 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">PDF</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_INVOICES.map((inv, idx) => (
                <tr key={inv.id} className={idx % 2 === 0 ? 'bg-transparent' : 'bg-white/2'}>
                  <td className="p-4 font-mono text-xs text-gray-400">{inv.id}</td>
                  <td className="p-4 text-gray-400">{inv.date}</td>
                  <td className="p-4">
                    <p className="font-medium text-white">{inv.tradie}</p>
                    <p className="text-xs text-gray-500">{inv.trade}</p>
                  </td>
                  <td className="p-4 text-gray-400">{inv.description}</td>
                  <td className="p-4 text-right font-semibold text-white">{inv.amount}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${STATUS_STYLE[inv.status]}`}>
                      {inv.status === 'paid' ? <CheckCircle size={10} /> : <Clock size={10} />}
                      {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      className="rounded-lg border border-white/10 p-1.5 text-gray-500 hover:border-brand-400/40 hover:text-brand-400 transition-colors"
                      title="Download PDF"
                    >
                      <Download size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {MOCK_INVOICES.length === 0 && (
        <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-white/8 bg-white/4 py-16 text-center">
          <p className="text-4xl mb-3">💳</p>
          <p className="font-semibold text-white">No invoices yet</p>
          <p className="mt-2 text-sm text-gray-500">Your invoices will appear here after jobs are completed.</p>
          <Link href="/jobs/new" className="mt-6 rounded-xl bg-brand-400 px-6 py-2.5 text-sm font-bold text-gray-900 hover:bg-brand-300 transition-colors">
            Post your first job
          </Link>
        </div>
      )}
    </DashboardShell>
  );
}
