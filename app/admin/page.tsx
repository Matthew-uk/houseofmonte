"use client";

import { useStats } from "@/hooks/useAdminData";
import { StatsCards } from "@/components/admin/StatsCards";
import { SubscribersTable } from "@/components/admin/SubscribersTable";

export default function AdminDashboard() {
  const { data: stats, loading: statsLoading, refetch: refetchStats } = useStats();

  return (
    <>
      <div className="mb-8">
        <h1 className="font-display text-[1.35rem] font-medium text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-tiny uppercase tracking-wider text-text-secondary">
          Waitlist overview
        </p>
      </div>

      <StatsCards data={stats} loading={statsLoading} />

      <SubscribersTable onDataChange={refetchStats} />
    </>
  );
}
