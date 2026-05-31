import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AdminShell } from '@/components/shared/admin-shell';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@fixit247/ui';
import { db } from '@fixit247/database';

export const metadata: Metadata = { title: 'User Details' };
export const dynamic = 'force-dynamic';

function formatName(user: { firstName: string; lastName: string; email: string }): string {
  return `${user.firstName} ${user.lastName}`.trim() || user.email;
}

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await db.user.findUnique({
    where: { id },
    include: {
      customerProfile: { select: { jobsPosted: true, totalSpent: true, creditBalance: true } },
      tradieProfile: { select: { id: true, businessName: true, verificationStatus: true, totalJobsCompleted: true, totalEarnings: true, trustScore: true } },
    },
  });

  if (!user) notFound();

  return (
    <AdminShell>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{formatName(user)}</h1>
          <p className="mt-1.5 text-sm text-gray-500">{user.email}</p>
        </div>
        <Button asChild variant="outline" size="sm"><Link href="/users">Back to users</Link></Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Account</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Role</span><Badge>{user.role}</Badge></div>
            <div className="flex justify-between"><span className="text-gray-500">Status</span><Badge variant={user.isActive ? 'success' : 'destructive'}>{user.isActive ? 'Active' : 'Suspended'}</Badge></div>
            <div className="flex justify-between"><span className="text-gray-500">Onboarding</span><span>{user.onboardingComplete ? 'Complete' : 'Incomplete'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Joined</span><span>{user.createdAt.toLocaleDateString('en-AU')}</span></div>
          </CardContent>
        </Card>

        {user.customerProfile && (
          <Card>
            <CardHeader><CardTitle>Customer Profile</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Jobs posted</span><span>{user.customerProfile.jobsPosted}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Total spent</span><span>${Number(user.customerProfile.totalSpent).toLocaleString('en-AU')}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Credit balance</span><span>${Number(user.customerProfile.creditBalance).toLocaleString('en-AU')}</span></div>
            </CardContent>
          </Card>
        )}

        {user.tradieProfile && (
          <Card>
            <CardHeader><CardTitle>Tradie Profile</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Business</span><span>{user.tradieProfile.businessName}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Verification</span><Badge>{user.tradieProfile.verificationStatus}</Badge></div>
              <div className="flex justify-between"><span className="text-gray-500">Completed jobs</span><span>{user.tradieProfile.totalJobsCompleted}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Earnings</span><span>${Number(user.tradieProfile.totalEarnings).toLocaleString('en-AU')}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Trust score</span><span>{Number(user.tradieProfile.trustScore).toFixed(0)}/100</span></div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminShell>
  );
}
