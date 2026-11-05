import type { Metadata } from "next";
import Link from "next/link";
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
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/face-of-monte", label: "Face of MONTÈ" },
  { href: "/admin/settings", label: "Settings" },
];

// Plain admin shell (BUILD_SPEC §4). The role check here protects every admin
// page; server actions still call requireAdmin() themselves.
export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await requireAdminPage();

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[200px_1fr]">
      <aside className="border-b border-line px-4 py-4 md:min-h-dvh md:border-r md:border-b-0">
        <Link href="/admin" className="text-ui font-medium uppercase">
          MONTÈ Admin
        </Link>
        <nav aria-label="Admin" className="mt-4">
          <ul className="flex flex-wrap gap-x-4 md:flex-col">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="inline-flex min-h-9 items-center text-body hover:underline"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-6 text-meta text-muted">
          <p className="truncate">{session.user.email}</p>
          <SignOutButton />
        </div>
      </aside>
      <main id="main" className="px-4 py-6 md:px-8">
        {children}
      </main>
    </div>
  );
}
