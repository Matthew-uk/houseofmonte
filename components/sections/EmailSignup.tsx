"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { SIGNUP_STORAGE_KEY } from "@/lib/constants";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EmailSignup() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    // Demo persistence: append to a localStorage list (deduped).
    try {
      const raw = localStorage.getItem(SIGNUP_STORAGE_KEY);
      const list: string[] = raw ? JSON.parse(raw) : [];
      if (!list.includes(value)) list.push(value);
      localStorage.setItem(SIGNUP_STORAGE_KEY, JSON.stringify(list));
    } catch {
      /* localStorage unavailable — non-fatal for the demo */
    }
    console.log("MONTÉ signup:", value);
    setDone(true);
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
              className="min-w-0 flex-1 rounded-input border border-border-medium bg-bg-input px-4 py-3 text-small text-text-primary placeholder:text-gold tracking-wider focus-visible:border-transparent font-montserrat"
            />
            <Button type="submit" variant="outline" className="shrink-0 cursor-pointer">
              Notify Me
            </Button>
          </form>
          {error && (
            <p className="mt-3 text-center text-small text-gold-muted">{error}</p>
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
