"use client";

import { useEffect, useRef } from "react";

/**
 * Silently counts a visit into the global counter on every public page EXCEPT
 * the landing page (the badge counts that one) and the admin. This makes every
 * sub-path / QR-code link (e.g. /apply?ref=...) contribute to the total.
 */
export function VisitTracker() {
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    const p = window.location.pathname;
    if (p === "/" || p.startsWith("/admin")) return;
    fetch("/api/visit", { method: "POST" }).catch(() => {});
  }, []);
  return null;
}
