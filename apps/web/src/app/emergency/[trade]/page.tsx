import { redirect } from 'next/navigation';

export default async function EmergencyTradeRedirectPage({ params }: { params: Promise<{ trade: string }> }) {
  const { trade } = await params;
  redirect(`/emergency/${trade}/sydney-cbd`);
}
