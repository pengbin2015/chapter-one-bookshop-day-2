# AGENTS.md — Chapter One Bookshop

Instructions for any AI agent (GitHub Copilot, Claude, etc.) working in this repo.
Keep this file short; it is loaded into the agent's context on every task.

## What this project is

Chapter One is a **deliberately small online bookshop**, used to teach the
AI-augmented software development lifecycle. This starter can **browse the
catalogue and open a book**. It deliberately has **no cart and no checkout**;
those features are built with a skill-driven workflow.

See `docs/glossary.md` for the domain vocabulary and `docs/adr/` for the
decisions behind the architecture. Use that vocabulary in code, tests, commits,
and any spec you write.

## How it is built

- **Backend:** Express + TypeScript in `src/`. Run directly with `tsx` — there
  is **no build step**.
- **Frontend:** plain HTML + vanilla JS + one stylesheet in `public/`. **No
  framework.**
- **Data:** an in-memory store (`src/store.ts`), seeded from `src/data/seed.ts`.
  There is **no database**; restarting the server resets all data. This is
  intentional (see `docs/adr/0001-in-memory-store.md`).
- One process, one port (default 3000). The Express server also serves `public/`.

## Commands

- `npm run dev` — start the server with reload at http://localhost:3000
- `npm test` — run the Vitest suite (must stay green)
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — ESLint
- `npm run format` — Prettier (write) / `npm run format:check` (verify)

## Guardrails (do not cross without being asked)

- **No new dependencies.** Solve problems with what is already installed. If you
  believe a dependency is truly required, stop and ask first.
- **No CSS frameworks.** No Tailwind, Bootstrap, etc.
- **All styling lives in `public/styles.css`** — one stylesheet, no inline
  styles, no extra CSS files.
- **No build tooling.** Do not add a bundler, transpile step, or framework.
- **Never weaken the tests to make them pass.** Fix the code, not the assertion.
- Keep cart + checkout scoped to the existing architecture: no users, no auth,
  no sessions, no database, no payment provider. Use a returned `cartId` and
  in-memory state unless the design doc explicitly changes that scope.
- Implement cart + checkout in phases. A first phase should be a vertical tracer
  bullet that crosses route, store, and tests with minimal behaviour.
- Do not claim a phase is complete without fresh evidence from `npm test`,
  `npm run typecheck`, and `npm run lint`, or a clear explanation of why a
  command could not run.

## Conventions

- API routes live in `src/routes/`, mounted in `src/app.ts`.
- Every API error is JSON in the shape `{ "error": "message" }` with an
  appropriate HTTP status (see `.github/instructions/backend.instructions.md`).
- Frontend code escapes anything it puts into HTML (see
  `.github/instructions/frontend.instructions.md`).
- Tests check external behaviour, not internals (see
  `.github/instructions/tests.instructions.md`).
- Commit messages follow Conventional Commits: `type(scope): summary`
  (feat, fix, docs, chore, refactor, test).

Path-specific detail is in `.github/instructions/*.instructions.md`; those apply
automatically to the files they name.

## Skill routing — read before choosing a skill

These rules take precedence over any skill-priority rule inside a skill
(including `using-superpowers`). Pick the first row that matches, then read
that skill **by path** and follow it.

| The request...                                                         | Read first                                                                  |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| turns feedback, pain points, or an idea into requirements              | `.github/skills/capturing-intent/SKILL.md`                                  |
| names a feature ID (`F1`, `F2`, ...) or asks to ship/build/deliver one | `.github/skills/shipping-a-feature/SKILL.md` (it runs brainstorming itself) |
| asks to open or raise a pull request                                   | `.github/skills/opening-a-pull-request/SKILL.md`                            |
| asks to commit                                                         | `.github/skills/committing-changes/SKILL.md`                                |
| any other new feature or behaviour change                              | `.github/skills/brainstorming/SKILL.md`                                     |
| a bug or failing test                                                  | `.github/skills/systematic-debugging/SKILL.md`                              |

Every skill and agent starts its reply with an announce line
(`Using <skill> ...` or `<agent>: ...`). If it is missing, the skill did not
load — stop and read it.

If `docs/intent.md` exists, every spec must trace to one of its feature IDs
(`Traces to: intent F<n>`).

## What else is in .github/

- `agents/` — role agents. `product-manager` and `orchestrator` appear in the
  agent menu; `planner`, `implementer`, and `reviewer` run only as subagents.
  Each agent file sets its model, tools, and the skills it reads.
- `skills/capturing-intent/`, `skills/shipping-a-feature/`,
  `skills/opening-a-pull-request/`, `skills/committing-changes/` — this repo's
  own skills for the intent-to-PR flow.
- `skills/brainstorming/`, `skills/using-git-worktrees/`,
  `skills/writing-plans/`, `skills/subagent-driven-development/`,
  `skills/executing-plans/`, `skills/test-driven-development/`,
  `skills/requesting-code-review/`,
  `skills/finishing-a-development-branch/`, `skills/writing-skills/`,
  `skills/using-superpowers/`, `skills/systematic-debugging/`, and
  `skills/verification-before-completion/` — vendored Superpowers skills.
- `pull_request_template.md` — the PR body every agent-opened PR fills in.
- `ISSUE_TEMPLATE/afk-ready.yml` — issue form for tickets small and precise
  enough for the AFK pipeline.

## The intent-to-PR flow

See `docs/ai-native-flow.md` for the full picture. In short:

1. `capturing-intent` — raw input in `docs/inputs/` → approved `docs/intent.md`
   with features F1…Fn.
2. `shipping-a-feature` — for one feature: `brainstorming` (spec, gate 1) →
   `writing-plans` (plan, gate 2) → implement phase by phase with
   `test-driven-development` + `verification-before-completion` →
   `requesting-code-review` → `opening-a-pull-request` → a human reviews and
   merges (gate 3).

In class we use a feature branch instead of `using-git-worktrees`, and
`opening-a-pull-request` instead of `finishing-a-development-branch`.

## AFK pipeline

See `docs/afk-pipeline.md` for the issue-template, orchestrator, and PR-review
flow used by the AFK demo.
