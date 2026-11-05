# Tooling report — Phase 0 (2026-10-25)

Branch: `rebuild/store`. Spec: BUILD_SPEC §11. Decisions: MongoDB (kept), Better Auth, Resend, off-white theme.

## 1. Already installed (no action)
| Tool | Where | Notes |
|---|---|---|
| `design-taste-frontend` (tasteskill v2) | `~/.claude/skills` (user) | **The single primary design skill.** v2 has no "dials" and requires a motion layer, so DESIGN.md §11 tells it to skip the direction draw and the motion step. DESIGN.md wins. |
| `find-docs` skill + `ctx7` CLI | user | Context7 coverage. The **Context7 MCP was skipped** as a duplicate. |
| `playwright-cli` | `/usr/local/bin` | Ships its own skill (reported in `--help`). |
| Claude in Chrome | connected | Browser verification (§11.7). |
| `skill-creator`, `/security-review` | built in | — |
| `graphify` | user | Optional and unused for now. Revisit once there are many modules. |

## 2. Installed now (project-level, `.claude/skills/`, tracked in `skills-lock.json`)
| Skill | Source | Command | Invocation |
|---|---|---|---|
| `web-design-guidelines` | vercel-labs/agent-skills | `npx skills add vercel-labs/agent-skills --skill web-design-guidelines --agent claude-code --copy -y` | **Manual only** (`disable-model-invocation: true`). Note: it WebFetches the rules from raw.githubusercontent.com each run. |
| `vercel-react-best-practices` | vercel-labs/agent-skills | same command, `--skill vercel-react-best-practices` | Auto |
| `better-auth-best-practices` | better-auth/skills (official) | `npx skills add better-auth/skills --skill … --agent claude-code --copy -y` | Auto |
| `email-and-password-best-practices` | better-auth/skills | same | Auto |
| `better-auth-security-best-practices` | better-auth/skills | same | Auto |
| `monte-store` (project skill) | written here | — | Auto, with `references/payments.md` and `references/design.md` |

I read all installed SKILL.md files before use. None runs scripts or asks for extra permissions.

## 3. Created or configured
- `DESIGN.md`: the design system from spec §2 (tokens, type, components, states, motion, do's and don'ts, agent guide).
- `CLAUDE.md`: §11.5 rules appended.
- `.claude/settings.json`: denies `Read(./.env*)`, `./.audit/.env`, `node_modules`, `.next` and `dist`. A PostToolUse `Edit|Write` hook (`.claude/hooks/check-ts.sh`) runs ESLint on the edited TS/JS file plus `npm run typecheck`, and errors go back to Claude (about 8s per edit).
- `package.json`: new `typecheck` script (`tsc --noEmit`).
- `.gitignore`: `/.audit/`, `/.taste-skill/`.

## 4. Skipped, and why
| Item | Reason |
|---|---|
| Anthropic `frontend-design` | Would duplicate the primary design skill (tasteskill). |
| Taste `redesign-skill` / minimalist variant | **No longer exists.** taste-skill v2 now ships only `design-taste-frontend` (checked with `--list`). |
| Context7 MCP | Duplicates `ctx7` CLI + `find-docs`. |
| Vercel `vercel-react-native-skills`, `vercel-react-view-transitions`, `deploy-to-vercel`, `vercel-optimize`, `vercel-composition-patterns` | Not needed (web only, no view transitions by design) or premature (optimize needs a deployed project). |
| Better Auth `organization`, `two-factor`, `create-auth` | No multi-tenant setup or 2FA in v1. `create-auth` overlaps with the best-practices skill. |
| OmniRoute, Image-to-code, Maestro, Expo, mobile skills | Per spec. |
| Ponytail | Optional per spec. Not trialled yet, and could be trialled on one feature later. |

## 5. Candidates awaiting your approval (§11.3 research)
| Candidate | Source | What it adds | Risk / permissions | Token cost |
|---|---|---|---|---|
| **Paystack MCP server** (public preview) | [PaystackOSS/paystack-mcp-server](https://paystack.com/docs/developer-tools/mcp-server/), MIT, official | Live API exploration, plus a `paystack://skill` resource with current API docs and snippets. Lets Claude run test-mode calls (initialize, verify, refund). | Needs `sk_test_…` (live keys are rejected by design). It executes real API calls on the test account. The key goes in the MCP env, never in a prompt. | About 2 tool schemas, small |
| **MongoDB Claude plugin** (MCP + skills) | [mongodb/agent-skills](https://www.mongodb.com/docs/claude), official | Schema and index inspection, explain plans, query help against the dev DB. | Needs a connection string, so **use a read-only dev user**. Read/write tools can modify data. | Medium (many tools). Can be enabled only when needed. |
| **Deque axe MCP server** | [docs.deque.com](https://docs.deque.com/devtools-server/4.0.0/nl/setup-claude-code), official | axe-core a11y analysis and fix suggestions. | Docker image, and it may need an axe DevTools licence. | Small |
| Alternative to axe MCP | `@axe-core/playwright` (Deque, npm) | The same axe rules inside our Playwright e2e tests in CI, without needing an MCP. | Dev dependency only | Zero context |
| Cloudinary | — | No official Cloudinary MCP/skill found worth adding. Use `ctx7` for docs. | — | — |

**My recommendation:** approve the Paystack MCP (test key) for Phase 3, and use `@axe-core/playwright` in Phase 7 instead of the axe MCP. Add the MongoDB plugin only if you're happy to create a read-only dev DB user.

## 6. Context footprint
Slash commands (`/context`, `/skills`, `/plugin`, `/doctor`) can't be run from inside my session. Run `/context` to see the exact numbers. Measured: the 6 new project skills add about **2.3 KB of frontmatter** (about 600 tokens) to every session, and their bodies (1–11 KB each) load only when a skill triggers. CLAUDE.md is about 1 KB. DESIGN.md (about 9.7 KB) is read on demand for UI work.

## 7. Trigger tests (headless `claude -p`, plan mode, Skill calls captured)
| Prompt | Skills loaded | Result |
|---|---|---|
| "Build the product tile component for the shop grid." | `design-taste-frontend`, `vercel-react-best-practices`, `monte-store` | ✅ The design skill loads. `monte-store` also loads, which is acceptable since its UI section points to DESIGN.md. |
| "Implement the Paystack webhook route handler that marks orders paid." | `monte-store`, `find-docs` | ✅ The store skill loads and docs are checked. No design skill. |
| "What does the git log say about the last commit message?" | none | ✅ |

## 8. Notes for Phase 1
- Next is 15.5.20 but `eslint-config-next` is 16.2.10. Upgrade to Next 16 in Phase 1 (`middleware.ts` → `proxy.ts`), after which `node_modules/next/dist/docs/` (referenced by AGENTS.md) will exist.
- MongoDB transactions need a replica set (Atlas is fine). Confirm that the production `MONGODB_URI` is Atlas.
- Export the existing waitlist subscribers to CSV before the subscriber code is deleted.
