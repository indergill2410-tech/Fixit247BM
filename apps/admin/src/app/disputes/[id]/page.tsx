import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AdminShell } from '@/components/shared/admin-shell';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@fixit247/ui';
import { db } from '@fixit247/database';

export const metadata: Metadata = { title: 'Dispute Details' };
export const dynamic = 'force-dynamic';

function formatEnumLabel(value: string): string {
  return value.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export default async function DisputeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dispute = await db.dispute.findUnique({
    where: { id },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          status: true,
          customer: { select: { user: { select: { firstName: true, lastName: true, email: true } } } },
          tradie: { select: { user: { select: { firstName: true, lastName: true, email: true } } } },
        },
      },
    },
  });

  if (!dispute) notFound();

  return (
    <AdminShell>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dispute {dispute.id.slice(0, 8)}</h1>
          <p className="mt-1.5 text-sm text-gray-500">{dispute.job.title}</p>
        </div>
        <Button asChild variant="outline" size="sm"><Link href="/disputes">Back to disputes</Link></Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Case</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Status</span><Badge>{formatEnumLabel(dispute.status)}</Badge></div>
            <div className="flex justify-between"><span className="text-gray-500">Reason</span><span>{formatEnumLabel(dispute.reason)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Refund amount</span><span>{dispute.refundAmount ? `$${Number(dispute.refundAmount).toLocaleString('en-AU')}` : 'Not set'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Created</span><span>{dispute.createdAt.toLocaleDateString('en-AU')}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Due by</span><span>{dispute.dueBy ? dispute.dueBy.toLocaleDateString('en-AU') : 'Not set'}</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>People and Job</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-gray-500">Customer</p>
              <p className="font-medium text-gray-900">
                {`${dispute.job.customer.user.firstName} ${dispute.job.customer.user.lastName}`.trim() || dispute.job.customer.user.email}
              </p>
              <p className="text-xs text-gray-500">{dispute.job.customer.user.email}</p>
            </div>
            <div>
              <p className="text-gray-500">Tradie</p>
              <p className="font-medium text-gray-900">
                {dispute.job.tradie
                  ? `${dispute.job.tradie.user.firstName} ${dispute.job.tradie.user.lastName}`.trim() || dispute.job.tradie.user.email
                  : 'Unassigned'}
              </p>
              {dispute.job.tradie && <p className="text-xs text-gray-500">{dispute.job.tradie.user.email}</p>}
            </div>
            <div>
              <p className="text-gray-500">Job</p>
              <p className="font-medium text-gray-900">{dispute.job.title}</p>
              <p className="text-xs text-gray-500">{formatEnumLabel(dispute.job.status)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Details</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-gray-700">{dispute.description || 'No additional details provided.'}</p>
            {dispute.adminNotes && (
              <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="text-xs font-semibold uppercase text-gray-500">Admin notes</p>
                <p className="mt-1 text-sm text-gray-700">{dispute.adminNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
