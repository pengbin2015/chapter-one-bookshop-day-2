---
name: committing-changes
description: "Use when changes need to be committed — e.g. 'commit this', 'commit the phase', or when another skill says to commit. Stages one logical change and writes a Conventional Commit using the domain glossary."
---

# Committing Changes

**Announce first:** `Using committing-changes.`

1. Review the working changes with `git status` and `git diff`.
2. Group them into **one logical commit**. If they belong in separate commits,
   say so and commit them one at a time.
3. Stage only the relevant files. Never stage `node_modules`, secrets, `.env`
   files, or unrelated changes.
4. Write the message:
   - summary line `type(scope): summary`, under ~60 characters
     (types: feat, fix, docs, chore, refactor, test) — e.g.
     `feat(cart): add cart tracer route`;
   - a blank line;
   - a short body explaining **why**, if not obvious;
   - use the vocabulary in `docs/glossary.md` (cart, line item, checkout, ...).
5. When working interactively, show the staged files and the message before
   committing. When running as a subagent or in AFK mode, commit directly.
6. Run `git commit`. If the pre-commit hook changes files, re-stage them and
   commit again — do not bypass the hook with `--no-verify`.
