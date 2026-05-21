// Compatibility alias — see /api/twilio/inbound/route.ts for explanation.
// The gather action URL in TwiML must match whichever path Twilio calls.
// Since buildGreetingTwiML hardcodes /api/voice/twilio/gather, this file
// is only active if Twilio uses the short path for gather too.
export const runtime = 'nodejs';
export { POST } from '@/app/api/voice/twilio/gather/route';
