"use client";

import { LOCALES, useI18n } from "@/lib/i18n";

export function LanguageSwitcher({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { locale, setLocale } = useI18n();
  return (
    <div className={`lang-switch ${tone}`} role="group" aria-label="Language">
      {LOCALES.map((l) => (
        <button
          key={l.code}
          className={locale === l.code ? "active" : ""}
          onClick={() => setLocale(l.code)}
          title={l.label}
          type="button"
        >
          {l.short}
        </button>
      ))}
    </div>
  );
}
