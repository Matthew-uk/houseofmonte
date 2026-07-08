"use client";

export function TablePagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (p: number) => void;
}) {
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  if (total === 0) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <p className="text-tiny text-text-secondary">
        Showing {start}&ndash;{end} of {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="rounded-button border border-border-medium px-3 py-1.5 text-tiny uppercase tracking-wider text-text-secondary transition-colors hover:text-text-primary hover:border-border-gold disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        >
          Prev
        </button>
        <span className="px-3 text-tiny text-text-secondary">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="rounded-button border border-border-medium px-3 py-1.5 text-tiny uppercase tracking-wider text-text-secondary transition-colors hover:text-text-primary hover:border-border-gold disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}
