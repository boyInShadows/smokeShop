// Persian number formatting helpers. Deterministic (SSR-safe: same output on
// server and client, so no hydration mismatch).

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"] as const;

/** Convert Latin digits in a string/number to Persian digits. */
export function toFaDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]);
}

/** Format a Toman price with thousands separators and Persian digits. */
export function formatToman(amount: number): string {
  const grouped = amount.toLocaleString("en-US"); // stable grouping
  return `${toFaDigits(grouped)} تومان`;
}
