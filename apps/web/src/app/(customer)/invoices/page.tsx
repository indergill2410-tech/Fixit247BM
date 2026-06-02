import type { Metadata } from 'next';
import Link from 'next/link';
import { requireRole } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { DashboardShell, PageHeader } from '@/components/shared/dashboard-shell';
import { CheckCircle, Clock, AlertTriangle, RotateCcw } from 'lucide-react';

export const metadata: Metadata = { title: 'Invoices' };
export const dynamic = 'force-dynamic';

// Map the PaymentStatus enum to a customer-facing label + style.
const STATUS_DISPLAY: Record<string, { label: string; style: string; paid: boolean }> = {
  HELD_IN_ESCROW: { label: 'Paid', style: 'bg-green-500/15 text-green-400', paid: true },
  RELEASED: { label: 'Paid', style: 'bg-green-500/15 text-green-400', paid: true },
  PENDING: { label: 'Pending', style: 'bg-brand-500/15 text-brand-400', paid: false },
  PROCESSING: { label: 'Processing', style: 'bg-brand-500/15 text-brand-400', paid: false },
  REFUNDED: { label: 'Refunded', style: 'bg-gray-500/15 text-gray-400', paid: false },
  DISPUTED: { label: 'Disputed', style: 'bg-red-500/15 text-red-400', paid: false },
  FAILED: { label: 'Failed', style: 'bg-red-500/15 text-red-400', paid: false },
};

function fmtAud(n: number) {
  return `$${n.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default async function InvoicesPage() {
  const session = await requireRole('CUSTOMER');

  const customerProfile = await db.customerProfile.findUnique({
    where: { userId: session.id },
    select: { id: true },
  });

  const payments = customerProfile
    ? await db.payment.findMany({
        where: { customerId: customerProfile.id },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          amount: true,
          status: true,
          paidAt: true,
          createdAt: true,
          job: {
            select: {
              title: true,
              category: true,
              tradie: {
                select: {
                  businessName: true,
                  user: { select: { firstName: true, lastName: true } },
                },
              },
            },
          },
        },
      })
    : [];

  const totalSpent = payments
    .filter((p) => STATUS_DISPLAY[p.status]?.paid)
    .reduce((acc, p) => acc + Number(p.amount), 0);
  const paidCount = payments.filter((p) => STATUS_DISPLAY[p.status]?.paid).length;
  const pendingCount = payments.filter((p) => p.status === 'PENDING' || p.status === 'PROCESSING').length;

  return (
    <DashboardShell role="CUSTOMER">
      <PageHeader title="Invoices" description="All your completed job invoices in one place" />

      {payments.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-white/8 bg-white/4 py-16 text-center">
          <p className="mb-3 text-4xl">💳</p>
          <p className="font-semibold text-white">No invoices yet</p>
          <p className="mt-2 text-sm text-gray-500">Your invoices will appear here after jobs are completed.</p>
          <Link href="/jobs/new" className="mt-6 rounded-xl bg-brand-400 px-6 py-2.5 text-sm font-bold text-gray-900 transition-colors hover:bg-brand-300">
            Post your first job
          </Link>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/8 bg-white/4 p-4 text-center">
              <p className="text-2xl font-extrabold text-white">{fmtAud(totalSpent)}</p>
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
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p, idx) => {
                    const display = STATUS_DISPLAY[p.status] ?? { label: p.status, style: 'bg-white/8 text-gray-400', paid: false };
                    const tradieUser = p.job.tradie?.user;
                    const tradieName = p.job.tradie?.businessName?.trim()
                      ? p.job.tradie.businessName
                      : tradieUser
                        ? `${tradieUser.firstName} ${tradieUser.lastName}`.trim()
                        : '—';
                    const date = p.paidAt ?? p.createdAt;
                    const Icon = display.paid ? CheckCircle : p.status === 'REFUNDED' ? RotateCcw : p.status === 'DISPUTED' || p.status === 'FAILED' ? AlertTriangle : Clock;
                    return (
                      <tr key={p.id} className={idx % 2 === 0 ? 'bg-transparent' : 'bg-white/2'}>
                        <td className="p-4 font-mono text-xs text-gray-400">INV-{p.id.slice(0, 8).toUpperCase()}</td>
                        <td className="p-4 text-gray-400">{new Date(date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                        <td className="p-4">
                          <p className="font-medium text-white">{tradieName}</p>
                          <p className="text-xs text-gray-500">{p.job.category.replace(/_/g, ' ')}</p>
                        </td>
                        <td className="p-4 text-gray-400">{p.job.title}</td>
                        <td className="p-4 text-right font-semibold text-white">{fmtAud(Number(p.amount))}</td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${display.style}`}>
                            <Icon size={10} />
                            {display.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </DashboardShell>
  );
}
