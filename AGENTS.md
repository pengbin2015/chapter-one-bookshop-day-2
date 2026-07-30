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

## What else is in .github/

- `prompts/` — reusable slash commands: `/commit`.
- `agents/orchestrator.agent.md`, `agents/implementer.agent.md`, and
  `agents/tester.agent.md` — custom agents for the AFK issue pipeline.
- `ISSUE_TEMPLATE/afk-ready.yml` — structured GitHub issue form for tickets
  that are small and precise enough for the AFK pipeline.
- `skills/brainstorming/`, `skills/using-git-worktrees/`,
  `skills/writing-plans/`, `skills/subagent-driven-development/`,
  `skills/executing-plans/`, `skills/test-driven-development/`,
  `skills/requesting-code-review/`,
  `skills/finishing-a-development-branch/`, `skills/writing-skills/`, and
  `skills/using-superpowers/` — vendored Superpowers Basic Workflow skills and
  required upstream skill dependencies.
- `skills/systematic-debugging/` and
  `skills/verification-before-completion/` — upstream dependencies referenced by
  the vendored Superpowers skills.

## Superpowers workflow

For Module 4 and Module 5, the intended workflow is:

1. `brainstorming` — refine the rough cart + checkout idea and save the design.
2. `using-git-worktrees` — create an isolated branch workspace after approval.
3. `writing-plans` — break the design into small implementation tasks.
4. `subagent-driven-development` or `executing-plans` — implement the plan.
5. `test-driven-development` — use red-green-refactor while implementing.
6. `requesting-code-review` — review between tasks.
7. `finishing-a-development-branch` — verify and choose merge / PR / keep /
   discard.

## AFK pipeline

See `docs/afk-pipeline.md` for the issue-template, custom-agent, tester-gate,
and PR-review flow used by the AFK demo.
