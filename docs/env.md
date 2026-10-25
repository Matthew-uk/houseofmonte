# Environment variables

Set these in `.env.local` for development and in the Vercel project for preview and production. Never commit values. Claude Code is denied read access to `.env*`, so this file is the reference.

| Variable | Required | Used by | Notes |
|---|---|---|---|
| `MONGODB_URI` | yes | `lib/db.ts`, Better Auth | Atlas SRV URI including the database name. Atlas is a replica set, which stock transactions need. |
| `BETTER_AUTH_SECRET` | yes | Better Auth | At least 32 chars: `openssl rand -base64 32`. Rotating it signs everyone out. |
| `BETTER_AUTH_URL` | yes | Better Auth | Base URL, e.g. `http://localhost:3000`, `https://montedeluxe.com`. |
| `NEXT_PUBLIC_SITE_URL` | yes | SEO, Paystack callback | e.g. `https://montedeluxe.com` (no trailing slash). |
| `RESEND_API_KEY` | prod | `lib/email/send.ts` | Without it, dev prints emails to the server console. Production throws. |
| `EMAIL_FROM` | prod | `lib/email/send.ts` | e.g. `MONTÈ <hello@montedeluxe.com>`. The domain must be verified in Resend. |
| `ADMIN_EMAIL` | seed | `scripts/seed.ts` | The first admin account. |
| `ADMIN_PASSWORD` | seed | `scripts/seed.ts` | Initial admin password (min 8). Change it after first login. |
| `PAYSTACK_SECRET_KEY` | Phase 3 | checkout, webhook | `sk_test_…` everywhere except production. Server only. |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Phase 3 | checkout | `pk_test_…` / `pk_live_…`. |
| `CLOUDINARY_CLOUD_NAME` | Phase 2 | uploads | — |
| `CLOUDINARY_API_KEY` | Phase 2 | uploads | — |
| `CLOUDINARY_API_SECRET` | Phase 2 | uploads | Server only. |
| `CRON_SECRET` | Phase 3 | `/api/cron/*` | Vercel Cron sends it as a bearer token. |
| `TURNSTILE_SECRET_KEY` / `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Phase 6 | Face of MONTÈ form | — |

No longer used (safe to delete from `.env.local` and Vercel): `SESSION_SECRET`, `SMTP_*` / Hostinger mail settings.

Scripts load env with Node's flag: `npx tsx --env-file=.env.local scripts/<name>.ts`.
