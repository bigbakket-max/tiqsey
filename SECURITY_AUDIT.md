# Tiqsey repository audit

**Audit branch:** `fix/tiqsey-github-audit`  
**Baseline:** `main` at `5690581fb3c6eb4ce5348ea4338b116f208325ef`  
**Status:** Initial source review only. No production deployment or live database was changed.

## Verified findings

### Critical — frontend-controlled authentication and administrator identity
File: `src/contexts/AuthContext.tsx`

- A fixed administrator password is embedded in browser-delivered source.
- Demo and administrator user records, including password values, are seeded into browser local storage.
- The frontend restores a user from local/session storage and derives administrator status from client-controlled role/email fields.
- Login and registration continue with a local fallback when the backend is unavailable. This means the browser can establish a local identity without a successful server authentication response.

**Required remediation:** make the server the sole authority for authentication and authorization; remove all credentials and password material from frontend bundles/storage; use signed HttpOnly sessions; require server-side authorization for every protected API; migrate registration/login to a real identity store; remove local demo/admin account seeding from production builds. Do not treat a hidden admin URL or client route guard as security.

### High — registration endpoint does not create an account
File: `server.ts`, route `POST /api/auth/register`

The current handler only checks that name, email, and password are present and returns success. It does not persist or verify an account in the inspected handler.

**Required remediation:** implement validated account creation with password hashing, unique email enforcement, rate limiting, and a real persistent user store.

### High — booking API authorization needs review
File: `server.ts`, routes under `/api/bookings`

The inspected `GET /api/bookings` and `POST /api/bookings` handlers do not show an authorization guard at the route entry. Booking reads/writes must be restricted to the owner or an authenticated administrator, and fields/amounts must be validated server-side.

**Required remediation:** enforce session authentication and per-record ownership/admin checks; never trust client-supplied totals, payment status, role, or booking ownership.

### High — Supabase service credential configuration
Files: `server.ts`, `.env.example`, `src/lib/supabase.ts`

The server accepts several fallback key variables, including public/anon-style keys. The service-role key must remain server-only and must never be exposed through Vite's `VITE_*` variables or returned to a browser. Browser access must use the publishable/anon key with restrictive RLS policies.

**Required remediation:** separate server and browser configuration explicitly; reject service-role keys in client configuration; verify RLS for bookings and Storage using least privilege.

## CI added by this branch

- Node.js 22
- `npm ci`
- `npm run lint` (the repository's TypeScript no-emit check)
- `npm run build` (Vite frontend and Express server bundle)

### High — dependency lockfile is stale
File: `package-lock.json`

GitHub Actions confirmed `npm ci` fails because the committed lockfile does not match `package.json` (including Vite and esbuild version mismatches and missing optional platform packages). The CI workflow now uses `npm install` in its ephemeral runner to reconcile dependencies for the audit checks. The repository lockfile itself still needs to be regenerated and committed from a trusted Node/npm environment; do not consider this a permanent dependency-lock fix.

## Not yet verified

- CI execution result on this branch (workflow must run in GitHub Actions).
- Live Supabase schema, RLS policies, bucket existence, and production secrets.
- End-to-end login, Google OAuth callback, booking ownership, payment/webhook integrity, and admin route coverage.
- Hostinger production deployment and database backup/restore.

## Safety boundary

This audit intentionally does not alter `main`, merge old pull requests, modify live Supabase policies, rotate secrets, or deploy to Hostinger. Security remediation must be implemented and tested in isolated commits before production rollout.
