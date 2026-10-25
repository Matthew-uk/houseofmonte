// Money is always integer kobo (₦1 = 100 kobo). Format only at the edge.

const naira = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function assertKobo(value: number): number {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`Invalid kobo amount: ${value}`);
  }
  return value;
}

/** 4500000 -> "₦45,000" */
export function formatNaira(kobo: number): string {
  return naira.format(Math.round(assertKobo(kobo) / 100));
}

/** Admin input in naira (e.g. "45,000" or 45000) -> kobo. Whole naira only. */
export function nairaToKobo(input: string | number): number {
  const n =
    typeof input === "number" ? input : Number(String(input).replace(/[,\s₦]/g, ""));
  if (!Number.isFinite(n) || n < 0) throw new Error(`Invalid naira amount: ${input}`);
  return assertKobo(Math.round(n * 100));
}
