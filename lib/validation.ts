const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;

export function validateEmail(
  raw: unknown,
): { valid: true; email: string } | { valid: false; error: string } {
  if (typeof raw !== "string") {
    return { valid: false, error: "Email is required." };
  }

  const email = raw.trim().toLowerCase();

  if (!email) {
    return { valid: false, error: "Email is required." };
  }

  if (email.length > MAX_EMAIL_LENGTH) {
    return { valid: false, error: "Email address is too long." };
  }

  if (/[\0<>\r\n]/.test(email)) {
    return { valid: false, error: "Please enter a valid email address." };
  }

  if (!EMAIL_RE.test(email)) {
    return { valid: false, error: "Please enter a valid email address." };
  }

  return { valid: true, email };
}
