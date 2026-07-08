"use client";

import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import { SkeletonCard } from "@/components/ui/SkeletonCard";

interface StatsData {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  growthPercent: number;
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: { value: number; label: string };
}) {
  const animated = useAnimatedCounter(value);

  return (
    <div className="rounded-card border border-border-subtle bg-bg-card p-6 transition-colors duration-200 hover:border-border-medium">
      <p className="text-tiny uppercase tracking-wider text-text-secondary">
        {label}
      </p>
      <p className="mt-3 font-display text-[2rem] font-medium leading-none text-white">
        {animated.toLocaleString()}
      </p>
      {accent && (
        <p
          className={`mt-2 text-tiny tracking-wider ${accent.value > 0 ? "text-gold" : accent.value < 0 ? "text-text-secondary" : "text-text-tertiary"}`}
        >
          {accent.value > 0 ? "+" : ""}
          {accent.value}% {accent.label}
        </p>
      )}
    </div>
  );
}

export function StatsCards({
  data,
  loading,
}: {
  data: StatsData | null;
  loading: boolean;
}) {
  if (loading || !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Subscribers"
        value={data.total}
        accent={{ value: data.growthPercent, label: "vs last month" }}
      />
      <StatCard label="Today" value={data.today} />
      <StatCard label="This Week" value={data.thisWeek} />
      <StatCard label="This Month" value={data.thisMonth} />
    </div>
  );
}
