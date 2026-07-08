"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/admin/Sidebar";
import { MobileAdminHeader } from "@/components/admin/MobileAdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Sidebar />
      <MobileAdminHeader />
      <main className="lg:ml-[220px]">
        <div className="mx-auto max-w-[1200px] px-5 py-8 sm:px-8 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
