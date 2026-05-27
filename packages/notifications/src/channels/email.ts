import { Resend } from 'resend';
import type { NotifData } from '../templates';

const FROM = process.env['EMAIL_FROM'] ?? 'noreply@fixit247.com.au';
const APP_URL = process.env['NEXT_PUBLIC_APP_URL'] ?? 'https://fixit247.com.au';

let _resend: Resend | undefined;
function getResend(): Resend {
  _resend ??= new Resend(process.env['RESEND_API_KEY'] ?? '');
  return _resend;
}

export async function sendEmailNotification(opts: {
  to: string;
  title: string;
  subject?: string;
  body: string;
  type: string;
  data: NotifData;
}): Promise<void> {
  await getResend().emails.send({
    from: FROM,
    to: opts.to,
    subject: opts.subject ?? opts.title,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <div style="background:#0F172A;padding:20px;border-radius:8px 8px 0 0;">
          <h1 style="color:white;margin:0;font-size:20px;">Fixit 24/7</h1>
        </div>
        <div style="background:#F8FAFC;padding:24px;border-radius:0 0 8px 8px;border:1px solid #E2E8F0;">
          <h2 style="color:#1E293B;margin-top:0;">${opts.title}</h2>
          <p style="color:#475569;line-height:1.6;">${opts.body}</p>
          <a href="${APP_URL}" style="display:inline-block;background:#2563EB;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;margin-top:16px;">Open Fixit247</a>
        </div>
        <p style="text-align:center;color:#94A3B8;font-size:12px;margin-top:16px;">Fixit247 · Australia</p>
      </div>
    `,
  });
}
