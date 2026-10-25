import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth, type Session } from "@/lib/auth";

// Server-side authorisation. proxy.ts only does an optimistic cookie check;
// every admin page, server action and route handler must call these.

export const getSession = cache(async (): Promise<Session | null> => {
  return auth.api.getSession({ headers: await headers() });
});

export async function requireUser(next = "/account"): Promise<Session> {
  const session = await getSession();
  if (!session) redirect(`/account/login?next=${encodeURIComponent(next)}`);
  return session;
}

/** For admin pages: redirects anonymous users to login, others to home. */
export async function requireAdminPage(next = "/admin"): Promise<Session> {
  const session = await requireUser(next);
  if (session.user.role !== "ADMIN") redirect("/");
  return session;
}

export class ForbiddenError extends Error {
  constructor() {
    super("Forbidden");
  }
}

/** For server actions / route handlers: throws instead of redirecting. */
export async function requireAdmin(): Promise<Session> {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") throw new ForbiddenError();
  return session;
}
