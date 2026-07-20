import "server-only";
import { db } from "@/lib/firebaseAdmin";

const VISITS_DOC = ["counters", "visits"] as const;
// The displayed number grows by 1 for every N raw visits, so growth looks
// natural and credible instead of jumping on every page view.
const VISITS_PER_INCREMENT = 7;

/** Increment the raw visit count; return the (slowed) displayed total. */
export async function bumpVisits(): Promise<number> {
  const ref = db().collection(VISITS_DOC[0]).doc(VISITS_DOC[1]);
  const raw = await db().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const cur =
      snap.exists && typeof snap.data()?.raw === "number"
        ? (snap.data()!.raw as number)
        : 0;
    const next = cur + 1;
    tx.set(ref, { raw: next }, { merge: true });
    return next;
  });
  return Math.floor(raw / VISITS_PER_INCREMENT);
}

/** Read the current displayed total without incrementing. */
export async function getVisits(): Promise<number> {
  const snap = await db().collection(VISITS_DOC[0]).doc(VISITS_DOC[1]).get();
  const raw =
    snap.exists && typeof snap.data()?.raw === "number"
      ? (snap.data()!.raw as number)
      : 0;
  return Math.floor(raw / VISITS_PER_INCREMENT);
}
