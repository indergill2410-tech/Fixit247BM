import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AdminShell } from '@/components/shared/admin-shell';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@fixit247/ui';
import { db } from '@fixit247/database';

export const metadata: Metadata = { title: 'Verification Review' };
export const dynamic = 'force-dynamic';

function formatEnumLabel(value: string): string {
  return value.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export default async function VerificationReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await db.tradieProfile.findUnique({
    where: { id },
    include: {
      user: { select: { firstName: true, lastName: true, email: true, phone: true } },
      licences: true,
      insurances: true,
    },
  });

  if (!profile) notFound();

  const businessAbn = profile.abn ?? 'Not provided';
  const phone = profile.user.phone ?? 'Not provided';
  const trades = profile.trades.length > 0 ? profile.trades.map(formatEnumLabel).join(', ') : 'None';

  return (
    <AdminShell>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{profile.user.firstName} {profile.user.lastName}</h1>
          <p className="mt-1.5 text-sm text-gray-500">{profile.businessName} · {profile.user.email}</p>
        </div>
        <Button asChild variant="outline" size="sm"><Link href="/verifications">Back to verifications</Link></Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Verification Summary</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Status</span><Badge>{formatEnumLabel(profile.verificationStatus)}</Badge></div>
            <div className="flex justify-between"><span className="text-gray-500">ABN</span><span>{businessAbn}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Phone</span><span>{phone}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Trades</span><span>{trades}</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Documents</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-semibold text-gray-700">Licences</p>
              {profile.licences.length === 0 ? <p className="text-sm text-gray-400">No licences uploaded.</p> : profile.licences.map((licence) => (
                <div key={licence.id} className="mb-2 rounded-lg border p-3 text-sm">
                  <div className="flex justify-between"><span>{licence.licenceType}</span><Badge>{formatEnumLabel(licence.status)}</Badge></div>
                  <p className="mt-1 text-xs text-gray-500">{licence.licenceNumber}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-gray-700">Insurance</p>
              {profile.insurances.length === 0 ? <p className="text-sm text-gray-400">No insurance uploaded.</p> : profile.insurances.map((insurance) => (
                <div key={insurance.id} className="mb-2 rounded-lg border p-3 text-sm">
                  <div className="flex justify-between"><span>{insurance.insurer}</span><Badge>{formatEnumLabel(insurance.status)}</Badge></div>
                  <p className="mt-1 text-xs text-gray-500">{insurance.policyNumber}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
