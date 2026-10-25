import type { EmailMessage } from "@/lib/email/send";

// Plain, text-first emails (DESIGN.md: no decoration). Each returns the
// subject/body; the caller supplies `to`.

type Template = Omit<EmailMessage, "to">;

export function verifyEmail(url: string): Template {
  return {
    subject: "Confirm your email — MONTÈ",
    text: `Confirm your email address for your MONTÈ account:\n\n${url}\n\nIf you didn't create an account, ignore this email.`,
  };
}

export function resetPassword(url: string): Template {
  return {
    subject: "Reset your password — MONTÈ",
    text: `Use this link to set a new password. It expires in 1 hour.\n\n${url}\n\nIf you didn't ask for this, ignore this email — your password stays the same.`,
  };
}
