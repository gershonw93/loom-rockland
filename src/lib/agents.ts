import "server-only";
import { randomBytes } from "crypto";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { db } from "@/lib/firebaseAdmin";
import type { Agent } from "@/lib/types";

export const AGENTS_COLLECTION = "agents";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 24);
}

function suffix(): string {
  return randomBytes(3).toString("hex"); // 6 hex chars
}

function toAgent(id: string, data: FirebaseFirestore.DocumentData): Agent {
  return {
    id,
    code: id,
    name: data.name ?? "",
    active: data.active !== false,
    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate().toISOString()
        : "",
  };
}

export async function fetchAgents(): Promise<Agent[]> {
  const snap = await db()
    .collection(AGENTS_COLLECTION)
    .orderBy("createdAt", "desc")
    .get();
  return snap.docs.map((d) => toAgent(d.id, d.data()));
}

export async function getAgent(code: string): Promise<Agent | null> {
  if (!code) return null;
  const doc = await db().collection(AGENTS_COLLECTION).doc(code).get();
  return doc.exists ? toAgent(doc.id, doc.data()!) : null;
}

export async function deleteAgent(code: string): Promise<void> {
  await db().collection(AGENTS_COLLECTION).doc(code).delete();
}

export async function createAgent(name: string): Promise<Agent> {
  const base = slugify(name) || "agent";
  // ensure a unique code (doc id)
  let code = `${base}-${suffix()}`;
  for (let i = 0; i < 5; i++) {
    const exists = (
      await db().collection(AGENTS_COLLECTION).doc(code).get()
    ).exists;
    if (!exists) break;
    code = `${base}-${suffix()}`;
  }
  const ref = db().collection(AGENTS_COLLECTION).doc(code);
  await ref.set({
    name: name.trim(),
    active: true,
    createdAt: FieldValue.serverTimestamp(),
  });
  const doc = await ref.get();
  return toAgent(doc.id, doc.data()!);
}
