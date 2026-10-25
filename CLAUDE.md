@AGENTS.md

# MONTÈ store rules

- **Precedence:** payment, security and stock rules always win over "write less code" and over design polish.
- Always read `DESIGN.md` before generating or changing UI. The single primary design skill is `design-taste-frontend` (tasteskill), and DESIGN.md overrides it. Run `/web-design-guidelines <files>` on each finished screen.
- Backend, payments, stock, orders, auth: follow `.claude/skills/monte-store/SKILL.md`.
- Use Context7 (`ctx7` CLI / `find-docs` skill) for any library API you are unsure of (Next.js, Better Auth, MongoDB driver, Paystack, Cloudinary, Resend, Tailwind).
- Run `/security-review` before commits touching auth, checkout, webhooks or admin.
- Money is **integer kobo**. Paystack webhooks verify the HMAC-SHA512 signature over the raw body and are idempotent. Stock decrements are atomic and transactional.
- Never read `.env*` files. Env var names are documented in `.env.example`.
- Brand is spelled **MONTÈ** everywhere.
- Audit skills (`web-design-guidelines`) are manual-only (`disable-model-invocation: true`).
