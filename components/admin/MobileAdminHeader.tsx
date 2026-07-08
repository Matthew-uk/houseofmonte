"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BRAND } from "@/lib/constants";

export function MobileAdminHeader() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border-subtle bg-bg-card/80 px-5 backdrop-blur-md lg:hidden">
      <span className="font-display text-[0.9rem] tracking-wider text-gold">
        {BRAND}
      </span>

      <button
        onClick={() => setOpen(!open)}
        className="flex h-8 w-8 items-center justify-center rounded-button text-text-secondary transition-colors hover:text-text-primary cursor-pointer"
        aria-label="Menu"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden
        >
          {open ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-14 border-b border-border-subtle bg-bg-card/95 px-5 py-4 backdrop-blur-md">
          <a
            href="/admin"
            onClick={() => setOpen(false)}
            className="block py-2 text-tiny uppercase tracking-wider text-text-primary transition-colors hover:text-gold"
          >
            Overview
          </a>
          <button
            onClick={handleLogout}
            className="mt-2 block w-full py-2 text-left text-tiny uppercase tracking-wider text-text-secondary transition-colors hover:text-text-primary cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      )}
    </header>
  );
}
