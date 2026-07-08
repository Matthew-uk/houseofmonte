"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BRAND } from "@/lib/constants";
import { Spinner } from "@/components/ui/Spinner";

export function Sidebar() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
    } catch {
      setLoggingOut(false);
    }
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[220px] flex-col border-r border-border-subtle bg-bg-card max-lg:hidden">
      <div className="flex h-16 items-center justify-center border-b border-border-subtle">
        <span className="font-display text-[1rem] tracking-wider text-gold">
          {BRAND}
        </span>
      </div>

      <nav className="flex-1 px-3 py-4">
        <a
          href="/admin"
          className="flex items-center gap-3 rounded-button px-3 py-2.5 text-tiny uppercase tracking-wider text-text-primary transition-colors duration-200 hover:bg-bg-card-elevated"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gold"
            aria-hidden
          >
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          Overview
        </a>
      </nav>

      <div className="border-t border-border-subtle px-3 py-4">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-button px-3 py-2.5 text-tiny uppercase tracking-wider text-text-secondary transition-colors duration-200 hover:text-text-primary hover:bg-bg-card-elevated disabled:opacity-50 cursor-pointer"
        >
          {loggingOut ? (
            <Spinner className="text-text-secondary" />
          ) : (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          )}
          Sign Out
        </button>
      </div>
    </aside>
  );
}
