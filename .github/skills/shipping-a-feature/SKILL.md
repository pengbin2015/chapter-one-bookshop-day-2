---
name: shipping-a-feature
description: "Use when asked to ship, build, or deliver a feature listed in docs/intent.md end-to-end — e.g. 'ship F1', 'build feature F2 from the intent'. Runs design → plan → implement (TDD) → review → pull request, stopping at three human gates. Load this BEFORE brainstorming; it runs brainstorming itself."
---

# Shipping a Feature

Take one feature from `docs/intent.md` to an open pull request. This skill is
the **conductor**: it does not re-describe how to design, plan, test, or review
— it reads the skill for each step **by file path** and checks that the step's
artifact exists before moving on.

<HARD-GATE>
Progress is decided by files, not by feeling. A step is complete only when its
artifact exists (and is committed where stated). If the artifact is missing,
you are still in that step. Never skip a step because it "seems done".
</HARD-GATE>

## Announce every step

Start the reply, and every step change, with exactly:
`Using shipping-a-feature to ship F<n> — step <k>/6: <step name>`

## Step 0 — Resolve where to start (always run)

1. Read `docs/intent.md`. It must exist and say `Status: Approved`, and must
   contain the requested feature ID. If not: STOP and say
   `No approved intent for F<n>. Run capturing-intent first.`
2. Let `<slug>` = kebab-case feature name (e.g. `cart-checkout`).
3. Branch: if on `main`, run `git switch -c feat/f<n>-<slug>`. Never commit
   feature work to `main`.
4. Find the first missing artifact and **jump to that step**:

| Step | Artifact that proves the step is done                                                   |
| ---- | --------------------------------------------------------------------------------------- |
| 1    | `docs/superpowers/specs/*-<slug>-design.md` committed, containing `Traces to: intent F<n>` |
| 2    | `docs/superpowers/plans/*-<slug>.md` committed, containing `Status: Approved`            |
| 3    | every phase in the plan ticked `[x]`, and `npm test` green                                |
| 4    | reviewer verdict `READY` recorded in `docs/superpowers/reviews/<slug>-review.md`          |
| 5    | a pull request URL for the branch                                                         |

**AFK mode.** If you are running as the Copilot cloud agent on an issue
labelled `afk-ready`, the issue body is the approved spec and plan: skip steps
1–2 and Gates 1–2, implement the issue as a single phase, then continue at
step 3.

## Step 1 — Design (human gate 1)

1. Read `.github/skills/brainstorming/SKILL.md` and follow it, with these
   overrides:
   - Seed it with the `F<n>` section of `docs/intent.md`, its pain points, and
     its "Not in this feature" list. Do not re-ask what the intent answers.
   - The spec's first lines must be `Traces to: intent F<n>` and a
     `## Done when` list.
   - Skip the visual companion.
   - When brainstorming says to invoke writing-plans, come back here instead.
2. **Gate 1:** the user approves the written spec (brainstorming's own
   review step). Artifact check → step 2.

## Step 2 — Plan (human gate 2)

1. Dispatch the `planner` subagent with: the spec path, and the instruction
   "Follow `.github/skills/writing-plans/SKILL.md`. Phase 1 must be a vertical
   tracer bullet. Return the full plan markdown; do not choose an execution
   mode."
2. Save the result to `docs/superpowers/plans/<YYYY-MM-DD>-<slug>.md`. Every
   phase heading gets a checkbox: `## [ ] Phase 1 — ...`.
3. **Gate 2:** show the phase list and ask _"Approve this plan? (yes /
   changes)"_. On yes, add `Status: Approved` under the title and commit with
   `docs(plan): plan F<n> <slug>` (use `.github/skills/committing-changes/SKILL.md`).
4. From here to step 5, **do not pause for the human** unless BLOCKED.

## Step 3 — Implement, phase by phase

For each unticked phase, in order:

1. Dispatch the `implementer` subagent with only: the plan path, the phase
   number, and the spec path. (It follows TDD and verification-before-completion.)
2. Dispatch the `reviewer` subagent in **phase mode** with: the spec path, the
   plan path, the phase number, and the diff range `<sha-before>..HEAD`.
3. If the reviewer says `FIX`, send its findings back to the implementer.
   At most **2 fix rounds** per phase; after that STOP and report BLOCKED with
   the open findings.
4. On `PASS`, tick the phase `[x]` in the plan and commit
   `docs(plan): complete phase <k>`.

**Fallback:** if custom subagents are unavailable in this environment, read
`.github/skills/subagent-driven-development/SKILL.md` and follow it for this
step instead, then return here for step 4.

## Step 4 — Final review

1. Dispatch the `reviewer` subagent in **final mode** with: the spec path,
   the plan path, and the diff range `main..HEAD`.
2. Save its report to `docs/superpowers/reviews/<slug>-review.md` and commit
   `docs(review): final review for F<n>`.
3. Verdict `NOT READY` → send findings to the implementer (max 2 rounds),
   then re-run this step. Still not ready → STOP, report BLOCKED.

## Step 5 — Open the pull request

Read `.github/skills/opening-a-pull-request/SKILL.md` and follow it.

## Step 6 — Hand over (human gate 3)

End with exactly:

```
F<n> shipped to PR: <url>
Gate 3 is yours: review the PR and merge when every done-when item is met.
```

Then STOP. **Never merge.** The agent that wrote the code does not approve it.

## Red flags

| Thought                                           | Reality                                                       |
| ------------------------------------------------- | ------------------------------------------------------------- |
| "The spec is obvious, skip brainstorming"         | No spec file = still in step 1.                               |
| "I'll implement all phases in one go"             | One phase per implementer dispatch keeps each in the smart zone. |
| "Reviewer flagged something minor, I'll move on"  | Only `PASS` / `READY` moves you on.                           |
| "Tests pass, I'll merge to save the human time"   | Never merge. Gate 3 belongs to a human.                       |
