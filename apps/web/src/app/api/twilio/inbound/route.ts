// Compatibility alias — Twilio console may be configured with either:
//   /api/twilio/inbound  (this file)
//   /api/voice/twilio/inbound  (canonical route)
// Both handlers are identical; signature validation uses req.url so the HMAC
// is computed against whichever URL Twilio actually called.
export { POST, runtime } from '@/app/api/voice/twilio/inbound/route';
