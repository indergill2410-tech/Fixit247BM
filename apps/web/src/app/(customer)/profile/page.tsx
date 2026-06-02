import type { Metadata } from 'next';
import { requireRole } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { DashboardShell, PageHeader } from '@/components/shared/dashboard-shell';
import { CustomerProfileForm } from '@/components/features/customer/customer-profile-form';

export const metadata: Metadata = { title: 'My Profile | Fixit247' };
export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = await requireRole('CUSTOMER');

  const [user, profile] = await Promise.all([
    db.user.findUnique({
      where: { id: session.id },
      select: { firstName: true, lastName: true, email: true, phone: true },
    }),
    db.customerProfile.findUnique({
      where: { userId: session.id },
      select: {
        suburb: true,
        postcode: true,
        state: true,
        emergencyContactName: true,
        emergencyContactPhone: true,
        notifyBySms: true,
        notifyByEmail: true,
        notifyByPush: true,
      },
    }),
  ]);

  const initial = {
    firstName: user?.firstName ?? session.firstName,
    lastName: user?.lastName ?? session.lastName,
    email: user?.email ?? session.email,
    phone: user?.phone ?? '',
    suburb: profile?.suburb ?? '',
    postcode: profile?.postcode ?? '',
    state: profile?.state ?? '',
    emergencyContactName: profile?.emergencyContactName ?? '',
    emergencyContactPhone: profile?.emergencyContactPhone ?? '',
    notifyBySms: profile?.notifyBySms ?? true,
    notifyByEmail: profile?.notifyByEmail ?? true,
    notifyByPush: profile?.notifyByPush ?? true,
  };

  return (
    <DashboardShell role="CUSTOMER">
      <PageHeader title="My Profile" description="Manage your contact details and notification preferences" />
      <div className="mt-6 max-w-3xl">
        <CustomerProfileForm initial={initial} />
      </div>
    </DashboardShell>
  );
}
