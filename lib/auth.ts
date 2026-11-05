import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { getMongoClient } from "@/lib/db";

// Admin-only for now: customer accounts and checkout are out of scope, so
// public sign-up is disabled and the only accounts come from scripts/seed.ts.

const client = getMongoClient();

// Never derive the origin from the request Host header.
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
