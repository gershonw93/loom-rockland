"use client";

import { useI18n } from "@/lib/i18n";

/**
 * Reference cards shown on the Insurance step so applicants know where to find
 * their Medicaid ID / CIN. Stylised examples — not real cards.
 */
export function InsuranceExamples() {
  const { t } = useI18n();
  const note = t("ins.note", { ex: "AB12345C" }).split("{b}");

  return (
    <div>
      <div className="ref-note">
        💡 {note[0]}
        <strong>{t("ins.noteB")}</strong>
        {note[1]}
      </div>
      <div className="ref-cards">
        <div>
          <div className="ref-card fidelis">
            <div className="brandname">Fidelis Care</div>
            <div>
              <div className="label">CIN#</div>
              <span className="cin">AB12345C</span>
            </div>
          </div>
          <p className="ref-caption">{t("ins.cap1")}</p>
        </div>
        <div>
          <div className="ref-card nys">
            <div className="brandname">NY State Benefit</div>
            <div>
              <div className="label">ID Number</div>
              <span className="cin">XX00000X</span>
            </div>
          </div>
          <p className="ref-caption">{t("ins.cap2")}</p>
        </div>
        <div>
          <div className="ref-card uhc">
            <div className="brandname">UnitedHealthcare</div>
            <div>
              <div className="label">Member ID</div>
              <span className="cin">123456789-00</span>
            </div>
          </div>
          <p className="ref-caption">{t("ins.cap3")}</p>
        </div>
      </div>
    </div>
  );
}
