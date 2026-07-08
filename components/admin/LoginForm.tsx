"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/Spinner";
import axios from "axios";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

    //   const res2 = await axios.post("/api/admin/login", {email, password})
    //   console.log(res2)

      const data = await res.json();

      if (res.ok) {
        router.push("/admin");
      } else {
        setError(data.message ?? "Invalid credentials.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="admin-email"
          className="block text-tiny uppercase tracking-wider text-text-secondary mb-2"
        >
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          disabled={loading}
          className="w-full rounded-input border border-border-medium bg-bg-input px-4 py-3 text-small text-text-primary placeholder:text-text-tertiary tracking-wider font-body focus-visible:border-transparent disabled:opacity-50"
          placeholder="admin@montedeluxe.com"
        />
      </div>

      <div>
        <label
          htmlFor="admin-password"
          className="block text-tiny uppercase tracking-wider text-text-secondary mb-2"
        >
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          disabled={loading}
          className="w-full rounded-input border border-border-medium bg-bg-input px-4 py-3 text-small text-text-primary placeholder:text-text-tertiary tracking-wider font-body focus-visible:border-transparent disabled:opacity-50"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <p className="text-small text-gold-muted text-center">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-button border border-gold bg-gold text-bg-primary py-3 text-small font-body uppercase tracking-wider transition-all duration-300 hover:bg-gold-bright disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Spinner className="text-bg-primary" />
            <span>Signing in</span>
          </span>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
}
