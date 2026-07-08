"use client";

import { useState, useCallback } from "react";
import { useEffect } from "react";

interface Stats {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  growthPercent: number;
  recentSignups: Array<{
    _id: string;
    email: string;
    subscribedAt: string;
    country: string | null;
    city: string | null;
  }>;
}

interface SubscriberRecord {
  _id: string;
  email: string;
  subscribedAt: string;
  ipAddress: string | null;
  country: string | null;
  city: string | null;
  userAgent: string | null;
  source: string;
  status: string;
}

interface SubscribersResponse {
  subscribers: SubscriberRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SubscriberParams {
  page: number;
  limit: number;
  search: string;
  sort: string;
  order: "asc" | "desc";
  from: string;
  to: string;
}

export function useStats() {
  const [data, setData] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/admin/stats");
        if (!res.ok) throw new Error("Failed to fetch stats");
        const json = await res.json();
        if (!cancelled) {
          setData(json);
          setError(null);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load stats.");
          setLoading(false);
        }
      }
    }

    load();

    const interval = setInterval(load, 30_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [refreshKey]);

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), []);

  return { data, loading, error, refetch };
}

export function useSubscribers(params: SubscriberParams) {
  const [data, setData] = useState<SubscribersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const { page, limit, search, sort, order, from, to } = params;

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      try {
        const qs = new URLSearchParams();
        qs.set("page", String(page));
        qs.set("limit", String(limit));
        if (search) qs.set("search", search);
        if (sort) qs.set("sort", sort);
        if (order) qs.set("order", order);
        if (from) qs.set("from", from);
        if (to) qs.set("to", to);

        const res = await fetch(`/api/admin/subscribers?${qs}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Failed to fetch subscribers");
        const json = await res.json();
        if (!cancelled) {
          setData(json);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        if (!cancelled) {
          setError("Failed to load subscribers.");
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [page, limit, search, sort, order, from, to, refreshKey]);

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), []);

  return { data, loading, error, refetch };
}
