export function buildGreetingTwiML(webhookBase: string): string {
  const base = webhookBase.replace(/\/$/, '');
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="${base}/api/voice/twilio/gather" method="POST"
    speechTimeout="auto" speechModel="phone_call" enhanced="true" language="en-AU">
    <Say voice="Polly.Nicole" language="en-AU">
      G'day! You've reached Fixit 24/7, Australia's emergency home services line. I'm Ally, your AI booking assistant. Go ahead and describe what's happening.
    </Say>
  </Gather>
  <Say voice="Polly.Nicole" language="en-AU">Sorry, I didn't catch that. Please call back and describe your issue.</Say>
  <Hangup/>
</Response>`;
}

export function buildResponseTwiML(message: string, webhookBase: string, isComplete: boolean): string {
  const base = webhookBase.replace(/\/$/, '');
  const cleanMessage = message.replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[c] ?? c));

  if (isComplete) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Nicole" language="en-AU">${cleanMessage}</Say>
  <Say voice="Polly.Nicole" language="en-AU">I've sent all the details to your phone. Stay safe, help is on the way!</Say>
  <Hangup/>
</Response>`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="${base}/api/voice/twilio/gather" method="POST"
    speechTimeout="auto" speechModel="phone_call" enhanced="true" language="en-AU">
    <Say voice="Polly.Nicole" language="en-AU">${cleanMessage}</Say>
  </Gather>
  <Say voice="Polly.Nicole" language="en-AU">Sorry, I didn't catch that. Can you say that again?</Say>
  <Redirect>${base}/api/voice/twilio/gather</Redirect>
</Response>`;
}

export function buildTransferTwiML(agentNumber: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Nicole" language="en-AU">
    I'm transferring you to one of our emergency coordinators right now. Please hold.
  </Say>
  <Dial>${agentNumber}</Dial>
</Response>`;
}

export function buildEmergencyTwiML(webhookBase: string): string {
  const base = webhookBase.replace(/\/$/, '');
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="${base}/api/voice/twilio/gather" method="POST"
    speechTimeout="auto" language="en-AU">
    <Say voice="Polly.Nicole" language="en-AU">
      This sounds extremely serious. Please call triple zero immediately if there is immediate danger to life.
      I'm alerting our emergency coordinator and dispatching help right now.
      Stay on the line if you can. Are you in a safe location right now?
    </Say>
  </Gather>
</Response>`;
}
