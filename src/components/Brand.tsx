import { Logo } from "@/components/Logo";

/** LOOM mark with a small "Rockland" sublabel. */
export function Brand({
  height = 30,
  tone = "deep",
}: {
  height?: number;
  tone?: "deep" | "white";
}) {
  return (
    <span className="brand-lock">
      <Logo variant="mark" tone={tone} height={height} />
      <span className={`brand-rockland ${tone}`}>Rockland</span>
    </span>
  );
}
