"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EmailSignup() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });

      const data = await res.json();

      if (res.status === 201) {
        setDone(true);
        toast.success("Welcome to MONTÈ. Check your inbox.");
      } else if (res.status === 200 && data.status === "exists") {
        setDone(true);
        toast(
          "You’re already on the list. We’ll let you know when Collection 001 launches.",
        );
      } else if (res.status === 429) {
        setError("Too many requests. Please try again later.");
      } else {
        setError(data.message ?? "Something went wrong.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[520px] rounded-card border border-border-medium bg-black/45 px-6 py-8 sm:px-10 sm:py-10 shadow-[0_0_60px_rgba(201,168,76,0.08)]">
      <h2 className="text-center font-display text-section font-semibold uppercase tracking-wide text-white">
        Join the List
      </h2>

      {done ? (
        <p className="mt-6 text-center text-body uppercase tracking-wide text-gold">
          You&rsquo;re on the list.
        </p>
      ) : (
        <>
          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-6 flex flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="signup-email" className="sr-only">
              Email Address
            </label>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              autoComplete="email"
              disabled={submitting}
              className="min-w-0 flex-1 rounded-input border border-border-medium bg-bg-input px-4 py-3 text-small text-text-primary placeholder:text-gold tracking-wider focus-visible:border-transparent font-montserrat disabled:opacity-50"
            />
            <Button
              type="submit"
              variant="outline"
              className="shrink-0 cursor-pointer"
              disabled={submitting}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Spinner className="text-gold" />
                  <span>Sending</span>
                </span>
              ) : (
                "Notify Me"
              )}
            </Button>
          </form>
          {error && (
            <p className="mt-3 text-center text-small text-gold-muted">
              {error}
            </p>
          )}
          <p className="mt-5 text-center text-small text-text-secondary font-bodoni">
            Receive first access to Collection 001, event tickets and exclusive
            drops.
          </p>
        </>
      )}
    </div>
  );
}
