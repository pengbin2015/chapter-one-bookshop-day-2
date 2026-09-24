# Superpowers Working Docs

Use working documents so each context window has something durable to pick up.
The chat history is disposable; these files are the source of truth.

- `../intent.md` — the approved intent (features F1…Fn), from `capturing-intent`.
- `specs/` — design docs created by the `brainstorming` skill. Each begins
  `Traces to: intent F<n>`.
- `plans/` — phased implementation plans created by the `writing-plans` skill
  (via the `planner` agent). Phases are ticked `[x]` as they complete.
- `reviews/` — final review reports from the `reviewer` agent, ending in
  `VERDICT: READY` or `VERDICT: NOT READY`.

Cart + checkout is intentionally not implemented in this starter. Create the
intent first, then the design doc, then the plan, then implement one phase at a
time.
