export type NotifData = Record<string, string | number | undefined>;

const TEMPLATES: Record<string, { title?: string; subject?: string; body: string }> = {
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

  // Growth / Marketing automation templates
  WELCOME_EMAIL: {
    subject: 'Welcome to Fixit 24/7 — Australia\'s Emergency Tradie Platform 🔧',
    body: `Hi {{firstName}},

Welcome to Fixit 24/7! You're now connected to Australia's largest network of verified emergency tradies.

**What you can do right now:**
• Post a job and get matched with a local tradie in minutes
• Browse verified tradies near {{suburb}}
• Set up emergency contacts for urgent repairs

**Your first job is on us** — use code WELCOME20 for $20 off.

Need help urgently? Our emergency dispatch runs 24/7.

Get started: {{siteUrl}}/post-job

The Fixit 24/7 Team`,
  },

  WELCOME_TRADIE: {
    subject: 'Welcome to Fixit 24/7 — Start Receiving Leads Today 👷',
    body: `Hi {{firstName}},

Welcome to Fixit 24/7! Your profile is being reviewed and you'll receive your first leads within 24 hours of verification.

**Next steps to start earning:**
1. Complete your profile (add a photo, certifications, and service areas)
2. Set your availability and service radius
3. Turn on emergency availability to get priority leads

**Your earning potential in {{suburb}}:**
• Average tradie earns ${{estimatedWeekly}}/week on Fixit 24/7
• Emergency jobs pay 2-3x standard rates
• Get paid within 24 hours of job completion

Complete your profile: {{siteUrl}}/tradie/profile

The Fixit 24/7 Team`,
  },

  INCOMPLETE_ONBOARDING: {
    subject: 'You\'re almost there — finish your Fixit 24/7 profile',
    body: `Hi {{firstName}},

You started signing up for Fixit 24/7 but didn't finish. You're missing out on jobs near {{suburb}}!

**Complete your profile in 3 minutes:**
{{completionUrl}}

Tradies who complete their profile get **3x more leads** in their first week.

The Fixit 24/7 Team`,
  },

  ABANDONED_JOB: {
    subject: 'Still need help? Your job is waiting on Fixit 24/7',
    body: `Hi {{firstName}},

You started posting a job for {{jobCategory}} but didn't finish. We have verified tradies available near {{suburb}} right now.

**Complete your job posting:**
{{jobUrl}}

Emergency jobs are prioritised — most get matched within 15 minutes.

The Fixit 24/7 Team`,
  },

  REVIEW_REQUEST: {
    subject: 'How did {{tradieName}} do? Leave a quick review',
    body: `Hi {{firstName}},

Your job with {{tradieName}} is complete — great! Reviews help other homeowners find trusted tradies.

It only takes 30 seconds:
{{reviewUrl}}

As a thank you, leave a review and get **$5 credit** on your next booking.

The Fixit 24/7 Team`,
  },

  REFERRAL_PROMPT: {
    subject: 'Give $20, Get $20 — Share Fixit 24/7 with a friend',
    body: `Hi {{firstName}},

You've used Fixit 24/7 — so you know how good it is. Share it with a friend and you'll both get $20 credit!

**Your referral link:**
{{referralLink}}

Share it on WhatsApp, SMS, or copy it to send however you like.

The Fixit 24/7 Team`,
  },

  TRADIE_REACTIVATION: {
    subject: 'We miss you — {{jobCount}} new jobs near {{suburb}} this week',
    body: `Hi {{firstName}},

There have been {{jobCount}} jobs posted near {{suburb}} this week, and your profile wasn't active to receive them.

**Turn your availability back on:**
{{dashboardUrl}}

Emergency jobs are paying {{emergencyRate}}+ this week. Don't miss out.

The Fixit 24/7 Team`,
  },

  TRADIE_REFERRAL_BONUS: {
    subject: 'You earned $50 — a tradie you referred just completed their first job!',
    body: `Hi {{firstName}},

Great news — {{refereeName}}, the tradie you referred to Fixit 24/7, just completed their first job!

**Your $50 referral bonus has been added to your wallet.**

Keep referring tradies and earn $50 for each one who completes their first job.

Your referral link: {{referralLink}}

The Fixit 24/7 Team`,
  },
};

function interpolate(template: string, data: NotifData): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => String(data[key] ?? ''));
}

export function renderTemplate(type: string, data: NotifData): { title: string; subject?: string; body: string } {
  const tpl = TEMPLATES[type] ?? TEMPLATES['SYSTEM_ALERT']!;
  const title = tpl.title ? interpolate(tpl.title, data) : (tpl.subject ? interpolate(tpl.subject, data) : type);
  const subject = tpl.subject ? interpolate(tpl.subject, data) : undefined;
  return { title, subject, body: interpolate(tpl.body, data) };
}
