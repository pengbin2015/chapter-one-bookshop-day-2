# Chapter One Bookshop

A deliberately small online bookshop, used as the working codebase for the
**AI-Augmented SDLC** course. It is real enough to feel like a product and small
enough to hold in your head.

This starter intentionally contains a plain product surface: the storefront can
**browse the catalogue and open a book**. It cannot yet add items to a cart,
edit a cart, or check out. Cart + checkout is the feature to build.

The repo includes the Superpowers-style skill chain used in class:

- `brainstorming` refines a rough feature idea through questions and saves a
  design document.
- `using-git-worktrees` creates an isolated branch workspace after design
  approval.
- `writing-plans` breaks the approved design into bite-sized implementation
  tasks.
- `subagent-driven-development` or `executing-plans` implements the plan with
  task-level checkpoints.
- `test-driven-development` enforces red-green-refactor during implementation.
- `requesting-code-review` reviews work between tasks.
- `finishing-a-development-branch` verifies the branch and presents merge / PR /
  keep / discard options.

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
docs/           domain glossary and architecture decision records (ADRs)
.github/        Copilot steering: AGENTS.md conventions, instruction files,
                prompt files, skills, and demo agent roles
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

Read **`AGENTS.md`** first — it holds the conventions and guardrails. Path-specific
rules live in `.github/instructions/`, reusable prompts in `.github/prompts/`,
custom agents in `.github/agents/`, and Basic Workflow skills in
`.github/skills/`.

For the cart + checkout exercise, start by asking the agent to brainstorm the
feature. After design approval, use the worktree, planning, implementation,
TDD, review, and branch-finishing skills as the feature moves through the
workflow.
