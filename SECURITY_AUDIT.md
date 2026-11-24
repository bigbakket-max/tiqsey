# Tiqsey repository audit and remediation

**Branch:** `fix/tiqsey-github-audit`  
**Baseline:** `main` at `5690581fb3c6eb4ce5348ea4338b116f208325ef`  
**Scope:** Source-code remediation and CI on this branch only. No production deployment or live Supabase changes were made.

## Remediated in this branch

### Authentication and browser session handling
Files: `server.ts`, `src/contexts/AuthContext.tsx`

- Removed hardcoded administrator/demo passwords and local mock-user seeding from the browser authentication flow.
- Removed browser-local-storage authentication as an authority. The UI now restores sessions from the server's signed HttpOnly cookie.
- Login and registration now require successful server responses; offline/local fallback no longer creates a signed-in browser identity.
- Added persistent SQLite customer accounts with salted PBKDF2 password hashes, unique email enforcement, input validation, a minimum 10-character password, and a signed-session profile update endpoint.
- Added a basic in-memory sign-in throttle (five failed attempts per email/IP over 15 minutes).
- Administrator login continues to use server-side configuration or the existing server-side staff credential store. Administrator self-registration is blocked.
- The old `loginWithGoogle(email, name, avatar)` client-only shortcut has been disabled because profile fields supplied by the browser are not proof of Google identity. A real Google OAuth ID-token verification flow still needs to be implemented before Google sign-in can be enabled.

### Admin and booking API authorization
File: `server.ts`

- Removed authorization bypasses based on caller-supplied `x-admin-email`, query parameters, or body fields.
- Admin access now requires a valid signed administrator session or a valid active database-backed staff session with an administrator role.
- Added Origin-based CSRF validation for cookie-authenticated state-changing requests.
- Added admin authorization to booking collection reads, booking updates/deletes, custom-domain management, inventory mutations, Supabase diagnostics, Instagram administration, and Gemini content generation.
- Corrected the media upload progress component props to match its typed interface.
- New customer bookings are stored as `Confirmation Pending`; non-admin callers cannot overwrite an existing booking.
- Booking fields are validated before new records are stored.
- Reviews now require a signed-in customer, a completed booking, and a matching booking email; public attraction-review responses omit private email/user identifiers.

### API key exposure
File: `vite.config.ts`

- Removed the Vite definition that could inject `GEMINI_API_KEY` into browser bundles. Gemini generation remains a server API operation and is admin-protected.

### Runtime database hygiene
File: `.gitignore`

- Added ignore rules for runtime SQLite databases and journal files. The already-tracked `bookings.db` file has **not** been removed from Git history or the PR because it may contain booking data required by the current deployment. The repository is public, so this file must be reviewed and backed up, then removed from version control/history in a controlled data-migration step. Do not assume adding it to `.gitignore` removes the already-tracked file.

## CI

The GitHub Actions workflow uses Node.js 22, installs dependencies, runs `npm run lint` (TypeScript no-emit check), and runs `npm run build`.

The first run exposed a stale `package-lock.json`: `npm ci` failed because the lockfile did not match `package.json` (including Vite/esbuild version mismatches). The workflow currently uses `npm install` in the ephemeral runner so verification can proceed. This is a workaround, not a permanent lockfile repair. Regenerate and commit the lockfile from a trusted Node/npm environment before production release.

## Still requires verification or user-side setup

- Re-run CI after the latest code changes and inspect both TypeScript and production-build results.
- Implement verified Google OAuth; it is intentionally disabled rather than allowing spoofed client-side identities.
- Verify live Supabase schema, RLS policies, Storage buckets, and server/browser key separation against the actual project.
- Review the public tracked `bookings.db` file and Git history. Back up/migrate production bookings before removing the database artifact; rotate any credentials that may have been committed.
- Verify payment-provider signatures and payment state on the server. The current booking API cannot independently prove that a client-supplied amount was paid.
- Run end-to-end tests for customer registration/login, admin/staff roles, checkout, voucher workflow, review submission, and Hostinger deployment.
- Configure a stable `SESSION_SECRET` and strong `ADMIN_PASSWORD` in the production environment; rotate any administrator credential previously present in the public frontend source.

## Deployment boundary

No changes have been merged into `main`, no live Supabase policies or data were changed, no secrets were rotated, and nothing was deployed to Hostinger. Do not merge/deploy until the remaining items above are reviewed, especially the tracked database and payment verification.
