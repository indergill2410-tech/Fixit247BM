export type NotifData = Record<string, string | number | undefined>;

const TEMPLATES: Record<string, { title: string; body: string }> = {
  JOB_CREATED:           { title: 'Job posted!',                    body: 'Your job "{{jobTitle}}" has been posted. Finding the best tradie for you…' },
  JOB_ASSIGNED:          { title: 'Tradie found!',                  body: '{{tradieName}} has been assigned to your job "{{jobTitle}}".' },
  JOB_ACCEPTED:          { title: 'Job accepted',                   body: '{{tradieName}} accepted your job. They\'ll be on their way shortly.' },
  JOB_DECLINED:          { title: 'Tradie unavailable',             body: '{{tradieName}} is unable to take your job. Finding another tradie…' },
  TRADIE_EN_ROUTE:       { title: '{{tradieName}} is on the way!',  body: 'ETA: {{etaMinutes}} minutes. Track their live location in the app.' },
  TRADIE_ARRIVED:        { title: 'Tradie has arrived',             body: '{{tradieName}} has arrived at your location.' },
  JOB_STARTED:           { title: 'Job in progress',                body: '{{tradieName}} has started work on "{{jobTitle}}".' },
  JOB_COMPLETED:         { title: 'Job completed!',                 body: '{{tradieName}} has completed "{{jobTitle}}". Review their work and release payment.' },
  PAYMENT_HELD:          { title: 'Payment held in escrow',         body: '${{amount}} is secured. Released to {{tradieName}} when you confirm completion.' },
  PAYMENT_RELEASED:      { title: 'Payment released',               body: '${{amount}} has been released to {{tradieName}}. Thanks for using Fixit247!' },
  PAYMENT_FAILED:        { title: 'Payment failed',                 body: 'Your payment for "{{jobTitle}}" failed. Please update your payment method.' },
  DISPUTE_OPENED:        { title: 'Dispute raised',                 body: 'A dispute has been opened for "{{jobTitle}}". Our team reviews within 24 hours.' },
  DISPUTE_RESOLVED:      { title: 'Dispute resolved',               body: 'Your dispute for "{{jobTitle}}" has been resolved.' },
  NEW_MESSAGE:           { title: '{{senderName}}',                 body: '{{content}}' },
  CREDIT_LOW:            { title: 'Credits running low',            body: 'You have {{credits}} credits remaining. Top up to keep accepting jobs.' },
  SUBSCRIPTION_RENEWED:  { title: 'Subscription renewed',           body: 'Your {{tier}} plan renewed. {{bonusCredits}} bonus credits added.' },
  VERIFICATION_APPROVED: { title: 'Licence verified ✓',            body: 'Your {{licenceType}} licence has been verified.' },
  VERIFICATION_REJECTED: { title: 'Verification failed',            body: 'Your {{licenceType}} document was rejected. Reason: {{reason}}' },
  SYSTEM_ALERT:          { title: '{{title}}',                      body: '{{body}}' },
};

function interpolate(template: string, data: NotifData): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => String(data[key] ?? ''));
}

export function renderTemplate(type: string, data: NotifData): { title: string; body: string } {
  const tpl = TEMPLATES[type] ?? TEMPLATES['SYSTEM_ALERT']!;
  return { title: interpolate(tpl.title, data), body: interpolate(tpl.body, data) };
}
