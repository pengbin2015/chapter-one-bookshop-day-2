# The AI-native flow in this repo

How Chapter One turns raw feedback into a reviewed pull request with GitHub
Copilot, **skills** (the procedures) and **custom agents** (the roles). It
follows the stages of Anthropic's AI-Native SDLC Playbook: every stage ends by
committing an artifact, and that artifact is the input to the next stage.

```
docs/inputs/*.md ──► intent.md ──► spec ──► plan ──► code + tests ──► review ──► PR
     raw input        Plan         Design    Build       Build/Test      Test      Deploy gate
                   ▲ human gate  ▲ gate 1  ▲ gate 2                               ▲ gate 3
```

## Playbook artifact → where it lives here

| Playbook     | This repo                                         | Produced by (skill)                                         | Role (agent)    |
| ------------ | ------------------------------------------------- | ----------------------------------------------------------- | --------------- |
| `intent.md`  | `docs/intent.md`                                  | `capturing-intent`                                          | product-manager |
| `spec.md`    | `docs/superpowers/specs/<date>-<slug>-design.md`  | `brainstorming`                                             | product-manager |
| `plan.md`    | `docs/superpowers/plans/<date>-<slug>.md`         | `writing-plans`                                             | planner         |
| code + tests | `src/`, `public/`, `tests/`                       | `test-driven-development`, `verification-before-completion` | implementer     |
| review       | `docs/superpowers/reviews/<slug>-review.md`       | `requesting-code-review`                                    | reviewer        |
| pull request | GitHub PR from `.github/pull_request_template.md` | `opening-a-pull-request`                                    | orchestrator    |
| `CLAUDE.md`  | `AGENTS.md`                                       | —                                                           | all             |

`shipping-a-feature` is the conductor skill that runs spec → PR in order.

## Skills are procedures, agents are roles

| Agent             | Shown in agent menu | Model         | Tools                              | Reads skill(s)                                          |
| ----------------- | ------------------- | ------------- | ---------------------------------- | ------------------------------------------------------- |
| `product-manager` | yes                 | GPT-5.6 Sol   | read, search, edit, execute(git)   | capturing-intent, brainstorming                         |
| `orchestrator`    | yes                 | GPT-5.6 Terra | read, search, edit, execute, agent | shipping-a-feature, opening-a-pull-request              |
| `planner`         | no (subagent)       | GPT-5.6 Sol   | read, search                       | writing-plans                                           |
| `implementer`     | no (subagent)       | GPT-5.3-Codex | read, search, edit, execute        | test-driven-development, verification-before-completion |
| `reviewer`        | no (subagent)       | GPT-5.5       | read, search, execute              | requesting-code-review                                  |

- **Tool scope is the role.** Only the implementer can edit code; the
  reviewer can run checks but cannot change anything.
- **The reviewer uses a different model from the implementer** so they do not
  share the same blind spots.
- **Interactive steps stay in the main chat.** Intent and design are
  interviews, so they run in `product-manager`, not as subagents.

## Making skill loading reliable

Copilot picks skills by matching their `description` — that is a judgement,
not a guarantee. This repo removes the guesswork in four layers:

1. **Precise descriptions** with the words students will type ("ship F1",
   "requirements", "open a PR").
2. **Skills chained by file path.** Agents and `shipping-a-feature` say _"read
   `.github/skills/<x>/SKILL.md`"_ — a file read, not a match.
3. **Routing table in `AGENTS.md`**, which is loaded on every request and
   takes precedence over the Superpowers priority rules.
4. **Name the agent or skill** in the request. Choosing the agent from the menu
   is fully deterministic.

Every skill and agent announces itself on its first line, so you can see at a
glance what loaded.

## Demo script

**0. Setup (before class)** — VS Code with GitHub Copilot, agent mode; the
models above enabled by your organisation's Copilot policy; `gh auth status`
succeeds; `npm install && npm test` is green.

**1. Intent (Plan stage)** — pick **product-manager** in the agent menu:

> Turn the feedback in docs/inputs into an intent for the bookshop.

It clusters FB-/ON- items into pain points, asks up to five questions,
drafts `docs/intent.md` with features F1…Fn, and commits after you approve.

**2. Design F1 (gate 1)** — still in product-manager:

> Design F1.

Brainstorming interviews you one question at a time and commits the spec,
which begins `Traces to: intent F1`.

**3. Ship it (gates 2 and 3)** — press **Build this feature →** (hands off to
the orchestrator), or pick **orchestrator** and type:

> Ship F1.

The orchestrator creates `feat/f1-<slug>`, asks the planner for a plan and
waits for your approval (gate 2), then runs implementer → reviewer phase by
phase, a final review, and opens the PR. You review and merge (gate 3).

**4. AFK variant** — the same orchestrator, assigned to an issue created from
`.github/ISSUE_TEMPLATE/afk-ready.yml` on GitHub. The issue body stands in for
the spec and plan; see `docs/afk-pipeline.md`.

## Where the state lives

If a session dies, start a fresh chat and say "Ship F1" again. Step 0 of
`shipping-a-feature` inspects the files (intent, spec, plan checkboxes,
review verdict, PR) and resumes at the first missing artifact. The chat
history is disposable; the committed files are the source of truth.
