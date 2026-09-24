## What and why

<!-- One or two sentences. Which intent feature does this ship? -->

Ships intent **F?** — <feature name>

## Artifact trail

| Stage  | Artifact                                         |
| ------ | ------------------------------------------------ |
| Intent | `docs/intent.md` (F?)                            |
| Spec   | `docs/superpowers/specs/<date>-<slug>-design.md` |
| Plan   | `docs/superpowers/plans/<date>-<slug>.md`        |
| Review | `docs/superpowers/reviews/<slug>-review.md`      |

## Done when (copied from the spec)

<!-- Tick only items the review marked "met", with evidence. -->

- [ ] ...

## Verification evidence

```text
npm run format:check  →
npm run lint          →
npm run typecheck     →
npm test              →
npm audit --audit-level=high →
```

## Reviewer notes

<!-- Where should a human look first? Anything parked or out of scope? -->

## Review order

1. Copilot code review
2. Human review — the agent that wrote this code does not approve it
