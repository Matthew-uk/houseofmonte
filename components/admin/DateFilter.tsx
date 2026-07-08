"use client";

export function DateFilter({
  from,
  to,
  onFromChange,
  onToChange,
  onClear,
}: {
  from: string;
  to: string;
  onFromChange: (v: string) => void;
  onToChange: (v: string) => void;
  onClear: () => void;
}) {
  const hasFilter = from || to;

  return (
    <div className="flex items-center gap-2">
      <input
        type="date"
        value={from}
        onChange={(e) => onFromChange(e.target.value)}
        className="rounded-input border border-border-medium bg-bg-input px-3 py-2 text-tiny text-text-primary font-body focus-visible:border-transparent [color-scheme:dark]"
        aria-label="From date"
      />
      <span className="text-text-tertiary text-tiny">to</span>
      <input
        type="date"
        value={to}
        onChange={(e) => onToChange(e.target.value)}
        className="rounded-input border border-border-medium bg-bg-input px-3 py-2 text-tiny text-text-primary font-body focus-visible:border-transparent [color-scheme:dark]"
        aria-label="To date"
      />
      {hasFilter && (
        <button
          onClick={onClear}
          className="text-tiny uppercase tracking-wider text-text-secondary transition-colors hover:text-text-primary cursor-pointer"
        >
          Clear
        </button>
      )}
    </div>
  );
}
