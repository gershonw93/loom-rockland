"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

/**
 * Floating "social proof" badge. On mount it counts this visit into the global
 * counter and shows the running total; it then refreshes every 30s so the
 * number ticks up live as other people visit (any page across the domain).
 */
export function SocialProofBadge() {
  const { t } = useI18n();
  const [count, setCount] = useState<number | null>(null);
  const counted = useRef(false);

  useEffect(() => {
    if (counted.current) return; // avoid a double count in React strict mode
    counted.current = true;

    fetch("/api/visit", { method: "POST" })
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.count === "number") setCount(d.count);
      })
      .catch(() => {});

    const id = setInterval(() => {
      fetch("/api/visit")
        .then((r) => r.json())
        .then((d) => {
          if (typeof d.count === "number") setCount(d.count);
        })
        .catch(() => {});
    }, 30000);
    return () => clearInterval(id);
  }, []);

  if (count === null) return null;

  return (
    <div className="social-proof" role="status" aria-live="polite">
      <span className="sp-dot" />
      <span>{t("badge.text", { n: count.toLocaleString() })}</span>
    </div>
  );
}
