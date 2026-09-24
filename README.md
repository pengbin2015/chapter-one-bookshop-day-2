# Chapter One Bookshop

A deliberately small online bookshop, used as the working codebase for the
**AI-Augmented SDLC** course. It is real enough to feel like a product and small
enough to hold in your head.

This starter intentionally contains a plain product surface: the storefront can
**browse the catalogue and open a book**. It cannot yet add items to a cart,
edit a cart, or check out. Cart + checkout is the feature to build.

The repo includes an intent-to-PR workflow built from **skills** (procedures)
and **custom agents** (roles), following the stages of Anthropic's AI-Native
SDLC Playbook:

- `capturing-intent` turns raw feedback in `docs/inputs/` into an approved
  `docs/intent.md` with numbered features (F1, F2, ...).
- `shipping-a-feature` takes one feature to a pull request: `brainstorming`
  (spec) → `writing-plans` (plan) → implementation with
  `test-driven-development` and `verification-before-completion` →
  `requesting-code-review` → `opening-a-pull-request`.
- Five role agents in `.github/agents/`: `product-manager` and `orchestrator`
  (pick them in the agent menu), plus `planner`, `implementer`, and `reviewer`
  (subagents).

See `docs/ai-native-flow.md` for the full flow and the demo script.

The AFK-agent demo is documented in `docs/afk-pipeline.md`.

## Run it

Requires **Node 20+**.

```bash
npm install
npm run dev        # http://localhost:3000
```

In another terminal:

```bash
npm test           # 12 tests, all green
curl localhost:3000/api/health
curl localhost:3000/api/books
```

## What's in the box

```
src/            Express + TypeScript backend (run with tsx — no build step)
  routes/       API routes, mounted in app.ts
  data/seed.ts  the starting catalogue
  store.ts      in-memory data store (resets on restart)
public/         the storefront — plain HTML + vanilla JS + one stylesheet
tests/          Vitest suite (Supertest for the API, pure helpers for rendering)
docs/           glossary, ADRs, raw inputs, intent, specs, plans, reviews
.github/        Copilot steering: instruction files, skills, role agents,
                PR and issue templates
```

## The API (starter)

| Method | Path             | Purpose                           |
| ------ | ---------------- | --------------------------------- |
| GET    | `/api/books`     | the whole catalogue               |
| GET    | `/api/books/:id` | one book by its slug id, or `404` |
| GET    | `/api/health`    | liveness check                    |

## Scripts

`npm run dev` · `npm start` · `npm test` · `npm run typecheck` ·
`npm run lint` · `npm run format` / `npm run format:check`

## Working with AI agents here

Read **`AGENTS.md`** first — it holds the conventions, guardrails, and the
skill routing table. Path-specific rules live in `.github/instructions/`,
role agents in `.github/agents/`, and skills in `.github/skills/`.

For the cart + checkout exercise: pick the **product-manager** agent and say
"Turn the feedback in docs/inputs into an intent", then "Design F1". Then pick
the **orchestrator** agent (or press **Build this feature →**) and say
"Ship F1".
