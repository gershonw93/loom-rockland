# LOOM Rockland — Enrollment Portal

A recreation of the LOOM Social Care Network enrollment form ("Weekly Free Meal
Boxes & Support Services") for Rockland County, with a password-protected admin
dashboard that can **export submissions to CSV for any date range**.

- **Public form** (`/`) — referral, applicant details, delivery address, phone,
  eligibility categories, family size, insurance-card photo upload, Medicaid CINs.
- **Admin dashboard** (`/admin`) — sign in with a password, filter submissions by
  date, view them in a table, and download a CSV.

## Stack

- **Next.js 15** (App Router, TypeScript) — deploy on **Vercel**
- **Firebase** — Firestore (submissions) + Cloud Storage (insurance photos)
- All database/storage access is **server-side via the Firebase Admin SDK**, so
  the public never reads or writes Firestore directly. Insurance photos are
  private; the CSV export embeds short-lived (7-day) signed links.

## 1. Create the Firebase project

1. Go to <https://console.firebase.google.com> → **Add project** (name it e.g.
   `loom-rockland`). Google Analytics is optional.
2. **Build → Firestore Database → Create database** → start in **production
   mode**, pick a US region (e.g. `nam5` / us-east).
3. **Build → Storage → Get started** → production mode, same region.
4. **Project settings (gear) → Service accounts → Generate new private key.**
   This downloads a JSON file — keep it secret. You'll copy three values from it.

## 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in from the service-account JSON:

| Variable | Where it comes from |
| --- | --- |
| `FIREBASE_PROJECT_ID` | `project_id` in the JSON |
| `FIREBASE_CLIENT_EMAIL` | `client_email` in the JSON |
| `FIREBASE_PRIVATE_KEY` | `private_key` in the JSON (keep the `\n` escapes, wrap in quotes) |
| `FIREBASE_STORAGE_BUCKET` | Firebase console → Storage (e.g. `loom-rockland.firebasestorage.app`) |
| `ADMIN_PASSWORD` | A strong password you choose for the `/admin` page |

## 3. Lock down security rules (recommended)

Because all access is server-side, deny client access entirely. The provided
`firestore.rules` and `storage.rules` do this. Apply them in the console
(Firestore → Rules, Storage → Rules) or via the Firebase CLI.

## 4. Run locally

```bash
npm install
npm run dev      # http://localhost:3000  (form)  ·  /admin (dashboard)
```

## 5. Deploy to Firebase App Hosting (GitHub)

The repo ships an `apphosting.yaml`. Non-secret config (project id, client
email, storage bucket) is inline; the private key and admin password come from
Cloud Secret Manager.

1. **Enable billing:** Firebase console → upgrade to the **Blaze** plan (App
   Hosting requires it; this app's usage stays within the free allotment).
2. **Create the two secrets** (Firebase CLI, runs on your machine):
   ```bash
   npm i -g firebase-tools && firebase login
   firebase apphosting:secrets:set firebase-private-key   # paste the JSON private_key
   firebase apphosting:secrets:set admin-password         # choose the /admin password
   ```
   (Each command also grants the App Hosting service account read access.)
3. **Create the backend:** Firebase console → **Build → App Hosting → Get
   started** → connect your GitHub account and pick this repo + the deploy
   branch. App Hosting auto-detects Next.js and reads `apphosting.yaml`.
4. **Deploy:** the first rollout builds and goes live; every push to the chosen
   branch redeploys automatically. The form is at `/`, the admin at `/admin`.

> The Admin SDK falls back to Application Default Credentials on App Hosting, so
> the runtime works even without the explicit key — but keeping
> `firebase-private-key` set guarantees signed photo links work without extra
> IAM grants.

### Alternative: deploy to Vercel

Import the repo in Vercel, add the five env vars from `.env.example` under
**Settings → Environment Variables**, and deploy.

## CSV export

On `/admin`, choose a **From** and **To** date (default: today) and click
**Export CSV**. The file includes every field plus eligibility labels, Medicaid
CINs, and secure photo links, named e.g.
`loom-rockland-enrollments-2026-06-29.csv`. "Show all" clears the date filter.

## Data model (`submissions` collection)

`referredBy`, `firstName`, `lastName`, `dateOfBirth`, `address {line1, line2,
city, state, zip}`, `phone`, `eligibility[]`, `familyMembers`, `medicaidIds[]`,
`photos[{path, filename, contentType, size}]`, `createdAt` (server timestamp).
