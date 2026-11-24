# Tiqsey security and code audit

**Branch:** `fix/tiqsey-security-hardening`  
**Base:** current `main` at `8094b01cbaf0a913f35abf9b51a949ce8bab3798`  
**Scope:** Code fixes and CI on this branch only. No production deployment, live Supabase mutation, secret rotation, or database deletion was performed.

## Implemented on this branch

### Authentication and sessions
Files: `server.ts`, `src/contexts/AuthContext.tsx`, `src/admin/pages/AdminSignInPage.tsx`

- Removed browser-delivered administrator/demo passwords and local mock-user seeding.
- Removed localStorage as an authentication authority. The browser now restores the signed HttpOnly server session.
- Login and registration require server responses; offline/local fallback no longer creates a signed-in identity.
- Added persistent customer accounts in SQLite with salted PBKDF2 password hashes, unique email enforcement, validation, a 10-character minimum password, and sign-in throttling.
- Added a server-backed customer profile update endpoint.
- Administrator self-registration is blocked. Admin sign-in credentials remain server-side.
- Disabled the old client-only Google sign-in shortcut because email/name/avatar fields supplied by a browser do not verify Google identity. A server-verified OAuth ID-token flow is still required.

### API and authorization
File: `server.ts`

- Removed admin authorization based on caller-supplied email headers, query parameters, or request body fields.
- Admin access now requires a signed administrator session or an active database-backed staff session with an administrator role.
- Added Origin-based CSRF validation for cookie-authenticated state-changing requests.
- Protected booking reads, booking updates/deletes, custom-domain management, inventory mutations, Supabase diagnostics, Instagram administration, media administration, and Gemini content generation.
- Customer-created bookings are stored as `Confirmation Pending`; customers cannot overwrite existing bookings.
- Reviews require a signed-in customer, a completed booking, and a matching booking email. Public review responses omit private reviewer identifiers.
- Added validation to booking and profile inputs.

### Supabase and media storage
Files: `server.ts`, `src/lib/supabase.ts`, `src/utils/mediaStorageClient.ts`, `src/admin/pages/StorageManager.tsx`

- Validate Supabase URL protocol and hostname in both browser and server clients. The configured Tiqsey `*.supabase.co` project and local development are accepted; arbitrary hosts are rejected.
- The server prefers `SUPABASE_SERVICE_ROLE_KEY`; service-role credentials are not injected into browser builds.
- Removed anonymous browser-side Storage upload, move, and delete fallbacks. Mutations now require the authenticated Tiqsey Node API.
- Replaced Storage SQL templates that granted anonymous INSERT/UPDATE/DELETE with public-read-only bucket policies.
- Enabled RLS and revoked browser-role access to the `media_assets` metadata table.
- Updated the Storage error dialog so it no longer tells administrators to grant anonymous write permissions.

**Important:** These are source-code/template changes only. They do not change existing live Supabase policies. Verify the live project's policies separately before deployment.

### Frontend/build fixes
Files: `vite.config.ts`, `src/admin/components/MediaLibraryPickerModal.tsx`

- Removed Vite's definition that could expose `GEMINI_API_KEY` in browser bundles.
- Fixed the progress-bar component props to match its typed interface.
- Added Node 22 TypeScript and production-build CI checks.

### Database hygiene
File: `.gitignore`

- Added ignore rules for runtime SQLite databases and journal files.
- The already-tracked `bookings.db` has **not** been deleted. The repository is public, and the database may contain booking records needed by the current deployment. It must be backed up and reviewed before removal from Git and history. Adding it to `.gitignore` does not untrack the existing file.

## CI and dependency lockfile

The workflow runs Node.js 22, dependency installation, `npm run lint` (TypeScript no-emit), and `npm run build`.

The first CI run found that `package-lock.json` does not match `package.json`, so `npm ci` fails. CI currently uses `npm install` as a temporary workaround. Regenerate and commit the lockfile from a trusted Node/npm environment before production release.

## Remaining before merge/deployment

- Verify latest CI after the most recent Storage security changes.
- Implement verified Google OAuth before re-enabling Google sign-in.
- Back up and review the public tracked `bookings.db`; then remove the database from Git history in a controlled way. Rotate any credentials that were previously committed.
- Verify live Supabase schema, buckets, and RLS. Do not add anonymous Storage write policies.
- Verify payment-provider signatures and server-side payment state; a client-supplied booking amount is not proof of payment.
- Run end-to-end tests for customer login/registration, admin/staff roles, checkout, vouchers, reviews, and Hostinger.
- Set a stable `SESSION_SECRET` and strong `ADMIN_PASSWORD` in the production environment. Rotate any administrator credential that was previously exposed in frontend source.

## Deployment boundary

No changes have been merged into `main`, no live Supabase policies or data were changed, no secrets were rotated, and nothing was deployed to Hostinger. Keep this PR in draft until the remaining items are reviewed.
