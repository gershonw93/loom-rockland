import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { db, bucket, SUBMISSIONS_COLLECTION } from "@/lib/firebaseAdmin";
import { ELIGIBILITY_CATEGORIES, eligibilityLabel } from "@/lib/eligibility";
import { getAgent } from "@/lib/agents";
import { nextFormNumber } from "@/lib/counter";
import { DEFAULT_STATUS } from "@/lib/status";
import { buildCsv } from "@/lib/submissions";
import { sendMail, MAIL_TO } from "@/lib/mail";
import type { InsurancePhoto, SubmissionRecord } from "@/lib/types";

export const runtime = "nodejs";

const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const VALID_ELIGIBILITY = new Set(ELIGIBILITY_CATEGORIES.map((c) => c.value));

function str(form: FormData, key: string): string {
  const v = form.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  // ── Collect + validate ────────────────────────────────────────
  const referredBy = str(form, "referredBy");
  const firstName = str(form, "firstName");
  const lastName = str(form, "lastName");
  const dateOfBirth = str(form, "dateOfBirth");
  const addressLine1 = str(form, "addressLine1");
  const addressLine2 = str(form, "addressLine2");
  const city = str(form, "city");
  const state = str(form, "state");
  const zip = str(form, "zip");
  const phone = str(form, "phone");
  const familyMembersRaw = str(form, "familyMembers");
  const agentCode = str(form, "ref").toLowerCase();

  const eligibility = form
    .getAll("eligibility")
    .filter((v): v is string => typeof v === "string")
    .filter((v) => VALID_ELIGIBILITY.has(v));

  const medicaidIds = form
    .getAll("medicaidIds")
    .filter((v): v is string => typeof v === "string")
    .map((v) => v.trim())
    .filter(Boolean);

  // Additional household members (sent as a JSON string)
  let members: {
    fullName: string;
    relationship: string;
    dob: string;
    cin: string;
  }[] = [];
  const membersRaw = str(form, "membersJson");
  if (membersRaw) {
    try {
      const parsed = JSON.parse(membersRaw);
      if (Array.isArray(parsed)) {
        members = parsed
          .map((m) => ({
            fullName: String(m?.fullName ?? "").trim().slice(0, 120),
            relationship: String(m?.relationship ?? "").trim().slice(0, 40),
            dob: String(m?.dob ?? "").trim().slice(0, 20),
            cin: String(m?.cin ?? "").trim().slice(0, 40),
          }))
          .filter((m) => m.fullName)
          .slice(0, 30);
      }
    } catch {
      /* ignore malformed members */
    }
  }

  // Per-condition detail fields (sent as a JSON string)
  const VALID_CONDITIONS = new Set(eligibility);
  let conditionDetails: {
    condition: string;
    clientName: string;
    date?: string;
    infantName?: string;
    infantDob?: string;
  }[] = [];
  const condRaw = str(form, "conditionDetailsJson");
  if (condRaw) {
    try {
      const parsed = JSON.parse(condRaw);
      if (Array.isArray(parsed)) {
        conditionDetails = parsed
          .filter((c) => VALID_CONDITIONS.has(String(c?.condition)))
          .map((c) => {
            const out: {
              condition: string;
              clientName: string;
              date?: string;
              infantName?: string;
              infantDob?: string;
            } = {
              condition: String(c.condition),
              clientName: String(c?.clientName ?? "").trim().slice(0, 120),
            };
            if (c?.date) out.date = String(c.date).trim().slice(0, 20);
            if (c?.infantName)
              out.infantName = String(c.infantName).trim().slice(0, 120);
            if (c?.infantDob)
              out.infantDob = String(c.infantDob).trim().slice(0, 20);
            return out;
          })
          .slice(0, 20);
      }
    } catch {
      /* ignore malformed condition details */
    }
  }

  const required: Record<string, string> = {
    firstName,
    lastName,
    dateOfBirth,
    addressLine1,
    city,
    state,
    zip,
    phone,
  };
  const missing = Object.entries(required)
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missing.length) {
    return NextResponse.json(
      { error: `Missing required field(s): ${missing.join(", ")}.` },
      { status: 400 }
    );
  }
  // Health/eligibility info and Medicaid CIN are intentionally OPTIONAL — the
  // form lets applicants skip these and an enrollment officer collects them by
  // phone, so we do not block submission on them here.
  const familyMembers = Number.parseInt(familyMembersRaw, 10);
  if (!Number.isFinite(familyMembers) || familyMembers < 1) {
    return NextResponse.json(
      { error: "Number of family members must be at least 1." },
      { status: 400 }
    );
  }

  // ── Create the doc reference up front (need its id for storage paths) ──
  const docRef = db().collection(SUBMISSIONS_COLLECTION).doc();

  // ── Upload insurance photos ───────────────────────────────────
  const photoFiles = form
    .getAll("photos")
    .filter((v): v is File => v instanceof File && v.size > 0);

  const photos: InsurancePhoto[] = [];
  try {
    for (const file of photoFiles) {
      if (file.size > MAX_PHOTO_BYTES) {
        return NextResponse.json(
          { error: `"${file.name}" exceeds the 10 MB limit.` },
          { status: 400 }
        );
      }
      const safeName = file.name.replace(/[^\w.\-]+/g, "_").slice(-120);
      const path = `${SUBMISSIONS_COLLECTION}/${docRef.id}/${Date.now()}_${safeName}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      await bucket()
        .file(path)
        .save(buffer, {
          contentType: file.type || "application/octet-stream",
          resumable: false,
          metadata: { contentType: file.type || "application/octet-stream" },
        });
      photos.push({
        path,
        filename: file.name,
        contentType: file.type || "application/octet-stream",
        size: file.size,
      });
    }
  } catch (err) {
    console.error("photo upload failed", err);
    return NextResponse.json(
      { error: "Could not upload insurance photos. Please try again." },
      { status: 500 }
    );
  }

  // ── Upload the "Other" condition supporting document (optional) ─
  let otherDoc: InsurancePhoto | null = null;
  const otherDocFile = form.get("otherDoc");
  if (otherDocFile instanceof File && otherDocFile.size > 0) {
    try {
      if (otherDocFile.size > MAX_PHOTO_BYTES) {
        return NextResponse.json(
          { error: `"${otherDocFile.name}" exceeds the 10 MB limit.` },
          { status: 400 }
        );
      }
      const safeName = otherDocFile.name.replace(/[^\w.\-]+/g, "_").slice(-120);
      const path = `${SUBMISSIONS_COLLECTION}/${docRef.id}/other_${Date.now()}_${safeName}`;
      const buffer = Buffer.from(await otherDocFile.arrayBuffer());
      await bucket()
        .file(path)
        .save(buffer, {
          contentType: otherDocFile.type || "application/octet-stream",
          resumable: false,
          metadata: { contentType: otherDocFile.type || "application/octet-stream" },
        });
      otherDoc = {
        path,
        filename: otherDocFile.name,
        contentType: otherDocFile.type || "application/octet-stream",
        size: otherDocFile.size,
      };
    } catch (err) {
      console.error("other-doc upload failed", err);
      return NextResponse.json(
        { error: "Could not upload the supporting document. Please try again." },
        { status: 500 }
      );
    }
  }

  // ── Resolve referring agent (from the ?ref= link) ─────────────
  let resolvedAgentCode = "";
  let agentName = "";
  if (agentCode) {
    const agent = await getAgent(agentCode).catch(() => null);
    if (agent) {
      resolvedAgentCode = agent.code;
      agentName = agent.name;
    }
  }

  // ── Reserve a sequential form number ──────────────────────────
  let formNumber: number;
  try {
    formNumber = await nextFormNumber();
  } catch (err) {
    console.error("form number assignment failed", err);
    return NextResponse.json(
      { error: "Could not assign a form number. Please try again." },
      { status: 500 }
    );
  }

  // ── Persist submission ────────────────────────────────────────
  try {
    await docRef.set({
      formNumber,
      referredBy,
      firstName,
      lastName,
      dateOfBirth,
      address: { line1: addressLine1, line2: addressLine2, city, state, zip },
      phone,
      eligibility,
      conditionDetails,
      otherDoc,
      familyMembers,
      members,
      medicaidIds,
      photos,
      agentCode: resolvedAgentCode,
      agentName,
      status: DEFAULT_STATUS,
      archived: false,
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (err) {
    console.error("firestore write failed", err);
    return NextResponse.json(
      { error: "Could not save your application. Please try again." },
      { status: 500 }
    );
  }

  // ── Notify the office by email (non-blocking) ─────────────────
  // The applicant's submission already succeeded; a mail problem must never
  // turn into a failed submission, so this is fully guarded.
  try {
    const record: SubmissionRecord = {
      id: docRef.id,
      formNumber,
      referredBy,
      firstName,
      lastName,
      dateOfBirth,
      address: { line1: addressLine1, line2: addressLine2, city, state, zip },
      phone,
      eligibility,
      conditionDetails,
      otherDoc,
      otherDocUrl: "",
      familyMembers,
      members,
      medicaidIds,
      photos,
      photoUrls: [],
      agentCode: resolvedAgentCode,
      agentName,
      status: DEFAULT_STATUS,
      archived: false,
      createdAt: new Date().toISOString(),
    };

    const csv = await buildCsv([record]);
    const fullName = `${firstName} ${lastName}`.trim();
    const conditions = eligibility.map(eligibilityLabel).join(", ") || "—";
    const cityLine = [city, state, zip].filter(Boolean).join(", ");

    const text = [
      `A new application has been submitted on loomrockland.org.`,
      ``,
      `Application #:  ${formNumber}`,
      `Name:          ${fullName}`,
      `Phone:         ${phone}`,
      `Date of birth: ${dateOfBirth}`,
      `Address:       ${[addressLine1, addressLine2].filter(Boolean).join(", ")}${cityLine ? " — " + cityLine : ""}`,
      `Household:     ${familyMembers}`,
      `Eligibility:   ${conditions}`,
      `Medicaid CIN:  ${medicaidIds.join(", ") || "—"}`,
      `Insurance photos: ${photos.length}`,
      `Referring agent:  ${agentName || resolvedAgentCode || "—"}`,
      ``,
      `The full submission is attached as a CSV (application-${formNumber}.csv).`,
    ].join("\n");

    const esc = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#1f2937">
        <h2 style="color:#4c1d95;margin:0 0 12px">New application — #${formNumber}</h2>
        <p style="margin:0 0 14px">A new application has been submitted on loomrockland.org.</p>
        <table style="border-collapse:collapse;font-size:14px">
          <tr><td style="padding:3px 12px 3px 0;color:#6b7280">Application #</td><td><strong>${formNumber}</strong></td></tr>
          <tr><td style="padding:3px 12px 3px 0;color:#6b7280">Name</td><td>${esc(fullName)}</td></tr>
          <tr><td style="padding:3px 12px 3px 0;color:#6b7280">Phone</td><td>${esc(phone)}</td></tr>
          <tr><td style="padding:3px 12px 3px 0;color:#6b7280">Date of birth</td><td>${esc(dateOfBirth)}</td></tr>
          <tr><td style="padding:3px 12px 3px 0;color:#6b7280">Address</td><td>${esc([addressLine1, addressLine2].filter(Boolean).join(", "))}${cityLine ? " — " + esc(cityLine) : ""}</td></tr>
          <tr><td style="padding:3px 12px 3px 0;color:#6b7280">Household</td><td>${familyMembers}</td></tr>
          <tr><td style="padding:3px 12px 3px 0;color:#6b7280">Eligibility</td><td>${esc(conditions)}</td></tr>
          <tr><td style="padding:3px 12px 3px 0;color:#6b7280">Medicaid CIN</td><td>${esc(medicaidIds.join(", ") || "—")}</td></tr>
          <tr><td style="padding:3px 12px 3px 0;color:#6b7280">Insurance photos</td><td>${photos.length}</td></tr>
          <tr><td style="padding:3px 12px 3px 0;color:#6b7280">Referring agent</td><td>${esc(agentName || resolvedAgentCode || "—")}</td></tr>
        </table>
        <p style="margin:16px 0 0;color:#6b7280;font-size:13px">The full submission is attached as a CSV (application-${formNumber}.csv), ready to open in Excel.</p>
      </div>`;

    const result = await sendMail({
      subject: `New Application Submitted - #${formNumber}`,
      text,
      html,
      attachments: [
        {
          filename: `application-${formNumber}.csv`,
          content: csv,
          contentType: "text/csv; charset=utf-8",
        },
      ],
    });
    if (result.skipped) {
      console.warn(`[submit] email skipped (SMTP not configured) for #${formNumber}`);
    } else if (!result.sent) {
      console.error(`[submit] email failed for #${formNumber}: ${result.error}`);
    } else {
      console.log(`[submit] notification sent to ${MAIL_TO} for #${formNumber}`);
    }
  } catch (err) {
    console.error("notification email failed", err);
  }

  return NextResponse.json({ ok: true, id: docRef.id, formNumber });
}
