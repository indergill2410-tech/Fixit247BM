import type { Metadata } from 'next';
import { requireRole } from '@/lib/auth/session';
import { DashboardShell, PageHeader } from '@/components/shared/dashboard-shell';
import { db } from '@fixit247/database';
import { MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@fixit247/ui';

export const metadata: Metadata = { title: 'Messages | Fixit247 Tradie' };
export const dynamic = 'force-dynamic';

export default async function TradieMessagesPage() {
  const session = await requireRole('TRADIE');

  // Find tradie profile
  const tradieProfile = await db.tradieProfile.findUnique({
    where: { userId: session.id },
    select: { id: true },
  });

  // Get jobs where this tradie is assigned, with latest message
  // Message has no sender relation — use senderId and compare against session.id
  const activeJobs = tradieProfile
    ? await db.job.findMany({
        where: {
          tradieId: tradieProfile.id,
          status: { in: ['CLAIMED', 'IN_PROGRESS', 'PENDING_REVIEW'] },
        },
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: { id: true, senderId: true, content: true, createdAt: true, readAt: true, receiverId: true },
          },
          customer: {
            include: {
              user: { select: { firstName: true, lastName: true, avatarUrl: true } },
            },
          },
          _count: {
            select: {
              messages: {
                where: {
                  receiverId: session.id,
                  readAt: null,
                },
              },
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
        take: 20,
      })
    : [];

  return (
    <DashboardShell role="TRADIE">
      <PageHeader
        title="Messages"
        description="Conversations with customers on your active jobs"
        badge={activeJobs.length > 0 ? { label: `${activeJobs.length} active`, variant: 'success' } : undefined}
      />

      {activeJobs.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-400 mb-4">
            <MessageSquare size={32} />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No active conversations</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-sm">
            Messages will appear here once you accept a job. Check the job feed for available opportunities.
          </p>
          <Link
            href="/tradie/jobs"
            className="rounded-xl bg-brand-500 px-6 py-3 text-sm font-bold text-gray-900 hover:bg-brand-400 transition-colors"
          >
            View Available Jobs →
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-white/8 rounded-2xl border border-white/8 bg-white/2">
          {activeJobs.map((job) => {
            const lastMsg = job.messages.at(0);
            const unreadCount = job._count.messages;
            const customer = job.customer.user;
            const isFromMe = lastMsg !== undefined && lastMsg.senderId === session.id;

            return (
              <Link
                key={job.id}
                href={`/tradie/jobs/${job.id}`}
                className="flex items-start gap-4 p-4 hover:bg-white/4 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
              >
                {/* Avatar */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-sm font-bold text-brand-400">
                  {customer.avatarUrl
                    ? <img src={customer.avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
                    : (customer.firstName[0])
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-white">
                      {customer.firstName} {customer.lastName}
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
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
                      {isFromMe ? 'You: ' : `${customer.firstName}: `}
                      {lastMsg.content}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-600 italic">No messages yet</p>
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
