# Environment variables

Set these in `.env.local` for development and in the Vercel project for preview and production. Never commit values. Claude Code is denied read access to `.env*`, so this file is the reference.

| Variable | Required | Used by | Notes |
|---|---|---|---|
| `MONGODB_URI` | yes | `lib/db.ts`, Better Auth | Atlas SRV URI including the database name. Atlas is a replica set, which stock transactions need. |
| `BETTER_AUTH_SECRET` | yes | Better Auth | At least 32 chars: `openssl rand -base64 32`. Rotating it signs everyone out. |
| `BETTER_AUTH_URL` | yes | Better Auth | Base URL, e.g. `http://localhost:3000`, `https://montedeluxe.com`. |
| `NEXT_PUBLIC_SITE_URL` | yes | SEO, Paystack callback | e.g. `https://montedeluxe.com` (no trailing slash). |
| `ADMIN_EMAIL` | seed | `scripts/seed.ts` | The admin account. Public sign-up is disabled, so this is the only way in. |
| `ADMIN_PASSWORD` | seed | `scripts/seed.ts` | Admin password (min 8). Re-running the seed resets the admin to this value, which is how to recover a lost password. |

No longer used (safe to delete from `.env.local` and Vercel): `SESSION_SECRET`, `SMTP_*` / Hostinger mail settings. Image uploads need no env vars: the API URL is in `lib/upload.ts`.

Scripts load env with Node's flag: `npx tsx --env-file=.env.local scripts/<name>.ts`.
