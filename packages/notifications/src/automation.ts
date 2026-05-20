import { db } from '@fixit247/database';
import { notify } from './service';

// Send welcome email after signup
export async function sendWelcomeEmail(userId: string): Promise<void> {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { customerProfile: true },
  });
  if (!user) return;

  await notify({
    userId,
    type: 'WELCOME_EMAIL',
    data: {
      firstName: user.firstName,
      suburb: user.customerProfile?.suburb ?? 'your area',
      siteUrl: process.env['NEXT_PUBLIC_APP_URL'] ?? 'https://fixit247.com.au',
    },
  });
}

// Send welcome tradie email
export async function sendWelcomeTradieEmail(userId: string): Promise<void> {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { tradieProfile: true },
  });
  if (!user || !user.tradieProfile) return;

  await notify({
    userId,
    type: 'WELCOME_TRADIE',
    data: {
      firstName: user.firstName,
      suburb: 'your area',
      estimatedWeekly: '800',
      siteUrl: process.env['NEXT_PUBLIC_APP_URL'] ?? 'https://fixit247.com.au',
    },
  });
}

// Send review request after job completion
export async function sendReviewRequest(jobId: string): Promise<void> {
  const job = await db.job.findUnique({
    where: { id: jobId },
    include: {
      customer: { include: { user: true } },
      claims: { where: { isAccepted: true }, include: { tradie: { include: { user: true } } }, take: 1 },
    },
  });
  if (!job || !job.customer?.user) return;

  const claim = job.claims[0];
  const tradieName = claim?.tradie?.user
    ? `${claim.tradie.user.firstName} ${claim.tradie.user.lastName}`
    : 'Your tradie';

  const siteUrl = process.env['NEXT_PUBLIC_APP_URL'] ?? 'https://fixit247.com.au';

  await notify({
    userId: job.customer.user.id,
    type: 'REVIEW_REQUEST',
    jobId,
    data: {
      firstName: job.customer.user.firstName,
      tradieName,
      reviewUrl: `${siteUrl}/jobs/${jobId}/review`,
    },
  });

  // Create review request record
  if (claim?.tradieId) {
    await db.reviewRequest.upsert({
      where: { jobId_customerId: { jobId, customerId: job.customer.id } },
      create: {
        jobId,
        customerId: job.customer.id,
        tradieId: claim.tradieId,
        status: 'SENT',
        sentAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      update: { status: 'SENT', sentAt: new Date() },
    });
  }
}

// Send referral prompt after job completion
export async function sendReferralPrompt(userId: string): Promise<void> {
  const siteUrl = process.env['NEXT_PUBLIC_APP_URL'] ?? 'https://fixit247.com.au';
  const referral = await db.referral.findFirst({ where: { inviterId: userId }, orderBy: { createdAt: 'desc' } });
  const code = referral?.code ?? 'SHARE';

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return;

  await notify({
    userId,
    type: 'REFERRAL_PROMPT',
    data: {
      firstName: user.firstName,
      referralLink: `${siteUrl}/auth/register?ref=${code}`,
    },
  });
}

// Re-engagement for inactive tradies
export async function sendTradieReactivation(tradieUserId: string, jobCount: number): Promise<void> {
  const user = await db.user.findUnique({ where: { id: tradieUserId }, include: { tradieProfile: true } });
  if (!user || !user.tradieProfile) return;

  const siteUrl = process.env['NEXT_PUBLIC_APP_URL'] ?? 'https://fixit247.com.au';

  await notify({
    userId: tradieUserId,
    type: 'TRADIE_REACTIVATION',
    data: {
      firstName: user.firstName,
      jobCount: jobCount.toString(),
      suburb: 'your area',
      dashboardUrl: `${siteUrl}/tradie/dashboard`,
      emergencyRate: '$150',
    },
  });
}
