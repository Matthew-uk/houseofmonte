<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

Project note: this repo runs **Next.js 16.2** and `.claude/settings.json` denies reading `node_modules/`. Get the same version-pinned guides through Context7 instead: `npx ctx7@latest docs /vercel/next.js/v16.2.9 "<topic>"`. Key 16 changes: `proxy.ts` (export `proxy`) replaces `middleware.ts`; `headers()`, `cookies()`, `params`, `searchParams` are async.
