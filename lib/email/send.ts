import { Resend } from "resend";

export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

let client: Resend | null = null;

function resend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  client ??= new Resend(key);
  return client;
}

// Sends through Resend. Without RESEND_API_KEY in development, the message is
// printed instead so auth flows can be tested locally; in production a missing
// key is an error.
export async function sendEmail(msg: EmailMessage): Promise<void> {
  const r = resend();
  if (!r) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("RESEND_API_KEY is not set");
    }
    console.info(`[email:dev] to=${msg.to} subject="${msg.subject}"\n${msg.text}`);
    return;
  }

  const { error } = await r.emails.send({
    from: process.env.EMAIL_FROM ?? "MONTÈ <hello@montedeluxe.com>",
    to: msg.to,
    subject: msg.subject,
    text: msg.text,
    ...(msg.html && { html: msg.html }),
  });
  if (error) {
    throw new Error(`Resend: ${error.name} — ${error.message}`);
  }
}
