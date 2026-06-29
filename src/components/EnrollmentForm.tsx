"use client";

import { useRef, useState } from "react";
import { ELIGIBILITY_CATEGORIES } from "@/lib/eligibility";
import { InsuranceExamples } from "@/components/InsuranceExamples";

const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

const STEPS = ["Referral", "Your details", "Eligibility", "Insurance"];

export function EnrollmentForm() {
  const [step, setStep] = useState(0);
  const [eligibility, setEligibility] = useState<string[]>([]);
  const [cins, setCins] = useState<string[]>([""]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const fileInput = useRef<HTMLInputElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const last = STEPS.length - 1;

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
      setError(`"${tooBig.name}" is larger than 10 MB.`);
      return;
    }
    setError(null);
    setPhotos((prev) => [...prev, ...incoming]);
  }

  function updateCin(i: number, val: string) {
    setCins((prev) => prev.map((c, idx) => (idx === i ? val : c)));
  }

  /** Validate the native inputs inside the current step. */
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
      setError("Please select at least one eligibility category.");
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
    // validate every step before sending
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
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="wizard">
        <div className="wizard-card success">
          <div className="seal">✓</div>
          <h2>Thank you for your application!</h2>
          <p>
            Your information has been received securely. A LOOM Care Team
            representative will contact you within 24–48 hours to finalize your
            enrollment and schedule your home support.
          </p>
          <a href="/" className="btn btn-ghost">
            Back to home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="wizard">
      {/* progress */}
      <div className="progress">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`seg ${i < step ? "done" : i === step ? "active" : ""}`}
          />
        ))}
      </div>
      <p className="progress-label">
        Step {step + 1} of {STEPS.length} · {STEPS[step]}
      </p>

      <form onSubmit={onSubmit} noValidate>
        <div className="wizard-card">
          {error && <div className="alert error">{error}</div>}

          {/* STEP 1 — Referral */}
          <div
            ref={(el) => {
              stepRefs.current[0] = el;
            }}
            style={{ display: step === 0 ? "block" : "none" }}
          >
            <p className="step-eyebrow">Referral</p>
            <h2>Who referred you?</h2>
            <p className="step-hint">
              Let us know who told you about LOOM so we can thank them.
            </p>
            <div className="field">
              <label htmlFor="referredBy">
                Who referred you?<span className="req">*</span>
              </label>
              <input
                id="referredBy"
                name="referredBy"
                type="text"
                required
                placeholder="Name of the person or agent who referred you"
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
            <p className="step-eyebrow">Your details</p>
            <h2>Tell us about you</h2>
            <p className="step-hint">Where should we deliver your meal boxes?</p>

            <div className="row two">
              <div className="field">
                <label htmlFor="firstName">
                  First Name<span className="req">*</span>
                </label>
                <input id="firstName" name="firstName" type="text" required />
              </div>
              <div className="field">
                <label htmlFor="lastName">
                  Last Name<span className="req">*</span>
                </label>
                <input id="lastName" name="lastName" type="text" required />
              </div>
            </div>

            <div className="field">
              <label htmlFor="dateOfBirth">
                Date of Birth<span className="req">*</span>
              </label>
              <input id="dateOfBirth" name="dateOfBirth" type="date" required />
            </div>

            <div className="field">
              <label>
                Food Boxes Delivery Address<span className="req">*</span>
              </label>
              <div className="row" style={{ marginBottom: 12 }}>
                <input
                  name="addressLine1"
                  type="text"
                  required
                  placeholder="Street address"
                  aria-label="Street address"
                />
              </div>
              <div className="row" style={{ marginBottom: 12 }}>
                <input
                  name="addressLine2"
                  type="text"
                  placeholder="Apt / Unit (optional)"
                  aria-label="Apartment or unit"
                />
              </div>
              <div className="row addr">
                <input name="city" type="text" required placeholder="City" aria-label="City" />
                <input
                  name="state"
                  type="text"
                  required
                  placeholder="State"
                  defaultValue="NY"
                  aria-label="State"
                />
                <input
                  name="zip"
                  type="text"
                  required
                  inputMode="numeric"
                  placeholder="ZIP"
                  aria-label="ZIP code"
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="phone">
                Cell Phone Number (for calls and texts)
                <span className="req">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="+1 (845) 000-0000"
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
            <p className="step-eyebrow">Eligibility</p>
            <h2>What brings you to LOOM?</h2>
            <p className="step-hint">Select all that apply.</p>

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
                    <span>{c.label}</span>
                  </label>
                );
              })}
            </div>

            <div className="field">
              <label htmlFor="familyMembers">
                Number of family members (including you)
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
            <p className="step-eyebrow">Insurance</p>
            <h2>Insurance information</h2>
            <p className="step-hint">
              Upload a photo of each insurance card, or enter the Medicaid ID
              (CIN) numbers below.
            </p>

            <InsuranceExamples />

            <div className="field">
              <label>Insurance Card Photos</label>
              <p className="hint">
                Please upload photos of insurance cards for yourself and all
                family members listed in this application.
              </p>
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
                Click to choose a file or drag here
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
              <label>Medicaid ID# (CIN) — if no photos</label>
              <p className="hint">Add one CIN per family member, if applicable.</p>
              {cins.map((c, i) => (
                <div className="repeat-row" key={i}>
                  <input
                    type="text"
                    value={c}
                    placeholder={`Medicaid CIN #${i + 1}`}
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
                + Add another CIN
              </button>
            </div>
          </div>

          {/* nav */}
          <div className="wizard-nav">
            {step > 0 && (
              <button type="button" className="btn-ghost" onClick={back}>
                ← Back
              </button>
            )}
            {step < last ? (
              <button type="button" className="btn btn-primary btn-block" onClick={next}>
                Continue →
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={submitting}
              >
                {submitting ? "Submitting…" : "Submit application"}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
