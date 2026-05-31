import { redirect } from 'next/navigation';

export default async function TradeRedirectPage({ params }: { params: Promise<{ trade: string }> }) {
  const { trade } = await params;
  redirect(`/trade/${trade}/sydney-cbd`);
}
