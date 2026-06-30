"use client";

import { useEffect, useRef, useState } from "react";
import { ELIGIBILITY_CATEGORIES } from "@/lib/eligibility";
import { RELATIONSHIPS } from "@/lib/relationships";
import { InsuranceExamples } from "@/components/InsuranceExamples";
import { useI18n, eligLabel } from "@/lib/i18n";

interface Member {
  fullName: string;
  relationship: string;
  dob: string;
  cin: string;
}
const emptyMember = (): Member => ({
  fullName: "",
  relationship: "",
  dob: "",
  cin: "",
});

const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const STEP_KEYS = ["step.details", "step.eligibility", "step.insurance"];
const ELIGIBILITY_STEP = 1;

export function EnrollmentForm() {
  const { t } = useI18n();
  const [step, setStep] = useState(0);
  const [ref, setRef] = useState("");
  const [eligibility, setEligibility] = useState<string[]>([]);
  const [familyCount, setFamilyCount] = useState(1);
  const [members, setMembers] = useState<Member[]>([]);
  const [cin, setCin] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [formNumber, setFormNumber] = useState<number | null>(null);

  const fileInput = useRef<HTMLInputElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  const last = STEP_KEYS.length - 1;

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("ref");
    if (code) setRef(code.toLowerCase());
  }, []);

  // Auto-populate a detail block for every additional household member.
  useEffect(() => {
    const needed = Math.max(0, familyCount - 1);
    setMembers((prev) => {
      if (prev.length === needed) return prev;
      if (prev.length < needed)
        return [
          ...prev,
          ...Array.from({ length: needed - prev.length }, emptyMember),
        ];
      return prev.slice(0, needed);
    });
  }, [familyCount]);

  function updateMember(i: number, field: keyof Member, val: string) {
    setMembers((prev) =>
      prev.map((m, idx) => (idx === i ? { ...m, [field]: val } : m))
    );
  }

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
    if (idx === ELIGIBILITY_STEP && eligibility.length === 0) {
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

  async function doSubmit() {
    if (submitting) return;
    setError(null);
    for (let i = 0; i <= last; i++) {
      if (!validateStep(i)) {
        setStep(i);
        return;
      }
    }
    if (!formRef.current) return;

    const form = new FormData(formRef.current);
    eligibility.forEach((v) => form.append("eligibility", v));
    if (cin.trim()) form.append("medicaidIds", cin.trim());
    photos.forEach((f) => form.append("photos", f));

    setSubmitting(true);
    try {
      const res = await fetch("/api/submit", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || t("err.generic"));
      setFormNumber(typeof data.formNumber === "number" ? data.formNumber : null);
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
          {formNumber && (
            <div className="form-number">
              <span className="fn-label">{t("ok.formNumberLabel")}</span>
              <span className="fn-value">#{formNumber}</span>
            </div>
          )}
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

      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          doSubmit();
        }}
        noValidate
      >
        <input type="hidden" name="ref" value={ref} />
        <input type="hidden" name="membersJson" value={JSON.stringify(members)} />
        <div className="wizard-card">
          {error && <div className="alert error">{error}</div>}
          {ref && step === 0 && (
            <div className="ref-badge">{t("wiz.refBadge")}</div>
          )}

          {/* STEP 1 — Details */}
          <div
            ref={(el) => {
              stepRefs.current[0] = el;
            }}
            style={{ display: step === 0 ? "block" : "none" }}
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

          {/* STEP 2 — Eligibility */}
          <div
            ref={(el) => {
              stepRefs.current[1] = el;
            }}
            style={{ display: step === 1 ? "block" : "none" }}
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
                max={30}
                step={1}
                required
                value={familyCount}
                onChange={(e) => {
                  const n = parseInt(e.target.value, 10);
                  setFamilyCount(Number.isFinite(n) ? Math.min(30, Math.max(1, n)) : 1);
                }}
                style={{ maxWidth: 160 }}
              />
            </div>
          </div>

          {/* STEP 3 — Insurance */}
          <div
            ref={(el) => {
              stepRefs.current[2] = el;
            }}
            style={{ display: step === 2 ? "block" : "none" }}
          >
            <p className="step-eyebrow">{t("s4.eyebrow")}</p>
            <h2>{t("s4.title")}</h2>
            <p className="step-hint">{t("s4.hint")}</p>

            <InsuranceExamples />

            {/* Photo upload — recommended / faster approval */}
            <div className="field">
              <label>
                {t("s4.uploadLabel")}
                <span className="faster-badge">{t("s4.fasterBadge")}</span>
              </label>
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

            <div className="or-divider">
              <span>{t("s4.orLabel")}</span>
            </div>

            <div className="field">
              <p className="hint">{t("f.cinHint")}</p>
              <input
                type="text"
                value={cin}
                placeholder={t("f.cinPlain")}
                onChange={(e) => setCin(e.target.value)}
              />
            </div>

            {/* Auto-generated household member details */}
            {members.length > 0 && (
              <div className="members-section">
                <h3 className="members-title">{t("members.title")}</h3>
                <p className="step-hint">
                  {t("members.hint", { n: familyCount })}
                </p>
                {members.map((m, i) => (
                  <div className="member-card" key={i}>
                    <div className="member-head">
                      {t("members.label", { n: i + 2 })}
                    </div>
                    <div className="field">
                      <label>
                        {t("f.fullName")}
                        <span className="req">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={m.fullName}
                        onChange={(e) =>
                          updateMember(i, "fullName", e.target.value)
                        }
                      />
                    </div>
                    <div className="row two">
                      <div className="field">
                        <label>
                          {t("f.relationship")}
                          <span className="req">*</span>
                        </label>
                        <select
                          required
                          value={m.relationship}
                          onChange={(e) =>
                            updateMember(i, "relationship", e.target.value)
                          }
                        >
                          <option value="">{t("rel.select")}</option>
                          {RELATIONSHIPS.map((r) => (
                            <option key={r.value} value={r.value}>
                              {t(r.key)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="field">
                        <label>
                          {t("f.dob")}
                          <span className="req">*</span>
                        </label>
                        <input
                          type="date"
                          required
                          value={m.dob}
                          onChange={(e) =>
                            updateMember(i, "dob", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label>{t("f.memberCin")}</label>
                      <input
                        type="text"
                        value={m.cin}
                        placeholder={t("f.cinPlain")}
                        onChange={(e) =>
                          updateMember(i, "cin", e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* nav — button is ALWAYS type="button"; we submit programmatically
              so a step transition can never trigger a native form submit. */}
          <div className="wizard-nav">
            {step > 0 && (
              <button type="button" className="btn-ghost" onClick={back}>
                {t("btn.back")}
              </button>
            )}
            <button
              type="button"
              className="btn btn-primary btn-block"
              disabled={submitting}
              onClick={() => (step < last ? next() : doSubmit())}
            >
              {step < last
                ? t("btn.continue")
                : submitting
                  ? t("btn.submitting")
                  : t("btn.submit")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
