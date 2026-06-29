/** Contact lifecycle statuses for enrollment submissions. */
export const STATUSES: { value: string; label: string; color: string }[] = [
  { value: "new", label: "New", color: "#6d3fce" },
  { value: "contacted", label: "Contacted", color: "#2c5a9e" },
  { value: "enrolled", label: "Enrolled", color: "#1f9d6b" },
  { value: "ineligible", label: "Not eligible", color: "#9a8aa8" },
  { value: "declined", label: "Declined", color: "#d23b4e" },
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
