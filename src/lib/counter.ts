import "server-only";
import { db } from "@/lib/firebaseAdmin";

const COUNTER_DOC = ["counters", "submissions"] as const;
const START_AT = 860000; // first assigned number will be 860001

/**
 * Atomically reserve the next sequential form number (starts at 860001).
 * Uses a Firestore transaction so concurrent submissions never collide.
 */
export async function nextFormNumber(): Promise<number> {
  const ref = db().collection(COUNTER_DOC[0]).doc(COUNTER_DOC[1]);
  return db().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const last =
      snap.exists && typeof snap.data()?.last === "number"
        ? (snap.data()!.last as number)
        : START_AT;
    const next = last + 1;
    tx.set(ref, { last: next }, { merge: true });
    return next;
  });
}
