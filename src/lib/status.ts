/** Contact lifecycle statuses for enrollment submissions. */
export const STATUSES: { value: string; label: string; color: string }[] = [
  { value: "new", label: "New", color: "#6d3fce" },
  { value: "eligible", label: "Eligible", color: "#2c5a9e" },
  { value: "approved", label: "Approved", color: "#1f9d6b" },
  { value: "not_eligible", label: "Not eligible", color: "#d23b4e" },
];

export const STATUS_VALUES = STATUSES.map((s) => s.value);
export const DEFAULT_STATUS = "new";

const BY_VALUE = new Map(STATUSES.map((s) => [s.value, s]));
export function statusLabel(v: string): string {
  return BY_VALUE.get(v)?.label ?? v;
}
export function statusColor(v: string): string {
  return BY_VALUE.get(v)?.color ?? "#6f6385";
}
