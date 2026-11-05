import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { requireAdminPage } from "@/lib/auth-guards";
import { SignOutButton } from "./SignOutButton";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s — Admin — MONTÈ" },
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/collections", label: "Collections" },
];

// Plain admin shell (BUILD_SPEC §4). The check here gates the shell; each page
// and server action still calls its own guard.
export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await requireAdminPage();

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[200px_minmax(0,1fr)]">
      <aside className="border-b border-line px-4 py-4 md:min-h-dvh md:border-r md:border-b-0">
        <Logo href="/admin" label="MONTÈ admin — dashboard" className="w-32" sizes="128px" />
        <p className="mt-2 text-meta uppercase text-muted">Admin</p>
        <nav aria-label="Admin" className="mt-3">
          <ul className="flex flex-wrap gap-x-4 md:flex-col">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="inline-flex min-h-11 items-center text-body hover:underline">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/" className="inline-flex min-h-11 items-center text-body hover:underline">
                View shop
              </Link>
            </li>
          </ul>
        </nav>
        <div className="mt-4 text-meta text-muted">
          <p className="truncate">{session.user.email}</p>
          <SignOutButton />
        </div>
      </aside>
      <main id="main" className="min-w-0 px-4 py-6 md:px-8">
        {children}
      </main>
    </div>
  );
}
