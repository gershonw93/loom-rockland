import "server-only";
import {
  getApps,
  initializeApp,
  cert,
  applicationDefault,
  type App,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

/**
 * Lazily initialise the Firebase Admin SDK.
 * Server-side only — never import this from a client component.
 *
 * Credentials are resolved in this order:
 *  1. Explicit service-account key from FIREBASE_* env vars (local / any host).
 *  2. Application Default Credentials — used automatically on Firebase App
 *     Hosting / Cloud Run, where the runtime service account provides creds
 *     and no private key needs to be stored.
 */
function getAdminApp(): App {
  const existing = getApps();
  if (existing.length) return existing[0];

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Secret stores / .env may keep the key with literal "\n"; normalise to real
  // newlines. (A no-op when the key already contains real newlines.)
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

  if (projectId && clientEmail && privateKey) {
    return initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
      storageBucket,
    });
  }

  // Fall back to Application Default Credentials (App Hosting / Cloud Run).
  return initializeApp({
    credential: applicationDefault(),
    projectId: projectId || undefined,
    storageBucket,
  });
}

export function db(): Firestore {
  return getFirestore(getAdminApp());
}

export function bucket() {
  return getStorage(getAdminApp()).bucket();
}

export const SUBMISSIONS_COLLECTION = "submissions";
