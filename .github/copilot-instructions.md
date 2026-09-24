# Copilot instructions

The authoritative, repo-wide instructions for this project live in **`AGENTS.md`**
at the repository root. Read that file first.

Key points, repeated here because some Copilot surfaces read this file:

- No new dependencies, no CSS frameworks, no build step.
- All styling goes in `public/styles.css`.
- API errors are JSON `{ "error": "..." }` with an appropriate status code.
- Keep the test suite green; never weaken a test to make it pass.
- Follow the **Skill routing** table in `AGENTS.md` and read the chosen skill
  by path. Feature work flows: `capturing-intent` -> `docs/intent.md` ->
  `shipping-a-feature` (brainstorming -> writing-plans -> TDD implementation
  -> review -> `opening-a-pull-request`).

Path-specific rules are in `.github/instructions/*.instructions.md`.
