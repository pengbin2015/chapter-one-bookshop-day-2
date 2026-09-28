# Team delivery on the cloud

The team writes a well-defined issue. A maintainer approves it by adding the
`ready-for-agent` label. GitHub Actions assigns the issue to Copilot cloud agent
with the `orchestrator` custom agent. The agent works in its own sandbox and
opens a draft pull request. A developer reviews it and decides whether to merge.

```
issue ──► ready-for-agent label ──► assign-to-agent.yml ──► Copilot cloud agent ──► draft PR ──► CI + review ──► merge
 team        maintainer               Actions                 orchestrator            platform      developer
```

People decide at both ends. Nobody presses "continue" in between.

This is a teaching demo. It keeps the moving parts small and shows what is
possible; a production team would add its own approval policy, secrets
management, and review rules.

## What is in the repository

| File                                         | Purpose                                                                                                                                                                                  |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.github/ISSUE_TEMPLATE/ready-for-agent.yml` | The issue contract: goal, criteria, scope, context, plan, checks. Creating an issue does **not** start the agent.                                                                        |
| `.github/workflows/assign-to-agent.yml`      | On `ready-for-agent` label: verifies write access, checks all six form sections and readiness boxes, assigns Copilot, and records the approval. On issue edit: removes the label and comments, so a maintainer must re-approve the new text before the agent starts. |
| `.github/workflows/copilot-setup-steps.yml`  | Installs Node dependencies in the agent's environment before it starts.                                                                                                                  |
| `.github/workflows/ci.yml`                   | The five `AGENTS.md` checks on every pull request and on `main`.                                                                                                                         |
| `.github/agents/orchestrator.agent.md`       | Follows `shipping-a-feature` in approved-issue mode.                                                                                                                                     |

## Approval policy (this repository)

The `ready-for-agent` label, applied by a user with write access, is the
recorded approval. The workflow verifies the labeler's permission, reads the
issue body fresh from the API, checks all six required sections and the three
readiness boxes, and records a comment with the body checksum. Only maintainers
should apply the label. If the issue is edited after the label is applied, the
workflow automatically removes the label and posts a comment; a maintainer must
read the new text and re-apply the label to start the agent.

## One-time setup

1. **Copilot cloud agent** — enable it for the repository (a paid Copilot plan
   with cloud agent allowed by your organisation's policy).
2. **Label** — create `ready-for-agent`; delete the old `afk-ready` label.
3. **Token secret** — create a fine-grained personal access token for this
   repository with Metadata (read) and Actions, Contents, Issues, Pull requests
   (read and write). Save it as the repository secret `AGENT_TOKEN`. The default
   `GITHUB_TOKEN` cannot assign Copilot.
4. **Workflow approval** — in the repository's Copilot cloud agent settings,
   allow Actions workflows to run on Copilot's pull requests without manual
   approval, so CI runs unattended. Leave it on the default if you prefer to
   click "Approve and run workflows" during the demo.
5. **Protect `main`** — add a branch ruleset: require a pull request, require
   the `checks` status check (from the CI workflow), block force pushes. Optionally request
   Copilot code review automatically. Note that the person whose token assigned
   Copilot cannot approve its pull request; use a second account (for example,
   a teaching assistant) if you require an approval.

## Demo — low-stock cue, issue to pull request

1. **Create the issue** from the **Ready for agent** form and paste the ticket
   below. Show the rendered issue. Ask the class to find one ambiguity.
2. **Approve it** — as the maintainer, add the `ready-for-agent` label.
3. **Watch it start** — open the **Actions** tab: `Assign issue to agent`
   runs, and the approval comment appears on the issue. Open the agent session
   from the issue.
4. **The pull request appears** — a draft PR on a `copilot/` branch. Walk the
   body: linked issue, criteria with evidence, local vs platform checks.
5. **Review and merge** — review the diff and the CI result, then merge.

Allow 20–40 minutes of agent time; start it before a break. Keep a pull request
from a dry run as a fallback.

### Ready-made ticket

**Goal and desired behaviour**

> Shoppers cannot see which books are close to selling out, although the API
> already returns stock (FB-06). On catalogue cards and book details, show
> "Only 1 copy left" when stock is 1 and "Only N copies left" when stock is 2
> or 3. Show nothing above 3. Style it distinctly in the existing stylesheet.

**Acceptance criteria**

- Stock 1 renders `Only 1 copy left` in card and detail HTML.
- Stock 2 or 3 renders `Only N copies left` in card and detail HTML.
- Stock above 3 renders no low-stock message.
- Title, author, price, navigation, and API behaviour are unchanged.
- Rendering tests cover the boundary values 1, 3, and 4.

**Scope and non-goals**

- In scope: `public/app.js`, `public/styles.css`, pure rendering tests.
- Out of scope: cart, stock changes, API changes, search, accounts,
  dependencies, another stylesheet.

**Technical context**

- `Book.stock` exists in `src/types.ts`; the seed data includes the boundary
  values; the API already returns stock.
- `bookCardHTML` and `bookDetailHTML` are pure helpers in `public/app.js`.
- Follow `AGENTS.md` and `.github/instructions/frontend.instructions.md`;
  keep HTML escaping.

**Implementation plan**

> Phase 1 — low-stock cue: add failing render tests for stock 1, 3, and 4 on
> card and detail output; add the smallest markup to pass; style the cue in
> `public/styles.css`; run every check.

**Checks** — keep the form's default five commands.

## Limits to state honestly

- **Subagents in the cloud.** GitHub's custom-agent reference for cloud agent
  does not document the `agents` field, so the orchestrator may not hand work
  to separate `implementer` and `reviewer` subagents there. Check in a dry run.
  If it reviews its own work, the independent review happens at the pull
  request: CI, optional Copilot code review, and the developer.
- **Custom agent name.** The API's `custom_agent` value is set to
  `orchestrator`. If the dry run does not pick up the custom agent, check the
  current API reference for the expected format; the workflow's custom
  instructions still direct the agent to `shipping-a-feature`.
- **Public repository.** Copilot automations (issue-opened triggers) need a
  private or internal repository, so this demo uses Actions and the API.

## Local fallback

If the cloud run is unavailable, select **orchestrator** in VS Code, give it
the issue URL and a copy of the issue, and say:

> Use `shipping-a-feature` in approved-issue mode for issue #<number>. The
> `ready-for-agent` label is the approval. Execute only the approved plan, open
> a PR when the review evidence is ready, and do not merge.

Tell the class it is a local run of the same contract, not a cloud dispatch.
