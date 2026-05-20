import { NextResponse } from 'next/server';
import { db } from '@fixit247/database';
import { generateJobSummary } from '@fixit247/voice';
import type { ConversationContext } from '@fixit247/voice';
import { z } from 'zod';
import { toLocalFormat } from '@/lib/utils/phone';

export const runtime = 'nodejs';

const schema = z.object({
  callId: z.string().uuid(),
  conversationId: z.string().uuid().optional(),
  jobData: z.object({
    issue: z.string().optional(),
    tradeCategory: z.string().optional(),
    suburb: z.string().optional(),
    address: z.string().optional(),
    isEmergency: z.boolean().optional(),
    urgencyScore: z.number().optional(),
  }),
});

export async function POST(req: Request) {
  const body = schema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: 'Invalid' }, { status: 400 });
  const { callId, conversationId, jobData } = body.data;

  const call = await db.voiceCall.findUnique({ where: { id: callId } });
  if (!call) return NextResponse.json({ error: 'Call not found' }, { status: 404 });

  // Get conversation messages for summary
  const convo = conversationId ? await db.aIConversation.findUnique({ where: { id: conversationId } }) : null;

  // Find or create a system user for voice-created jobs
  let customerId = call.customerId;
  if (!customerId) {
    // Try to find by phone — match either E.164 (+61XXXXXXXXX) or local (0XXXXXXXXX)
    // since older records may have been stored before E.164 normalisation was enforced.
    const phoneVariants = [call.phoneNumber, toLocalFormat(call.phoneNumber)].filter(Boolean);
    const user = await db.user.findFirst({ where: { phone: { in: phoneVariants } } });
    customerId = user?.id ?? null;
  }

  // Find customer profile
  let customerProfileId: string | null = null;
  if (customerId) {
    const profile = await db.customerProfile.findUnique({ where: { userId: customerId } });
    customerProfileId = profile?.id ?? null;
  }

  if (!customerProfileId) {
    return NextResponse.json({ error: 'No customer profile — cannot create job' }, { status: 422 });
  }

  // Generate AI summary
  const messages = convo ? (convo.messages as any[]) : [];
  const context: ConversationContext = {
    sessionId: `call_${callId}`,
    messages,
    extractedData: {},
    turnCount: messages.length,
    isComplete: true,
    isEmergency: jobData.isEmergency ?? false,
  };
  const description = await generateJobSummary(context).catch(() => jobData.issue ?? 'Emergency service required');

  const tradeCategoryMap: Record<string, string> = {
    PLUMBING: 'PLUMBING', ELECTRICAL: 'ELECTRICAL', LOCKSMITH: 'LOCKSMITH',
    HVAC: 'HVAC', ROOFING: 'ROOFING', GLAZING: 'GLAZING',
    PEST_CONTROL: 'PEST_CONTROL', CARPENTRY: 'CARPENTRY',
    PLASTERING: 'PLASTERING', GENERAL_MAINTENANCE: 'GENERAL_MAINTENANCE',
  };
  const category = tradeCategoryMap[jobData.tradeCategory ?? ''] ?? 'GENERAL_MAINTENANCE';

  // Create address if suburb provided (requires a userId — use the customer's userId)
  let addressId: string | undefined;
  if (jobData.suburb && customerId) {
    const address = await db.address.create({
      data: {
        userId: customerId,
        street: jobData.address ?? 'To be confirmed',
        suburb: jobData.suburb,
        city: jobData.suburb,
        state: 'NSW',
        postcode: '0000',
        country: 'AU',
      },
    });
    addressId = address.id;
  }

  // Create the job
  const job = await db.job.create({
    data: {
      title: `${jobData.isEmergency ? 'EMERGENCY: ' : ''}${category.replace(/_/g, ' ')} — Voice Booking`,
      description,
      category: category as any,
      status: 'OPEN',
      priority: jobData.isEmergency ? 'EMERGENCY' : 'URGENT',
      isEmergency: jobData.isEmergency ?? false,
      customerId: customerProfileId,
      addressId,
    },
  });

  // Link call and conversation to job
  await db.voiceCall.update({ where: { id: callId }, data: { jobId: job.id } });
  if (convo) {
    await db.aIConversation.update({ where: { id: convo.id }, data: { jobId: job.id, status: 'JOB_CREATED' } });
  }

  // Create emergency assessment if needed
  if (jobData.isEmergency && (jobData.urgencyScore ?? 0) > 0) {
    await db.emergencyAssessment.create({
      data: {
        jobId: job.id,
        callId,
        riskLevel: (jobData.urgencyScore ?? 0) >= 85 ? 'CRITICAL' : (jobData.urgencyScore ?? 0) >= 60 ? 'HIGH' : 'MEDIUM',
        emergencyScore: jobData.urgencyScore ?? 50,
        detectedKeywords: [],
        recommendedAction: 'Auto-dispatched via voice AI',
        safetyInstructions: [],
        autoDispatch: true,
      },
    });
  }

  // Log job created event
  await db.voiceEvent.create({
    data: { callId, eventType: 'JOB_CREATED', payload: { jobId: job.id } as any },
  });

  return NextResponse.json({ job, success: true });
}
