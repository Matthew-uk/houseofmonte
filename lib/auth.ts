import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { getMongoClient } from "@/lib/db";
import { sendEmail } from "@/lib/email/send";
import { resetPassword, verifyEmail } from "@/lib/email/templates";

export const ROLES = ["CUSTOMER", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

const client = getMongoClient();

// Never derive the origin from the request Host header: reset/verify links are
// built from it, so a spoofed Host could send tokens to another domain.
const baseURL = process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_SITE_URL;
if (!baseURL && process.env.NODE_ENV === "production") {
  throw new Error("BETTER_AUTH_URL (or NEXT_PUBLIC_SITE_URL) must be set in production");
}

export const auth = betterAuth({
  appName: "MONTÈ",
  baseURL,
  // Passing the client enables transactions (Atlas is a replica set).
  database: mongodbAdapter(client.db(), { client }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    // Verification gates order-history linking (BUILD_SPEC §3.7), not login.
    requireEmailVerification: false,
    resetPasswordTokenExpiresIn: 60 * 60,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      // Not awaited: equal response time whether or not the email exists.
      void sendEmail({ to: user.email, ...resetPassword(url) }).catch((err) =>
        console.error("[auth] reset email failed:", err instanceof Error ? err.message : err),
      );
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      void sendEmail({ to: user.email, ...verifyEmail(url) }).catch((err) =>
        console.error("[auth] verify email failed:", err instanceof Error ? err.message : err),
      );
    },
  },

  user: {
    additionalFields: {
      role: {
        type: [...ROLES],
        required: false,
        defaultValue: "CUSTOMER",
        input: false, // never settable from sign-up or update-user
      },
      phone: { type: "string", required: false },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },

  rateLimit: {
    enabled: true,
    storage: "database", // serverless: memory isn't shared between instances
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
      "/sign-up/email": { window: 60, max: 5 },
      "/request-password-reset": { window: 300, max: 3 },
      "/send-verification-email": { window: 300, max: 3 },
    },
  },

  plugins: [nextCookies()], // must stay last
});

export type Session = typeof auth.$Infer.Session;
