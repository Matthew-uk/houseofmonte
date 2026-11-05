"use client";

import { useRef, useState } from "react";
import { FaRegEnvelope } from "react-icons/fa6";
import { Button } from "@/components/forms/Button";
import { SOCIAL } from "@/lib/constants";

export interface SizeOption {
  id: string;
  size: string;
  available: number;
  lowAt: number;
}

function availabilityLine(selected: SizeOption | undefined, anyInStock: boolean) {
  if (!anyInStock || selected?.available === 0) return { text: "Sold out", accent: true };
  if (selected && selected.available <= selected.lowAt) {
    return { text: `Low stock — ${selected.available} left`, accent: false };
  }
  return { text: "In stock", accent: false };
}

// Size radiogroup (arrow keys move between sizes) and the call to action. With
// checkout out of scope for now, buying happens by email: ENQUIRE stands in for
// ADD TO CART and carries the chosen product, colour and size.
export function SizePicker({
  productName,
  colorName,
  sizes,
}: {
  productName: string;
  colorName: string;
  sizes: SizeOption[];
}) {
  const inStock = sizes.filter((s) => s.available > 0);
  const [selectedId, setSelectedId] = useState<string | null>(
    inStock.length === 1 && sizes.length === 1 ? inStock[0].id : null,
  );
  const group = useRef<HTMLDivElement>(null);
  const selected = sizes.find((s) => s.id === selectedId);
  const line = availabilityLine(selected, inStock.length > 0);

  function onKeyDown(e: React.KeyboardEvent, id: string) {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step || inStock.length === 0) return;
    e.preventDefault();
    const at = inStock.findIndex((s) => s.id === id);
    const next = inStock[(at + step + inStock.length) % inStock.length];
    setSelectedId(next.id);
    group.current?.querySelector<HTMLElement>(`[data-size="${next.id}"]`)?.focus();
  }

  const subject = `${productName} — ${colorName} / ${selected?.size ?? ""}`;
  const focusable = selectedId ?? inStock[0]?.id;

  return (
    <>
      <div ref={group} role="radiogroup" aria-label="Size" className="mt-6 flex flex-wrap gap-1">
        {sizes.map((s) => {
          const out = s.available === 0;
          const isSelected = s.id === selectedId;
          return (
            <button
              key={s.id}
              type="button"
              role="radio"
              data-size={s.id}
              aria-checked={isSelected}
              aria-disabled={out || undefined}
              tabIndex={s.id === focusable ? 0 : -1}
              onClick={() => !out && setSelectedId(s.id)}
              onKeyDown={(e) => onKeyDown(e, s.id)}
              className={`min-h-11 min-w-11 border px-3 text-ui uppercase ${
                isSelected
                  ? "border-fg bg-fg text-inverse"
                  : out
                    ? "cursor-not-allowed border-line text-muted line-through"
                    : "border-line hover:border-fg"
              }`}
            >
              {s.size}
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className={`mt-3 text-meta uppercase ${line.accent ? "text-accent" : ""}`}>
        {line.text}
      </p>

      {/* Sticky on mobile so the action stays in reach of the thumb. */}
      <div className="sticky bottom-0 z-10 -mx-3 mt-4 bg-bg px-3 py-2 pb-[max(8px,env(safe-area-inset-bottom))] md:static md:mx-0 md:px-0">
        {inStock.length === 0 || selected?.available === 0 ? (
          <Button disabled>Sold out</Button>
        ) : !selected ? (
          <Button disabled>Select a size</Button>
        ) : (
          <a
            href={`mailto:${SOCIAL.email}?subject=${encodeURIComponent(subject)}`}
            className="inline-flex h-12 w-full items-center justify-center gap-2 bg-fg px-6 text-ui font-medium uppercase text-inverse transition-opacity duration-150 hover:opacity-85"
          >
            <FaRegEnvelope aria-hidden className="size-3.5" />
            Enquire by email
          </a>
        )}
      </div>
    </>
  );
}
