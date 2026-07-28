"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Brand } from "@/components/Brand";
import { Logo } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SocialProofBadge } from "@/components/SocialProofBadge";
import { useI18n, eligLabel } from "@/lib/i18n";
import { ELIGIBILITY_CATEGORIES } from "@/lib/eligibility";

// Landing "who qualifies" chips mirror the form's health-condition list.
const QUALIFY_CHIPS = ELIGIBILITY_CATEGORIES.filter((c) => c.value !== "other");

export default function Home() {
  const { t } = useI18n();
  // Carry the agent referral (?ref=) from the landing URL through to the form.
  const [applyHref, setApplyHref] = useState("/apply");
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("ref");
    if (ref) setApplyHref(`/apply?ref=${encodeURIComponent(ref)}`);
  }, []);

  return (
    <main>
      <div className="announce">
        ✓ {t("announce.text").split("{b}")[0]}
        <strong>{t("announce.b")}</strong>
        {t("announce.text").split("{b}")[1]}
      </div>
      <header className="site-header">
        <Brand height={30} />
        <div className="right">
          <LanguageSwitcher />
          <Link href={applyHref} className="btn btn-primary" style={{ padding: "11px 22px" }}>
            {t("nav.apply")}
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <h1>
            {t("hero.title1")} <span className="accent">{t("hero.title2")}</span>
          </h1>
          <p className="sub">{t("hero.sub")}</p>
          <span className="badge">{t("hero.badge")}</span>
          <div className="hero-cta">
            <Link href={applyHref} className="btn btn-primary">
              {t("hero.apply")}
            </Link>
            <a href="#how" className="btn btn-light">
              {t("hero.how")}
            </a>
          </div>
        </div>
      </section>

      {/* We make it simple */}
      <section className="section band" id="how">
        <p className="eyebrow">{t("how.eyebrow")}</p>
        <h2>{t("how.title")}</h2>
        <div className="steps">
          {[1, 2, 3].map((n) => (
            <div className="step-card" key={n}>
              <div className="num">{n}</div>
              <h3>{t(`how.s${n}t`)}</h3>
              <p>{t(`how.s${n}d`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Who qualifies */}
      <section className="section" id="qualify">
        <div className="qualify">
          <div>
            <p className="eyebrow">{t("qual.eyebrow")}</p>
            <h2>{t("qual.title")}</h2>
            <p className="lead">{t("qual.lead")}</p>
            <div className="chips">
              {QUALIFY_CHIPS.map((c) => (
                <span className="chip" key={c.value}>
                  {eligLabel(t, c.value, c.label)}
                </span>
              ))}
            </div>
            <ul className="checklist" style={{ marginTop: 28 }}>
              {[1, 2, 3].map((n) => (
                <li key={n}>
                  <span className="tick">✓</span> {t(`check.${n}`)}
                </li>
              ))}
            </ul>
          </div>
          <div className="qualify-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/box.jpg" alt={t("qual.imgalt")} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-strip">
        <h2>{t("cta.title")}</h2>
        <p>{t("cta.text")}</p>
        <Link href={applyHref} className="btn btn-light">
          {t("cta.btn")}
        </Link>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div style={{ maxWidth: "34ch" }}>
            <Logo variant="full" tone="white" height={50} className="logo-white" />
            <div className="brand-rockland white" style={{ marginBottom: 14 }}>
              Rockland
            </div>
            <p style={{ margin: 0, fontSize: 14 }}>{t("footer.tagline")}</p>
          </div>

          <div>
            <div className="footer-col-title">{t("footer.linksTitle")}</div>
            <ul className="footer-links">
              <li>
                <Link href="/">{t("footer.home")}</Link>
              </li>
              <li>
                <Link href={applyHref}>{t("footer.enroll")}</Link>
              </li>
              <li>
                <a href="/#how">{t("footer.how")}</a>
              </li>
              <li>
                <a href="/#qualify">{t("footer.qualify")}</a>
              </li>
              <li>
                <a href="https://www.loomsupport.org" target="_blank" rel="noreferrer">
                  {t("footer.about")}
                </a>
              </li>
              <li>
                <a href="https://www.loomsupport.org" target="_blank" rel="noreferrer">
                  {t("footer.services")}
                </a>
              </li>
              <li>
                <a href="https://www.loomsupport.org" target="_blank" rel="noreferrer">
                  {t("footer.faq")}
                </a>
              </li>
              <li>
                <a href="https://www.loomsupport.org" target="_blank" rel="noreferrer">
                  {t("footer.privacy")}
                </a>
              </li>
              <li>
                <a href="mailto:support@loomrockland.org">{t("footer.contactUs")}</a>
              </li>
            </ul>
          </div>

          <div className="contact">
            <div className="contact-label">{t("footer.contact")}</div>
            <span className="footer-contact-line">
              <a href="mailto:support@loomrockland.org">✉ support@loomrockland.org</a>
            </span>
            <span className="footer-contact-line">
              <a href="tel:+19294809101">✆ (929) 480-9101</a>
            </span>
            <span className="footer-contact-line">{t("footer.serving")}</span>
          </div>
        </div>
        <div className="footer-note">{t("footer.rights")}</div>
      </footer>

      <SocialProofBadge />
    </main>
  );
}
