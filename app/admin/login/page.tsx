import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary px-5">
      <div className="w-full max-w-[380px]">
        <div className="mb-10 text-center">
          <p className="font-display text-[1.5rem] tracking-wide text-gold">
            {BRAND}
          </p>
          <div className="mx-auto mt-3 h-px w-10 bg-border-medium" />
          <p className="mt-3 text-tiny uppercase tracking-wider text-text-tertiary">
            Administration
          </p>
        </div>

        <div className="rounded-card border border-border-subtle bg-bg-card p-8">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-tiny text-text-tertiary">
          &copy; {BRAND} 2026
        </p>
      </div>
    </div>
  );
}
