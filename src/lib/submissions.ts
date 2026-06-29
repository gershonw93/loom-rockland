import "server-only";
import { Timestamp } from "firebase-admin/firestore";
import { db, bucket, SUBMISSIONS_COLLECTION } from "@/lib/firebaseAdmin";
import { eligibilityLabel } from "@/lib/eligibility";
import { statusLabel } from "@/lib/status";
import type { SubmissionRecord } from "@/lib/types";

export interface DateRange {
  fromISO?: string | null;
  toISO?: string | null;
}

/**
 * Fetch submissions ordered newest-first, optionally bounded by a created-at
 * date range (ISO instants computed in the admin's local timezone).
 */
export async function fetchSubmissions(
  range: DateRange
): Promise<SubmissionRecord[]> {
  let query = db()
    .collection(SUBMISSIONS_COLLECTION)
    .orderBy("createdAt", "desc") as FirebaseFirestore.Query;

  if (range.fromISO) {
    const d = new Date(range.fromISO);
    if (!Number.isNaN(d.getTime())) {
      query = query.where("createdAt", ">=", Timestamp.fromDate(d));
    }
  }
  if (range.toISO) {
    const d = new Date(range.toISO);
    if (!Number.isNaN(d.getTime())) {
      query = query.where("createdAt", "<=", Timestamp.fromDate(d));
    }
  }

  const snap = await query.get();
  return snap.docs.map((doc) => {
    const data = doc.data();
    const createdAt =
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate().toISOString()
        : "";
    return {
      id: doc.id,
      referredBy: data.referredBy ?? "",
      firstName: data.firstName ?? "",
      lastName: data.lastName ?? "",
      dateOfBirth: data.dateOfBirth ?? "",
      address: {
        line1: data.address?.line1 ?? "",
        line2: data.address?.line2 ?? "",
        city: data.address?.city ?? "",
        state: data.address?.state ?? "",
        zip: data.address?.zip ?? "",
      },
      phone: data.phone ?? "",
      eligibility: Array.isArray(data.eligibility) ? data.eligibility : [],
      familyMembers: data.familyMembers ?? 0,
      medicaidIds: Array.isArray(data.medicaidIds) ? data.medicaidIds : [],
      photos: Array.isArray(data.photos) ? data.photos : [],
      agentCode: data.agentCode ?? "",
      agentName: data.agentName ?? "",
      status: data.status ?? "new",
      createdAt,
    };
  });
}

/** Update the lifecycle status of a single submission. */
export async function updateSubmissionStatus(
  id: string,
  status: string
): Promise<void> {
  await db()
    .collection(SUBMISSIONS_COLLECTION)
    .doc(id)
    .update({ status, statusUpdatedAt: Timestamp.now() });
}

/** Generate a temporary signed URL for a stored insurance photo. */
async function signedUrl(path: string): Promise<string> {
  try {
    const [url] = await bucket()
      .file(path)
      .getSignedUrl({
        action: "read",
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    return url;
  } catch {
    return path;
  }
}

const CSV_HEADERS = [
  "Submission ID",
  "Submitted At",
  "Status",
  "Agent",
  "Referred By",
  "First Name",
  "Last Name",
  "Date of Birth",
  "Address Line 1",
  "Apt / Unit",
  "City",
  "State",
  "ZIP",
  "Phone",
  "Eligibility Categories",
  "Family Members",
  "Medicaid CINs",
  "Insurance Photo Links",
];

/** Escape a value for CSV, guarding against formula injection. */
function csvCell(value: string | number): string {
  let s = String(value ?? "");
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  if (/[",\n\r]/.test(s)) s = `"${s.replace(/"/g, '""')}"`;
  return s;
}

/** Build a CSV document (with signed photo links) from submissions. */
export async function buildCsv(rows: SubmissionRecord[]): Promise<string> {
  const lines = [CSV_HEADERS.map(csvCell).join(",")];

  for (const r of rows) {
    const photoLinks = await Promise.all(
      r.photos.map((p) => signedUrl(p.path))
    );
    const cells = [
      r.id,
      r.createdAt ? new Date(r.createdAt).toLocaleString("en-US") : "",
      statusLabel(r.status),
      r.agentName || r.agentCode || "—",
      r.referredBy,
      r.firstName,
      r.lastName,
      r.dateOfBirth,
      r.address.line1,
      r.address.line2,
      r.address.city,
      r.address.state,
      r.address.zip,
      r.phone,
      r.eligibility.map(eligibilityLabel).join("; "),
      r.familyMembers,
      r.medicaidIds.join("; "),
      photoLinks.join(" | "),
    ];
    lines.push(cells.map(csvCell).join(","));
  }

  // Prepend BOM so Excel reads UTF-8 correctly.
  return "﻿" + lines.join("\r\n");
}
