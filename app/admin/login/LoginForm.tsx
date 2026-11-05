"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Field } from "@/components/forms/Field";
import { Button } from "@/components/forms/Button";

// Only a credentials failure may read as a wrong password, or a broken deploy
// sends the admin chasing a password that was never checked.
function loginErrorMessage(error: { status: number; code?: string }) {
  if (error.status === 429) return "Too many attempts. Try again in a minute.";
  if (error.code === "INVALID_ORIGIN") return "Logging in isn't allowed from this address.";
  if (error.status >= 500) return "Something went wrong on our side. Try again.";
  return "Email or password is incorrect.";
}

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      setError(loginErrorMessage(error));
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
        type={showPassword ? "text" : "password"}
        autoComplete="current-password"
        required
        trailing={
          <button
            type="button"
            aria-pressed={showPassword}
            aria-label="Show password"
            onClick={() => setShowPassword((s) => !s)}
            className="h-full px-3 text-meta uppercase hover:underline"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        }
      />
      {error && (
        <p role="alert" className="text-body text-accent">
          {error}
        </p>
      )}
      <Button type="submit" disabled={pending} className="mt-2">
        {pending ? "Logging in…" : "Log in"}
      </Button>
    </form>
  );
}
