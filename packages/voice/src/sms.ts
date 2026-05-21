const TWILIO_BASE = 'https://api.twilio.com/2010-04-01';

async function twilioPost(path: string, body: Record<string, string>): Promise<boolean> {
  const accountSid = process.env['TWILIO_ACCOUNT_SID'];
  const authToken = process.env['TWILIO_AUTH_TOKEN'];
  if (!accountSid || !authToken) return false;

  const res = await fetch(`${TWILIO_BASE}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(body).toString(),
  });
  return res.ok;
}

export async function sendSms(to: string, body: string): Promise<boolean> {
  const accountSid = process.env['TWILIO_ACCOUNT_SID'];
  const from = process.env['TWILIO_PHONE_NUMBER'];
  if (!accountSid || !from) return false;
  return twilioPost(`/Accounts/${accountSid}/Messages.json`, { To: to, From: from, Body: body });
}

export async function sendBookingConfirmationSms(
  phoneNumber: string,
  data: {
    name?: string | null;
    category: string;
    suburb?: string | null;
    isEmergency: boolean;
    jobRef: string;
  },
): Promise<boolean> {
  const { name, category, suburb, isEmergency, jobRef } = data;
  const greeting = name ? `Hi ${name.split(' ')[0]}` : 'Hi there';
  const categoryLabel = category.replace(/_/g, ' ').toLowerCase();
  const locationPart = suburb ? ` in ${suburb}` : '';
  const urgencyLabel = isEmergency ? 'emergency ' : '';
  const eta = isEmergency ? 'within the hour' : 'as soon as possible';

  const body =
    `${greeting}, your ${urgencyLabel}${categoryLabel} booking${locationPart} is confirmed with Fixit 24/7! ` +
    `We're matching you with a tradie now and they'll call you ${eta}. ` +
    `Ref: ${jobRef} | Help: fixit247.com.au`;

  return sendSms(phoneNumber, body);
}

export async function sendTradieAlertSms(
  phoneNumber: string,
  data: {
    category: string;
    suburb?: string | null;
    isEmergency: boolean;
    description: string;
  },
): Promise<boolean> {
  const { category, suburb, isEmergency, description } = data;
  const categoryLabel = category.replace(/_/g, ' ');
  const locationPart = suburb ? ` in ${suburb}` : '';
  const prefix = isEmergency ? '🚨 EMERGENCY JOB: ' : '📋 New Job: ';
  const snippet = description.length > 80 ? description.slice(0, 77) + '...' : description;

  const body =
    `${prefix}${categoryLabel}${locationPart} via Fixit 24/7. ` +
    `"${snippet}" — Open the app to claim it now.`;

  return sendSms(phoneNumber, body);
}

export async function sendEmergencyAdminAlertSms(
  adminPhone: string,
  data: {
    callerPhone: string;
    riskLevel: string;
    score: number;
    description: string;
  },
): Promise<boolean> {
  const { callerPhone, riskLevel, score, description } = data;
  const body =
    `🚨 Fixit 24/7 ADMIN ALERT — ${riskLevel} emergency (score ${score}/100) from ${callerPhone}. ` +
    `"${description.slice(0, 100)}" — Check the admin dashboard immediately.`;
  return sendSms(adminPhone, body);
}
