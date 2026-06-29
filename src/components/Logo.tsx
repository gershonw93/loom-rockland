/* eslint-disable @next/next/no-img-element */

type Variant = "full" | "mark";
type Tone = "deep" | "white";

const SRC: Record<Variant, Record<Tone, string>> = {
  full: { deep: "/brand/loom-logo.png", white: "/brand/loom-logo-white.png" },
  mark: { deep: "/brand/loom-mark.png", white: "/brand/loom-mark-white.png" },
};

export function Logo({
  variant = "mark",
  tone = "deep",
  height = 32,
  className,
}: {
  variant?: Variant;
  tone?: Tone;
  height?: number;
  className?: string;
}) {
  return (
    <img
      src={SRC[variant][tone]}
      alt="LOOM — Social Care Network"
      height={height}
      style={{ height, width: "auto" }}
      className={className}
    />
  );
}
