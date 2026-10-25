import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-guards";
import { safeNext } from "@/lib/safe-redirect";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Log in",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const next = safeNext((await searchParams).next);
  if (await getSession()) redirect(next);

  return (
    <section className="mx-auto w-full max-w-sm px-3 py-16">
      <h1 className="mb-8 text-title uppercase">Log in</h1>
      <LoginForm next={next} />
    </section>
  );
}
