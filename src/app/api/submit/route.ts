import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { db, bucket, SUBMISSIONS_COLLECTION } from "@/lib/firebaseAdmin";
import { ELIGIBILITY_CATEGORIES } from "@/lib/eligibility";
import { getAgent } from "@/lib/agents";
import { DEFAULT_STATUS } from "@/lib/status";
import type { InsurancePhoto } from "@/lib/types";

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

  const required: Record<string, string> = {
    referredBy,
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
  if (eligibility.length === 0) {
    return NextResponse.json(
      { error: "Select at least one eligibility category." },
      { status: 400 }
    );
  }
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

  // ── Persist submission ────────────────────────────────────────
  try {
    await docRef.set({
      referredBy,
      firstName,
      lastName,
      dateOfBirth,
      address: { line1: addressLine1, line2: addressLine2, city, state, zip },
      phone,
      eligibility,
      familyMembers,
      medicaidIds,
      photos,
      agentCode: resolvedAgentCode,
      agentName,
      status: DEFAULT_STATUS,
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (err) {
    console.error("firestore write failed", err);
    return NextResponse.json(
      { error: "Could not save your application. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, id: docRef.id });
}
