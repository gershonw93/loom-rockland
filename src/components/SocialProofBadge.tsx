"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

const DISMISS_KEY = "loom_sp_dismissed";

/**
 * Floating "social proof" badge. Counts this visit into the global counter and
 * shows the running total (which grows slowly — 1 per several visits). It
 * appears 3s after load, refreshes live, is mobile-optimised, and can be
 * dismissed with the ✕ (stays closed for the rest of the session).
 */
export function SocialProofBadge() {
  const { t } = useI18n();
  const [count, setCount] = useState<number | null>(null);
  const [shown, setShown] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const counted = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(DISMISS_KEY)) {
      setDismissed(true);
      return;
    }
    if (counted.current) return; // avoid a double count in React strict mode
    counted.current = true;

    fetch("/api/visit", { method: "POST" })
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.count === "number") setCount(d.count);
      })
      .catch(() => {});

    // appear 3s after the page settles
    const showTimer = setTimeout(() => setShown(true), 3000);

    const poll = setInterval(() => {
      fetch("/api/visit")
        .then((r) => r.json())
        .then((d) => {
          if (typeof d.count === "number") setCount(d.count);
        })
        .catch(() => {});
    }, 30000);

    return () => {
      clearTimeout(showTimer);
      clearInterval(poll);
    };
  }, []);

  function dismiss() {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  if (dismissed || !shown || count === null || count < 1) return null;

  return (
    <div className="social-proof" role="status" aria-live="polite">
      <span className="sp-dot" />
      <span className="sp-text">{t("badge.text", { n: count.toLocaleString() })}</span>
      <button
        type="button"
        className="sp-close"
        onClick={dismiss}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
