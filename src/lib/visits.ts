import "server-only";
import { db } from "@/lib/firebaseAdmin";

const VISITS_DOC = ["counters", "visits"] as const;
// Optional display offset so the badge doesn't start at 0. Set to a starting
// number if you want the counter to begin higher.
const VISIT_BASE = 0;

/** Atomically increment the global visit counter and return the new total. */
export async function bumpVisits(): Promise<number> {
  const ref = db().collection(VISITS_DOC[0]).doc(VISITS_DOC[1]);
  return db().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const cur =
      snap.exists && typeof snap.data()?.count === "number"
        ? (snap.data()!.count as number)
        : VISIT_BASE;
    const next = cur + 1;
    tx.set(ref, { count: next }, { merge: true });
    return next;
  });
}

/** Read the current global visit count without incrementing. */
export async function getVisits(): Promise<number> {
  const snap = await db().collection(VISITS_DOC[0]).doc(VISITS_DOC[1]).get();
  return snap.exists && typeof snap.data()?.count === "number"
    ? (snap.data()!.count as number)
    : VISIT_BASE;
}
