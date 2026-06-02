import type { Metadata } from 'next';
import Link from 'next/link';
import { requireRole } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { DashboardShell, PageHeader } from '@/components/shared/dashboard-shell';
import { Badge } from '@fixit247/ui';
import { FxIcon } from '@/components/ui/fx-icon';

export const metadata: Metadata = { title: 'Messages | Fixit247' };
export const dynamic = 'force-dynamic';

const ACTIVE_STATUSES = ['CLAIMED', 'IN_PROGRESS', 'PENDING_REVIEW'] as const;

export default async function CustomerMessagesPage() {
  const session = await requireRole('CUSTOMER');

  const customerProfile = await db.customerProfile.findUnique({
    where: { userId: session.id },
    select: { id: true },
  });

  // Jobs this customer has with an assigned tradie, with the latest message
  // and a count of messages addressed to the customer that are still unread.
  const activeJobs = customerProfile
    ? await db.job.findMany({
        where: {
          customerId: customerProfile.id,
          status: { in: [...ACTIVE_STATUSES] },
          tradieId: { not: null },
        },
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: { id: true, senderId: true, content: true, createdAt: true, readAt: true },
          },
          tradie: {
            select: {
              businessName: true,
              user: { select: { firstName: true, lastName: true, avatarUrl: true } },
            },
          },
          _count: {
            select: {
              messages: { where: { receiverId: session.id, readAt: null } },
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
        take: 20,
      })
    : [];

  return (
    <DashboardShell role="CUSTOMER">
      <PageHeader
        title="Messages"
        description="Conversations with tradies on your active jobs"
        badge={activeJobs.length > 0 ? { label: `${activeJobs.length} active`, variant: 'success' } : undefined}
      />

      {activeJobs.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-400">
            <FxIcon name="message" size={32} />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-white">No active conversations</h2>
          <p className="mb-6 max-w-sm text-sm text-gray-500">
            Your conversations with tradies will appear here once you have an active job.
          </p>
          <Link
            href="/jobs/new"
            className="rounded-xl bg-brand-500 px-6 py-3 text-sm font-bold text-gray-900 transition-colors hover:bg-brand-400"
          >
            Post a job to get started →
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-white/8 rounded-2xl border border-white/8 bg-white/2">
          {activeJobs.map((job) => {
            const lastMsg = job.messages.at(0);
            const unreadCount = job._count.messages;
            const tradieUser = job.tradie?.user;
            const tradieName = job.tradie?.businessName?.trim()
              ? job.tradie.businessName
              : tradieUser
                ? `${tradieUser.firstName} ${tradieUser.lastName}`.trim()
                : 'Tradie';
            const isFromMe = lastMsg !== undefined && lastMsg.senderId === session.id;

            return (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="flex items-start gap-4 p-4 transition-colors first:rounded-t-2xl last:rounded-b-2xl hover:bg-white/4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-sm font-bold text-brand-400">
                  {tradieUser?.avatarUrl
                    ? <img src={tradieUser.avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
                    : (tradieName[0] ?? 'T')}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-white">{tradieName}</p>
                    <div className="flex shrink-0 items-center gap-2">
                      {unreadCount > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1 text-xs font-bold text-gray-900">
                          {unreadCount}
                        </span>
                      )}
                      {lastMsg !== undefined && (
                        <span className="text-xs text-gray-600">
                          {new Date(lastMsg.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="mt-0.5 truncate text-xs text-gray-500">{job.title}</p>

                  {lastMsg !== undefined ? (
                    <p className={`mt-1 truncate text-xs ${unreadCount > 0 ? 'font-semibold text-gray-200' : 'text-gray-500'}`}>
                      {isFromMe ? 'You: ' : `${tradieName.split(' ')[0]}: `}
                      {lastMsg.content}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs italic text-gray-600">No messages yet</p>
                  )}
                </div>

                <Badge variant={job.status === 'IN_PROGRESS' ? 'success' : 'default'} className="shrink-0 text-xs">
                  {job.status.replace(/_/g, ' ')}
                </Badge>
              </Link>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
