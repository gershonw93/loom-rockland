"use client";

import { useEffect, useRef, useState } from "react";
import { LOCALES, useI18n } from "@/lib/i18n";

/**
 * Site-wide language switcher. Shows the native, full language name (English,
 * Español, Kreyòl Ayisyen, فارسی) in a compact dropdown — no ISO codes.
 */
export function LanguageSwitcher({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div className={`lang-switch ${tone}`} ref={ref}>
      <button
        type="button"
        className="lang-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Language"
        onClick={() => setOpen((v) => !v)}
      >
        <svg
          className="lang-globe"
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span className="lang-current">{current.label}</span>
        <svg
          className={`lang-caret${open ? " up" : ""}`}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <ul className="lang-menu" role="listbox">
          {LOCALES.map((l) => (
            <li key={l.code} role="option" aria-selected={locale === l.code}>
              <button
                type="button"
                className={locale === l.code ? "active" : ""}
                dir={l.dir}
                onClick={() => {
                  setLocale(l.code);
                  setOpen(false);
                }}
              >
                {l.label}
                {locale === l.code && <span className="lang-check">✓</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
