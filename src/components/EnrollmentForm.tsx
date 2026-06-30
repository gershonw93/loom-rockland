"use client";

import { useEffect, useRef, useState } from "react";
import { ELIGIBILITY_CATEGORIES } from "@/lib/eligibility";
import { InsuranceExamples } from "@/components/InsuranceExamples";
import { useI18n, eligLabel } from "@/lib/i18n";

const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const STEP_KEYS = ["step.referral", "step.details", "step.eligibility", "step.insurance"];

export function EnrollmentForm() {
  const { t } = useI18n();
  const [step, setStep] = useState(0);
  const [ref, setRef] = useState("");
  const [eligibility, setEligibility] = useState<string[]>([]);
  const [cins, setCins] = useState<string[]>([""]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const fileInput = useRef<HTMLInputElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const last = STEP_KEYS.length - 1;

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("ref");
    if (code) setRef(code.toLowerCase());
  }, []);

  function toggleEligibility(value: string) {
    setEligibility((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  function onFiles(list: FileList | null) {
    if (!list) return;
    const incoming = Array.from(list);
    const tooBig = incoming.find((f) => f.size > MAX_PHOTO_BYTES);
    if (tooBig) {
      setError(t("err.tooBig", { name: tooBig.name }));
      return;
    }
    setError(null);
    setPhotos((prev) => [...prev, ...incoming]);
  }

  function updateCin(i: number, val: string) {
    setCins((prev) => prev.map((c, idx) => (idx === i ? val : c)));
  }

  function validateStep(idx: number): boolean {
    const container = stepRefs.current[idx];
    if (container) {
      const controls = container.querySelectorAll<
        HTMLInputElement | HTMLSelectElement
      >("input, select");
      for (const el of controls) {
        if (!el.checkValidity()) {
          el.reportValidity();
          return false;
        }
      }
    }
    if (idx === 2 && eligibility.length === 0) {
      setError(t("err.eligibility"));
      return false;
    }
    return true;
  }

  function next() {
    setError(null);
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, last));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    for (let i = 0; i <= last; i++) {
      if (!validateStep(i)) {
        setStep(i);
        return;
      }
    }

    const form = new FormData(e.currentTarget);
    eligibility.forEach((v) => form.append("eligibility", v));
    cins
      .map((c) => c.trim())
      .filter(Boolean)
      .forEach((c) => form.append("medicaidIds", c));
    photos.forEach((f) => form.append("photos", f));

    setSubmitting(true);
    try {
      const res = await fetch("/api/submit", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || t("err.generic"));
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("err.failed"));
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="wizard">
        <div className="wizard-card success">
          <div className="seal">✓</div>
          <h2>{t("ok.title")}</h2>
          <p>{t("ok.body")}</p>
          <a href="/" className="btn btn-ghost">
            {t("ok.back")}
          </a>
        </div>
      </div>
    );
  }

  const medicaidRest = t("wiz.medicaid").split("{b}")[1] ?? "";

  return (
    <div className="wizard">
      <div className="progress">
        {STEP_KEYS.map((_, i) => (
          <div
            key={i}
            className={`seg ${i < step ? "done" : i === step ? "active" : ""}`}
          />
        ))}
      </div>
      <p className="progress-label">
        {t("wiz.progress", {
          n: step + 1,
          total: STEP_KEYS.length,
          step: t(STEP_KEYS[step]),
        })}
      </p>

      <div className="medicaid-note">
        <strong>{t("wiz.medicaidB")}</strong>
        {medicaidRest}
      </div>

      <form onSubmit={onSubmit} noValidate>
        <input type="hidden" name="ref" value={ref} />
        <div className="wizard-card">
          {error && <div className="alert error">{error}</div>}
          {ref && step === 0 && (
            <div className="ref-badge">{t("wiz.refBadge")}</div>
          )}

          {/* STEP 1 — Referral */}
          <div
            ref={(el) => {
              stepRefs.current[0] = el;
            }}
            style={{ display: step === 0 ? "block" : "none" }}
          >
            <p className="step-eyebrow">{t("s1.eyebrow")}</p>
            <h2>{t("s1.title")}</h2>
            <p className="step-hint">{t("s1.hint")}</p>
            <div className="field">
              <label htmlFor="referredBy">
                {t("s1.label")}
                <span className="req">*</span>
              </label>
              <input
                id="referredBy"
                name="referredBy"
                type="text"
                required
                placeholder={t("s1.placeholder")}
              />
            </div>
          </div>

          {/* STEP 2 — Details */}
          <div
            ref={(el) => {
              stepRefs.current[1] = el;
            }}
            style={{ display: step === 1 ? "block" : "none" }}
          >
            <p className="step-eyebrow">{t("s2.eyebrow")}</p>
            <h2>{t("s2.title")}</h2>
            <p className="step-hint">{t("s2.hint")}</p>

            <div className="row two">
              <div className="field">
                <label htmlFor="firstName">
                  {t("f.firstName")}
                  <span className="req">*</span>
                </label>
                <input id="firstName" name="firstName" type="text" required />
              </div>
              <div className="field">
                <label htmlFor="lastName">
                  {t("f.lastName")}
                  <span className="req">*</span>
                </label>
                <input id="lastName" name="lastName" type="text" required />
              </div>
            </div>

            <div className="field">
              <label htmlFor="dateOfBirth">
                {t("f.dob")}
                <span className="req">*</span>
              </label>
              <input id="dateOfBirth" name="dateOfBirth" type="date" required />
            </div>

            <div className="field">
              <label>
                {t("f.address")}
                <span className="req">*</span>
              </label>
              <div className="row" style={{ marginBottom: 12 }}>
                <input
                  name="addressLine1"
                  type="text"
                  required
                  placeholder={t("f.street")}
                  aria-label={t("f.street")}
                />
              </div>
              <div className="row" style={{ marginBottom: 12 }}>
                <input
                  name="addressLine2"
                  type="text"
                  placeholder={t("f.unit")}
                  aria-label={t("f.unit")}
                />
              </div>
              <div className="row addr">
                <input name="city" type="text" required placeholder={t("f.city")} aria-label={t("f.city")} />
                <input
                  name="state"
                  type="text"
                  required
                  placeholder={t("f.state")}
                  defaultValue="NY"
                  aria-label={t("f.state")}
                />
                <input
                  name="zip"
                  type="text"
                  required
                  inputMode="numeric"
                  placeholder={t("f.zip")}
                  aria-label={t("f.zip")}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="phone">
                {t("f.phone")}
                <span className="req">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder={t("f.phonePh")}
              />
            </div>
          </div>

          {/* STEP 3 — Eligibility */}
          <div
            ref={(el) => {
              stepRefs.current[2] = el;
            }}
            style={{ display: step === 2 ? "block" : "none" }}
          >
            <p className="step-eyebrow">{t("s3.eyebrow")}</p>
            <h2>{t("s3.title")}</h2>
            <p className="step-hint">{t("s3.hint")}</p>

            <div className="checks">
              {ELIGIBILITY_CATEGORIES.map((c) => {
                const checked = eligibility.includes(c.value);
                return (
                  <label key={c.value} className={`check${checked ? " checked" : ""}`}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleEligibility(c.value)}
                    />
                    <span>{eligLabel(t, c.value, c.label)}</span>
                  </label>
                );
              })}
            </div>

            <div className="field">
              <label htmlFor="familyMembers">
                {t("f.family")}
                <span className="req">*</span>
              </label>
              <input
                id="familyMembers"
                name="familyMembers"
                type="number"
                min={1}
                step={1}
                required
                defaultValue={1}
                style={{ maxWidth: 160 }}
              />
            </div>
          </div>

          {/* STEP 4 — Insurance */}
          <div
            ref={(el) => {
              stepRefs.current[3] = el;
            }}
            style={{ display: step === 3 ? "block" : "none" }}
          >
            <p className="step-eyebrow">{t("s4.eyebrow")}</p>
            <h2>{t("s4.title")}</h2>
            <p className="step-hint">{t("s4.hint")}</p>

            <InsuranceExamples />

            <div className="field">
              <label>{t("f.photos")}</label>
              <p className="hint">{t("f.photosHint")}</p>
              <div
                className="dropzone"
                onClick={() => fileInput.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  onFiles(e.dataTransfer.files);
                }}
              >
                <div className="big">⬆</div>
                {t("f.dropzone")}
              </div>
              <input
                ref={fileInput}
                type="file"
                accept="image/*,application/pdf"
                multiple
                hidden
                onChange={(e) => {
                  onFiles(e.target.files);
                  e.target.value = "";
                }}
              />
              {photos.length > 0 && (
                <ul className="filelist">
                  {photos.map((f, i) => (
                    <li key={`${f.name}-${i}`}>
                      <span>
                        {f.name} ({(f.size / 1024).toFixed(0)} KB)
                      </span>
                      <button
                        type="button"
                        aria-label={`Remove ${f.name}`}
                        onClick={() =>
                          setPhotos((prev) => prev.filter((_, idx) => idx !== i))
                        }
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="field">
              <label>{t("f.cin")}</label>
              <p className="hint">{t("f.cinHint")}</p>
              {cins.map((c, i) => (
                <div className="repeat-row" key={i}>
                  <input
                    type="text"
                    value={c}
                    placeholder={t("f.cinPh", { n: i + 1 })}
                    onChange={(e) => updateCin(i, e.target.value)}
                  />
                  {cins.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove"
                      aria-label="Remove CIN"
                      onClick={() =>
                        setCins((prev) => prev.filter((_, idx) => idx !== i))
                      }
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="btn-add"
                onClick={() => setCins((prev) => [...prev, ""])}
              >
                {t("f.addCin")}
              </button>
            </div>
          </div>

          {/* nav */}
          <div className="wizard-nav">
            {step > 0 && (
              <button type="button" className="btn-ghost" onClick={back}>
                {t("btn.back")}
              </button>
            )}
            {step < last ? (
              <button type="button" className="btn btn-primary btn-block" onClick={next}>
                {t("btn.continue")}
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={submitting}
              >
                {submitting ? t("btn.submitting") : t("btn.submit")}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
