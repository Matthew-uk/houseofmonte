"use client";

import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";
import { useSubscribers, type SubscriberParams } from "@/hooks/useAdminData";
import { SearchBar } from "./SearchBar";
import { DateFilter } from "./DateFilter";
import { TablePagination } from "./TablePagination";
import { ExportButton } from "./ExportButton";
import { EmptyState } from "./EmptyState";
import { SkeletonRow } from "@/components/ui/SkeletonCard";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function SubscribersTable({
  onDataChange,
}: {
  onDataChange?: () => void;
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("subscribedAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const params: SubscriberParams = useMemo(
    () => ({
      page,
      limit: 20,
      search: debouncedSearch,
      sort,
      order,
      from,
      to,
    }),
    [page, debouncedSearch, sort, order, from, to],
  );

  const { data, loading, refetch } = useSubscribers(params);

  const toggleSort = useCallback(
    (field: string) => {
      if (sort === field) {
        setOrder((o) => (o === "asc" ? "desc" : "asc"));
      } else {
        setSort(field);
        setOrder("desc");
      }
      setPage(1);
    },
    [sort],
  );

  const toggleSelect = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    if (!data) return;
    const ids = data.subscribers.map((s) => s._id);
    setSelected((prev) => {
      const allSelected = ids.every((id) => prev.has(id));
      if (allSelected) return new Set();
      return new Set(ids);
    });
  }, [data]);

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/subscribers/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Subscriber removed.");
        setSelected((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        refetch();
        onDataChange?.();
      }
    } catch {
      toast.error("Failed to delete subscriber.");
    } finally {
      setDeleting(null);
    }
  }

  async function handleBulkDelete() {
    if (selected.size === 0) return;
    const ids = Array.from(selected);
    try {
      const res = await fetch("/api/admin/subscribers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (res.ok) {
        const result = await res.json();
        toast.success(`${result.deleted} subscriber${result.deleted === 1 ? "" : "s"} removed.`);
        setSelected(new Set());
        refetch();
        onDataChange?.();
      }
    } catch {
      toast.error("Failed to delete subscribers.");
    }
  }

  function copyEmail(email: string) {
    navigator.clipboard.writeText(email).then(() => {
      toast("Email copied.");
    });
  }

  const allOnPageSelected =
    data && data.subscribers.length > 0 && data.subscribers.every((s) => selected.has(s._id));

  function sortIcon(field: string) {
    const active = sort === field;
    return (
      <span className={`ml-1 inline-block text-[10px] ${active ? "text-gold" : "text-text-tertiary"}`}>
        {active ? (order === "asc" ? "↑" : "↓") : "↕"}
      </span>
    );
  }

  return (
    <div className="mt-8 rounded-card border border-border-subtle bg-bg-card overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-border-subtle px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:max-w-[260px]">
            <SearchBar
              value={search}
              onChange={(v) => {
                setSearch(v);
                setPage(1);
              }}
            />
          </div>
          <DateFilter
            from={from}
            to={to}
            onFromChange={(v) => {
              setFrom(v);
              setPage(1);
            }}
            onToChange={(v) => {
              setTo(v);
              setPage(1);
            }}
            onClear={() => {
              setFrom("");
              setTo("");
              setPage(1);
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          {selected.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="rounded-button border border-gold-muted px-3 py-2 text-tiny uppercase tracking-wider text-gold-muted transition-colors hover:bg-gold-muted/10 cursor-pointer"
            >
              Delete {selected.size}
            </button>
          )}
          <ExportButton />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-border-subtle">
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={!!allOnPageSelected}
                  onChange={toggleAll}
                  className="rounded accent-gold cursor-pointer"
                  aria-label="Select all"
                />
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => toggleSort("email")}
                  className="text-tiny uppercase tracking-wider text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                >
                  Email
                  {sortIcon("email")}
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => toggleSort("subscribedAt")}
                  className="text-tiny uppercase tracking-wider text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                >
                  Joined
                  {sortIcon("subscribedAt")}
                </button>
              </th>
              <th className="px-4 py-3 text-left text-tiny uppercase tracking-wider text-text-secondary">
                Location
              </th>
              <th className="w-20 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5}>
                      <SkeletonRow />
                    </td>
                  </tr>
                ))
              : data?.subscribers.map((sub) => (
                  <tr
                    key={sub._id}
                    className="border-b border-border-subtle transition-colors hover:bg-bg-card-elevated group"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(sub._id)}
                        onChange={() => toggleSelect(sub._id)}
                        className="rounded accent-gold cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-small text-text-primary">
                        {sub.email}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-small text-text-secondary">
                      {formatDate(sub.subscribedAt)}
                    </td>
                    <td className="px-4 py-3 text-small text-text-secondary">
                      {[sub.city, sub.country].filter(Boolean).join(", ") ||
                        "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => copyEmail(sub.email)}
                          className="rounded-button p-1.5 text-text-tertiary transition-colors hover:text-text-primary hover:bg-bg-card cursor-pointer"
                          aria-label="Copy email"
                          title="Copy email"
                        >
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden
                          >
                            <rect
                              x="9"
                              y="9"
                              width="13"
                              height="13"
                              rx="2"
                            />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(sub._id)}
                          disabled={deleting === sub._id}
                          className="rounded-button p-1.5 text-text-tertiary transition-colors hover:text-gold-muted hover:bg-bg-card disabled:opacity-50 cursor-pointer"
                          aria-label="Delete subscriber"
                          title="Delete"
                        >
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {!loading && data && data.subscribers.length === 0 && (
        <EmptyState
          title={search ? "No results found" : "No subscribers yet"}
          description={
            search
              ? "Try a different search term."
              : "Subscribers will appear here once people join the waitlist."
          }
        />
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="border-t border-border-subtle">
          <TablePagination
            page={data.page}
            totalPages={data.totalPages}
            total={data.total}
            limit={data.limit}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
