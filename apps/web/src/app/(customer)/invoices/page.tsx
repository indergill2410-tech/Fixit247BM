import type { Metadata } from 'next';
import Link from 'next/link';
import { requireOnboarding } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { DashboardShell, PageHeader } from '@/components/shared/dashboard-shell';
import { Download, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = { title: 'Invoices' };

const STATUS_STYLE: Record<string, string> = {
  RELEASED: 'bg-green-500/15 text-green-400',
  CAPTURED: 'bg-green-500/15 text-green-400',
  PENDING: 'bg-brand-500/15 text-brand-400',
  DISPUTED: 'bg-red-500/15 text-red-400',
  REFUNDED: 'bg-orange-500/15 text-orange-400',
};

function statusLabel(status: string) {
  switch (status) {
    case 'RELEASED': return 'Paid';
    case 'CAPTURED': return 'Paid';
    case 'PENDING': return 'Pending';
    case 'DISPUTED': return 'Disputed';
    case 'REFUNDED': return 'Refunded';
    default: return status;
  }
}

function StatusIcon({ status }: { status: string }) {
  if (status === 'RELEASED' || status === 'CAPTURED') return <CheckCircle size={10} />;
  if (status === 'DISPUTED') return <AlertTriangle size={10} />;
  return <Clock size={10} />;
}

export default async function InvoicesPage() {
  const session = await requireOnboarding();

  const customerProfile = await db.customerProfile.findUnique({
    where: { userId: session.id },
  });

  const payments = customerProfile
    ? await db.payment.findMany({
        where: { customerId: customerProfile.id },
        include: {
          job: {
            include: {
              tradie: { include: { user: { select: { firstName: true, lastName: true } } } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
    : [];

  const totalSpent = payments
    .filter((p) => p.status === 'RELEASED' || p.status === 'CAPTURED')
    .reduce((acc, p) => acc + Number(p.amount), 0);

  const paidCount = payments.filter((p) => p.status === 'RELEASED' || p.status === 'CAPTURED').length;
  const pendingCount = payments.filter((p) => p.status === 'PENDING').length;

  return (
    <DashboardShell role="CUSTOMER">
      <PageHeader
        title="Invoices"
        description="All your completed job invoices in one place"
      />

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-white/8 bg-white/4 p-4 text-center">
          <p className="text-2xl font-extrabold text-white">${totalSpent.toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
          <p className="mt-1 text-xs text-gray-500">Total spent (AUD)</p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/4 p-4 text-center">
          <p className="text-2xl font-extrabold text-white">{payments.length}</p>
          <p className="mt-1 text-xs text-gray-500">Invoices</p>
        </div>
        <div className="rounded-2xl border border-green-500/20 bg-green-500/8 p-4 text-center">
          <p className="text-2xl font-extrabold text-green-400">{paidCount}</p>
          <p className="mt-1 text-xs text-gray-500">Paid</p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/4 p-4 text-center">
          <p className="text-2xl font-extrabold text-white">{pendingCount}</p>
          <p className="mt-1 text-xs text-gray-500">Pending</p>
        </div>
      </div>

      {payments.length > 0 ? (
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/8 bg-white/4">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Invoice</th>
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Date</th>
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Tradie</th>
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Job</th>
                  <th className="p-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Amount</th>
                  <th className="p-4 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                  <th className="p-4 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">PDF</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, idx) => {
                  const tradie = payment.job.tradie?.user;
                  const tradieName = tradie ? `${tradie.firstName} ${tradie.lastName}` : 'Unassigned';
                  const shortId = `INV-${payment.id.slice(0, 6).toUpperCase()}`;
                  const date = payment.paidAt ?? payment.createdAt;
                  return (
                    <tr key={payment.id} className={idx % 2 === 0 ? 'bg-transparent' : 'bg-white/2'}>
                      <td className="p-4 font-mono text-xs text-gray-400">{shortId}</td>
                      <td className="p-4 text-gray-400">
                        {date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-white">{tradieName}</p>
                        <p className="text-xs text-gray-500">{payment.job.category.replace(/_/g, ' ')}</p>
                      </td>
                      <td className="p-4 text-gray-400 max-w-[180px] truncate">{payment.job.title}</td>
                      <td className="p-4 text-right font-semibold text-white">
                        ${Number(payment.amount).toFixed(2)}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${STATUS_STYLE[payment.status] ?? 'bg-white/10 text-gray-400'}`}>
                          <StatusIcon status={payment.status} />
                          {statusLabel(payment.status)}
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
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
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
