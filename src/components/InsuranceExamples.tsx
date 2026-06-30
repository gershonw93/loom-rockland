"use client";

import { useI18n } from "@/lib/i18n";

/**
 * Faithful recreations of the common Medicaid insurance cards so applicants
 * recognise their own card and can find the CIN / Member ID. The number to
 * enter is circled in red on each card.
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

      <div className="cards3">
        {/* ── Fidelis Care ─────────────────────────────── */}
        <figure className="ccard fidelis-card">
          <div className="cc-top">
            <div>
              <div className="cc-tiny">Member ID#:</div>
              <div className="cc-strong">123456789-00</div>
              <div className="cc-tiny">
                Member Name: <b>John Sample</b>
              </div>
            </div>
            <div className="fidelis-logo">
              <span className="fidelis-dot" />
              FIDELIS CARE
            </div>
          </div>
          <div className="cc-divider fidelis-line" />
          <div className="cc-bottom">
            <div className="cc-tiny">
              PCP: <b>Samuel Young MD</b>
              <br />
              Member Services:
              <br />
              <b>1-888-343-3547</b>
            </div>
            <div className="cc-id-wrap">
              <span className="cc-arrow">CIN#&nbsp;➜</span>
              <span className="cc-id">CIN#: AB12345C</span>
            </div>
          </div>
          <figcaption className="ref-caption">Fidelis Care — bottom-right</figcaption>
        </figure>

        {/* ── UnitedHealthcare ─────────────────────────── */}
        <figure className="ccard uhc-card">
          <div className="cc-top">
            <div className="uhc-logo">
              <span className="uhc-bars">
                <i /><i /><i /><i />
              </span>
              UnitedHealthcare
            </div>
            <span className="uhc-ucard">UCard</span>
          </div>
          <div className="uhc-name">Johanna Smith</div>
          <div className="cc-id-wrap left">
            <span className="cc-id">Member ID 123456789-00</span>
            <span className="cc-arrow">⬅ Member ID</span>
          </div>
          <div className="cc-tiny" style={{ marginTop: 8 }}>
            AARP Medicare Advantage from UHC
            <br />
            RxBIN 123456 · RxPCN 1234 · RxGRP LNM
          </div>
          <figcaption className="ref-caption">UnitedHealthcare — under your name</figcaption>
        </figure>

        {/* ── NY State Benefit ─────────────────────────── */}
        <figure className="ccard nys-card">
          <div className="nys-head">
            <span className="nys-seal" />
            NEW YORK STATE
          </div>
          <div className="nys-body">
            <div className="cc-id-wrap left">
              <span className="cc-tiny">ID NUMBER</span>
              <span className="cc-id">XX00000X</span>
              <span className="cc-arrow">⬅ ID Number</span>
            </div>
            <div className="cc-tiny" style={{ marginTop: 10 }}>
              DOB 05/03/2007
              <br />
              LAST NAME: LSTN · FIRST: FRST
            </div>
          </div>
          <figcaption className="ref-caption">NY State Benefit — “ID Number”</figcaption>
        </figure>
      </div>
    </div>
  );
}
