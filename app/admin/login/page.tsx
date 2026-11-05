import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/layout/Logo";
import { getSession } from "@/lib/auth-guards";
import { safeNext } from "@/lib/safe-redirect";
import photo from "@/public/images/login.jpg";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin log in",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const raw = (await searchParams).next;
  const next = safeNext(typeof raw === "string" ? raw : null);
  const session = await getSession();
  if (session?.user.role === "ADMIN") redirect(next);

  return (
    <main id="main" className="min-h-dvh md:grid md:grid-cols-2">
      <div className="relative hidden md:block">
        <Image
          src={photo}
          alt="MONTÈ black tank, worn by a model, seen from behind"
          fill
          preload
          sizes="50vw"
          placeholder="blur"
          className="object-cover"
        />
      </div>
      <div className="flex min-h-dvh flex-col px-4 py-6 md:px-10">
        <Logo className="w-40 md:w-48" sizes="(min-width: 768px) 192px, 160px" />
        <div className="mx-auto my-auto w-full max-w-sm py-12">
          <h1 className="mb-8 text-title uppercase">Admin log in</h1>
          <LoginForm next={next} />
        </div>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center text-meta uppercase text-muted hover:underline"
        >
          ← Back to shop
        </Link>
      </div>
    </main>
  );
}
