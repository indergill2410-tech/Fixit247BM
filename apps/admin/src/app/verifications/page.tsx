import type { Metadata } from 'next';
import { AdminShell } from '@/components/shared/admin-shell';
import { Card, CardContent, Badge, Button } from '@fixit247/ui';
import { ShieldCheck } from 'lucide-react';
import { db } from '@fixit247/database';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Tradie Verifications' };
export const dynamic = 'force-dynamic';

const TRADE_LABELS: Record<string, string> = {
  PLUMBING: 'Plumbing', ELECTRICAL: 'Electrical', HVAC: 'HVAC',
  CARPENTRY: 'Carpentry', PAINTING: 'Painting', ROOFING: 'Roofing',
  LOCKSMITH: 'Locksmith', GLAZING: 'Glazing', PEST_CONTROL: 'Pest Control',
  PLASTERING: 'Plastering', GENERAL_MAINTENANCE: 'General Maintenance',
};

export default async function VerificationsPage() {
  const [pending, inReview, approved] = await Promise.all([
    db.tradieProfile.count({ where: { verificationStatus: 'PENDING' } }),
    db.tradieProfile.count({ where: { verificationStatus: 'UNVERIFIED' } }),
    db.tradieProfile.count({ where: { verificationStatus: 'VERIFIED' } }),
  ]);

  const profiles = await db.tradieProfile.findMany({
    where: { verificationStatus: { in: ['PENDING', 'UNVERIFIED'] } },
    orderBy: { createdAt: 'asc' },
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
      licences: { select: { licenceType: true, status: true } },
      insurances: { select: { insurer: true, status: true } },
    },
  });

  return (
    <AdminShell>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground"><ShieldCheck size={22} className="text-amber-500" />Tradie Verifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review and approve tradie identity, licence, and insurance documents
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="warning">{pending} pending</Badge>
          <Badge variant="default">{inReview} in review</Badge>
          <Badge variant="success">{approved} approved</Badge>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                {['Tradie', 'Trades', 'Documents', 'Submitted', 'Status', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {profiles.map((p: typeof profiles[number]) => {
                const docs = [
                  ...p.licences.map((l) => l.licenceType ?? 'Licence'),
                  ...p.insurances.map(() => 'Insurance'),
                ];
                return (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-4">
                      <p className="font-medium text-foreground">{p.user.firstName} {p.user.lastName}</p>
                      <p className="text-xs text-muted-foreground">{p.user.email}</p>
                    </td>
                    <td className="px-4 py-4 text-sm text-foreground">
                      {p.trades.slice(0, 2).map((t) => TRADE_LABELS[t] ?? t).join(', ')}
                      {p.trades.length > 2 && ` +${p.trades.length - 2}`}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {docs.length === 0
                          ? <Badge variant="destructive" className="text-xs">None uploaded</Badge>
                          : docs.map((d, i) => <Badge key={i} variant="default" className="text-xs">{d}</Badge>)
                        }
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {p.createdAt.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={p.verificationStatus === 'PENDING' ? 'warning' : 'default'}>
                        {p.verificationStatus}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <Button size="sm" asChild>
                        <Link href={`/verifications/${p.id}`}>Review</Link>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {profiles.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">No pending verifications</p>
          )}
        </CardContent>
      </Card>
    </AdminShell>
  );
}
