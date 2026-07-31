"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Brand } from "@/components/Brand";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

/**
 * Shared chrome for the static information pages (About, Services, FAQ,
 * Privacy). Keeps a consistent branded header/footer across loomrockland.org.
 */
export function InfoPageShell({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <main>
      <header className="site-header">
        <Link href="/" aria-label="LOOM Rockland home">
          <Brand height={30} />
        </Link>
        <div className="right">
          <LanguageSwitcher />
          <Link
            href="/apply"
            className="btn btn-primary"
            style={{ padding: "11px 22px" }}
          >
            Enroll Now
          </Link>
        </div>
      </header>

      <article className="doc-page">
        <p className="eyebrow">LOOM Rockland</p>
        <h1 className="doc-title">{title}</h1>
        {intro && <p className="doc-intro">{intro}</p>}
        {children}
        <div className="doc-back">
          <Link href="/" className="btn btn-ghost">
            ← Back to home
          </Link>
        </div>
      </article>

      <footer className="site-footer">
        <div className="footer-inner">
          <div style={{ maxWidth: "34ch" }}>
            <div className="brand-rockland white" style={{ marginBottom: 10 }}>
              LOOM Rockland
            </div>
            <p style={{ margin: 0, fontSize: 14 }}>
              Weekly meal boxes &amp; support services for Medicaid members in
              New York.
            </p>
          </div>
          <div className="contact">
            <div className="contact-label">Contact</div>
            <span className="footer-contact-line">
              <a href="mailto:support@loomrockland.org">
                ✉ support@loomrockland.org
              </a>
            </span>
            <span className="footer-contact-line">
              <a href="tel:+19294809101">✆ (929) 480-9101</a>
            </span>
          </div>
        </div>
        <div className="footer-note">
          © 2026 LOOM Social Care Network. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
