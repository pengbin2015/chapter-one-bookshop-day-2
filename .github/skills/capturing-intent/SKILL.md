---
name: capturing-intent
description: "Use when turning raw feedback, pain points, or a rough product idea into requirements BEFORE any single feature is designed — e.g. 'turn the shopper feedback into requirements', 'what should we build next', 'write the intent'. Reads docs/inputs/ and produces docs/intent.md with numbered features (F1, F2, ...)."
---

# Capturing Intent

Turn raw input into `docs/intent.md`: **what** is wanted, **why**, and under
**which constraints** — across the whole problem, not one feature. This is the
Plan stage of the AI-native SDLC. The design of any single feature comes later
(brainstorming → spec).

**Announce first.** Start your reply with exactly:
`Using capturing-intent to write docs/intent.md.`

<HARD-GATE>
Do NOT design APIs, data models, files, or code. Do NOT invoke brainstorming,
writing-plans, or any implementation skill. Intent says WHAT and WHY; the spec
says HOW. If you catch yourself naming an endpoint or a function, stop and move
it to "Open questions" instead.
</HARD-GATE>

## Checklist

Create one todo per item and complete them in order.

1. **Read the sources.** Every file in `docs/inputs/`, plus anything the user
   pasted. Then read `AGENTS.md`, `docs/adr/*.md`, and `docs/glossary.md` —
   these are the constraints the intent must respect.
2. **Synthesize pain points.** Cluster the raw input into 3–7 pain points. Each
   pain point cites its sources by ID (e.g. `FB-03, FB-07`). Show the list to
   the user before going further.
3. **Ask clarifying questions — one at a time, at most five.** Prefer
   multiple-choice. Cover, in this order, only what the sources leave open:
   primary user · the one outcome that matters most · hard constraints · what
   is explicitly out of scope · priority between competing pain points.
4. **Draft `docs/intent.md`** using the template below. Use glossary terms.
5. **Self-check** (fix inline, do not ask):
   - every feature traces to at least one pain point, every pain point to a
     source ID;
   - every feature is small enough to ship as **one pull request** — if not,
     split it (F3 → F3, F4);
   - "Done when" items are observable outcomes, not implementation steps;
   - nothing contradicts `AGENTS.md` guardrails or an ADR;
   - no placeholders ("TBD", "etc.") outside "Open questions".
6. **Product-owner review.** Present the file. Apply corrections. Ask:
   _"Approve this intent? (yes / changes)"_. Loop until "yes".
7. **Record approval and commit.** Set `Status: Approved`, fill `Approved by`
   and `Date`, then commit on the current branch:
   `docs(intent): capture intent for <topic>`
8. **Hand off.** End with exactly:
   `Intent approved. To build a feature, say: "Use the shipping-a-feature skill to ship F<n>."`
   Then STOP. Do not start designing.

## Template — `docs/intent.md`

```markdown
# Intent — <topic>

Status: Draft | Approved · Approved by: <name> · Date: <YYYY-MM-DD>
Sources: docs/inputs/<files>

## Problem

<2–4 sentences: who is hurting, how, and what it costs them.>

## Pain points

| ID  | Pain point | Evidence (source IDs) |
| --- | ---------- | --------------------- |
| P1  | ...        | FB-01, FB-04          |

## Desired outcomes

- <Observable change in the world, e.g. "A shopper can buy several books in one
  go without emailing the shop.">

## Constraints

- <From AGENTS.md / ADRs, e.g. "In-memory store only (ADR-0001).">

## Features

| ID  | Feature | Solves | Priority (MoSCoW) | Size (S/M/L) |
| --- | ------- | ------ | ----------------- | ------------ |
| F1  | ...     | P1, P2 | Must              | L            |

### F1 — <name>

- **User value:** As a <user>, I can <action> so that <benefit>.
- **Done when:** <2–4 observable outcomes>
- **Not in this feature:** <tempting neighbours that belong elsewhere>

<repeat for each feature>

## Out of scope

- <Explicit non-goals for the whole intent.>

## Open questions

- <Anything the design step must decide. Design decisions go here, not above.>
```

## Red flags — stop and correct

| Thought                                     | Reality                                                    |
| ------------------------------------------- | ---------------------------------------------------------- |
| "I'll sketch the API so the intent is concrete" | That is the spec's job. Put the question in Open questions. |
| "The sources are thin, I'll fill the gaps"      | Ask. Invented requirements are the most expensive bug.      |
| "One big feature is simpler"                    | If it cannot ship as one PR, split it.                      |
| "The user said go, so I'll commit as Approved"  | Only an explicit approval of the written file counts.       |
