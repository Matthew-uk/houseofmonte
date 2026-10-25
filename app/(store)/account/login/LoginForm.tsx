"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Field } from "@/components/forms/Field";
import { Button } from "@/components/forms/Button";

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setPending(true);
    setError(null);
    const { error } = await authClient.signIn.email({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    });
    if (error) {
      setPending(false);
      setError(
        error.status === 429
          ? "Too many attempts. Try again in a minute."
          : "Email or password is incorrect.",
      );
      return;
    }
    router.replace(next);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <Field label="Email" name="email" type="email" autoComplete="email" required />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />
      {error && (
        <p role="alert" className="text-meta text-accent">
          {error}
        </p>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? "…" : "Log in"}
      </Button>
      <div className="flex justify-between text-meta uppercase">
        <Link href="/account/forgot-password" className="inline-flex min-h-11 items-center hover:underline">
          Forgot password
        </Link>
        <Link
          href={`/account/register?next=${encodeURIComponent(next)}`}
          className="inline-flex min-h-11 items-center hover:underline"
        >
          Create account
        </Link>
      </div>
    </form>
  );
}
