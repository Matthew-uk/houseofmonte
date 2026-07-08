import { getTransporter } from "./transporter";
import { buildWelcomeEmail } from "./templates/welcome";

export async function sendWelcomeEmail(to: string): Promise<void> {
  try {
    const { subject, html, text } = buildWelcomeEmail();
    const transporter = getTransporter();

    await transporter.sendMail({
      from: process.env.EMAIL_FROM ?? "Monte Deluxe <hello@montedeluxe.com>",
      to,
      subject,
      html,
      text,
    });
    console.log(transporter);
    console.log("Mail sent /send.ts")
  } catch (err) {
    console.error("Failed to send welcome email:", err);
  }
}
