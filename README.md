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

## 5. Deploy to Vercel

1. Import the repo in Vercel (framework auto-detected as Next.js).
2. Add the same five environment variables under **Settings → Environment
   Variables** (Production + Preview).
3. Deploy. The form is at `/`, the admin dashboard at `/admin`.

## CSV export

On `/admin`, choose a **From** and **To** date (default: today) and click
**Export CSV**. The file includes every field plus eligibility labels, Medicaid
CINs, and secure photo links, named e.g.
`loom-rockland-enrollments-2026-06-29.csv`. "Show all" clears the date filter.

## Data model (`submissions` collection)

`referredBy`, `firstName`, `lastName`, `dateOfBirth`, `address {line1, line2,
city, state, zip}`, `phone`, `eligibility[]`, `familyMembers`, `medicaidIds[]`,
`photos[{path, filename, contentType, size}]`, `createdAt` (server timestamp).
