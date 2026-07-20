"use client";

import { Brand } from "@/components/Brand";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ShareCard } from "@/components/ShareCard";
import { useI18n } from "@/lib/i18n";

/**
 * Standalone preview of the Thank-You page (success message + sharing card),
 * so the sharing flow can be tested on a phone without submitting the form.
 */
export default function ThankYouPreview() {
  const { t } = useI18n();
  return (
    <main>
      <header className="site-header">
        <Brand height={30} />
        <div className="right">
          <LanguageSwitcher />
        </div>
      </header>
      <div className="apply-main">
        <div className="wizard">
          <div className="wizard-card success">
            <div className="seal">✓</div>
            <h2>{t("ok.title")}</h2>
            <div className="form-number">
              <span className="fn-label">{t("ok.formNumberLabel")}</span>
              <span className="fn-value">#860000</span>
            </div>
            <p>{t("ok.body")}</p>
            <p>{t("ok.body2")}</p>
            <p>{t("ok.body3")}</p>
          </div>
          <ShareCard />
        </div>
      </div>
    </main>
  );
}
