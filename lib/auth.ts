import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { getMongoClient } from "@/lib/db";

// Admin-only for now: customer accounts and checkout are out of scope, so
// public sign-up is disabled and the only accounts come from scripts/seed.ts.

// Vercel previews each get their own URL, so a single BETTER_AUTH_URL can't serve
// them. These come from the platform, never from the request's Host header.
const vercelOrigins = [process.env.VERCEL_BRANCH_URL, process.env.VERCEL_URL]
  .filter(Boolean)
  .map((host) => `https://${host}`);
const isPreview = process.env.VERCEL_ENV === "preview";

const baseURL =
  (isPreview ? vercelOrigins[0] : undefined) ??
  process.env.BETTER_AUTH_URL ??
  process.env.NEXT_PUBLIC_SITE_URL;

// Fail the build with every missing name at once: a deploy without these looks
// healthy but can't log anyone in.
if (process.env.NODE_ENV === "production") {
  const missing = [
    !process.env.MONGODB_URI && "MONGODB_URI",
    !process.env.BETTER_AUTH_SECRET && "BETTER_AUTH_SECRET",
    !baseURL && "BETTER_AUTH_URL",
  ].filter(Boolean);
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(", ")} (see docs/env.md)`);
  }
}

const client = getMongoClient();

export const auth = betterAuth({
  appName: "MONTÈ",
  baseURL,
  trustedOrigins: isPreview ? vercelOrigins : [],
  // Passing the client enables transactions (Atlas is a replica set).
  database: mongodbAdapter(client.db(), { client }),

  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },

  user: {
    additionalFields: {
      role: {
        type: ["CUSTOMER", "ADMIN"],
        required: false,
        defaultValue: "CUSTOMER",
        input: false, // never settable through the API
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },

  rateLimit: {
    enabled: true,
    storage: "database", // serverless: memory isn't shared between instances
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
    },
  },

  plugins: [nextCookies()], // must stay last
});

export type Session = typeof auth.$Infer.Session;
