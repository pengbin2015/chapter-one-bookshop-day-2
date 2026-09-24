# Unattended issue delivery

Use unattended execution for a scoped issue with agreed acceptance criteria,
an implementation plan, and known verification commands. Broad product decisions
belong in the interactive intent/design workflow.

## Approval contract

The receiving team must define who can approve unattended execution and how
that approval is recorded. The `afk-ready` label is a suggested readiness
marker; it is not sufficient authority unless the team's policy says so.
An authorized person must assign the issue to the executing agent.

Use `.github/ISSUE_TEMPLATE/afk-ready.yml` to record:

- Problem, behavior, acceptance criteria, and scope boundaries.
- Relevant code and documentation references.
- An implementation plan with phases or a single scoped phase.
- Exact validation commands and required platform checks.
- Approval evidence and the approved issue version.

If the issue changes after approval, reassess affected scope before execution.

## Execution

The orchestrator follows `shipping-a-feature` in approved-issue mode. It saves
the approved issue contents as durable spec and plan inputs, including source
and approval references. It does not require a separate intent file for a
self-contained approved issue.

The implementer handles the phase; a separate reviewer checks the complete
change and its criteria. Findings return to the implementer within the skill's
bounded fix loop. The orchestrator records the final review and opens a PR.
Human review and the project's required checks gate merge.

## Integration status

The existing `.github/workflows/afk-ready-demo.yml` only prints the intended
process and runs this repository's Node validation commands. It does **not**
dispatch an agent, implement an issue, or open a PR.

Actual unattended execution requires a supported agent assignment or a separately
configured integration. Do not copy that workflow to another stack and assume
it supplies automation. Agent permissions, model access, publication credentials,
and team approval policy must be configured in the receiving environment.

Report local validation separately from platform checks. Pending or unavailable
platform checks remain visible in the PR and cannot be described as passed.

## Demo 2 — approved issue / AFK pipeline

Run this after the interactive demo. The contrast is the point: the human
decisions are captured in a complete, approved issue before execution, so the
agent can work within that boundary without pausing after every routine step.
The human still reviews and merges the PR.

### 1. Choose a genuinely AFK-sized change

Pick one small behavior with no hidden product decision. It may trace to a
feature in the approved `docs/intent.md`, but it can also be a standalone
maintenance issue. Do not use the entire cart-and-checkout feature as one AFK
ticket unless its complete design and phased plan have already been approved.

A suitable ticket has one clear outcome, known surfaces, objective criteria,
exact checks, explicit non-goals, and no need for secrets, production data,
external accounts, or new authority.

### 2. Create the approved issue contract

On GitHub, choose the **AFK-ready implementation ticket** form from
`.github/ISSUE_TEMPLATE/afk-ready.yml`. Complete every required field:

1. **Requirement or feature reference** — link the approved parent feature or
   state that the issue is standalone.
2. **Problem or goal** and **desired behavior** — describe the observable
   change without leaving a design choice for the agent.
3. **Acceptance criteria** — include the success case, relevant failure case,
   and existing behavior that must remain intact.
4. **Scope boundaries**, **risks**, and **non-goals** — name tempting adjacent
   work the run must not absorb.
5. **Technical context** — link applicable requirements, design, ADRs,
   instructions, and likely code/test paths.
6. **Expected tests and checks** — for this repository, normally list:

   ```text
   npm run format:check
   npm run lint
   npm run typecheck
   npm test
   npm audit --audit-level=high
   ```

7. **Implementation plan** — provide the approved phase or phases, affected
   paths, criteria per phase, and checks. “Let the agent decide” is not a plan.
8. **Approval evidence** — link or quote the record required by the team's
   policy, identify the approver, and identify the exact issue version/scope.

Review the rendered issue, not only the form fields. Check every readiness box
only when it is true. If the `afk-ready` label is added automatically, treat it
as a readiness marker, not authority by itself. An authorized person must also
assign the issue to the configured executing agent or integration.

Demo checkpoint: ask another participant to find one ambiguity. If answering
it would change scope, behavior, or architecture, update the issue, obtain new
approval for that version, and only then continue.

#### Ready-made Chapter One ticket

For a repeatable classroom run, use the low-stock cue below. Paste the content
into the matching issue-form fields, replace the approval placeholders, and
have the responsible person approve the rendered issue before assignment.

**Requirement or feature reference**

> Link the matching approved feature in `docs/intent.md`. If it is not a
> separate feature, record this as a standalone issue traced to FB-06 and the
> stock constraint in ON-03.

**Problem or goal**

> Shoppers cannot see which books are close to selling out even though the API
> already returns stock. FB-06 says the “2 left” state should stand out.

**Desired behavior**

> On both catalogue cards and book details, show a visible low-stock message
> when stock is 1, 2, or 3. Use “Only 1 copy left” for one and “Only N copies
> left” otherwise. Do not show the message when stock is above 3. Apply a
> visually distinct style using the existing stylesheet.

**Acceptance criteria**

- Stock 1 renders `Only 1 copy left` in card and detail HTML.
- Stock 2 or 3 renders `Only N copies left` in card and detail HTML.
- Stock above 3 renders no low-stock message.
- Existing title, author, price, navigation, and API behavior remain unchanged.
- Rendering tests cover the boundary values 1, 3, and 4.

**Scope boundaries and non-goals**

- In scope: `public/app.js`, `public/styles.css`, and pure rendering tests.
- Out of scope: cart behavior, stock mutation, API changes, search, accounts,
  notifications, dependencies, or another stylesheet.

**Technical context and risks**

- `Book.stock` already exists in `src/types.ts`, seed data includes boundary
  values, and the API already returns it.
- `bookCardHTML` and `bookDetailHTML` are pure helpers in `public/app.js`.
- Follow `AGENTS.md` and `.github/instructions/frontend.instructions.md`.
- Preserve HTML escaping; no inline scripts or untrusted HTML.

**Implementation plan**

> Phase 1 — low-stock cue: add failing pure-render tests for stock 1, 3, and 4
> across card and detail output; add the smallest rendering helper/markup needed
> to pass; style the cue in `public/styles.css`; run every listed check. Done
> when all acceptance criteria pass and the existing behavior stays green.

**Expected tests and checks**

Use the five repository commands listed above. The approval field must name or
link the approver, date, and exact issue revision; do not copy placeholder
approval text into a live AFK run.

### 3. Explain the two pieces of the demo

The repository contains two distinct mechanisms:

| Mechanism                                       | What it proves                                                             | What it does not do                                                      |
| ----------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `afk-ready-demo.yml`                            | The label/dispatch trigger works and the repository passes its Node checks | It does not invoke a custom agent, change code, or open a PR             |
| Assigned orchestrator or configured integration | It can execute `shipping-a-feature` in approved-issue mode                 | It does not replace the team's approval policy or the final human review |

Show this distinction before triggering anything. A green Actions run is
validation evidence, not evidence that an AFK agent implemented the issue.

### 4. Trigger the validation workflow

Either add the `afk-ready` label to the approved issue or run **AFK ready demo**
manually from the Actions tab. Open the job log and show that it:

1. Prints the intended orchestrator → implementer → reviewer → PR sequence.
2. Checks out the repository and installs the locked dependencies.
3. Runs format, lint, typecheck, tests, and the dependency audit.
4. Stops on a failed required command.

The issue-label trigger reads the issue event only to decide whether to run; it
does not pass the issue to an agent. Do not wait for a code branch or PR from
this workflow because it cannot create either with its read-only permissions.

### 5. Start the actual approved-issue run

If the environment supports custom-agent assignment and the orchestrator's
named subagents, assign the approved issue through that integration. Otherwise,
use the local fallback in step 8. The execution request must identify the issue
and should say:

> Use `shipping-a-feature` in approved-issue mode for issue #<number>. Verify
> its approval and authorized assignment, execute only the approved plan, open
> a PR when all required review evidence is ready, and do not merge.

Before editing application code, the orchestrator should:

1. Verify authorized assignment, approval evidence, scope, criteria, plan, and
   checks. Missing content blocks the AFK run.
2. Capture the issue URL, contents or revision, and approval evidence as local
   spec/plan artifacts so later roles do not depend on mutable chat context.
3. Inspect Git state and establish a feature branch from the resolved base.
4. Skip the interactive design and plan interviews only because the approved
   issue already supplies those gates. It must stop if a new decision appears.

### 6. Observe unattended implementation and review

Within the approved boundary, the orchestrator alternates the same separate
roles used in Demo 1:

1. Implementer handles one approved phase with test-driven development and
   fresh verification, then returns its commit and evidence.
2. Reviewer checks the complete phase diff and returns `PASS` or `FIX` without
   editing. Fix/re-review is limited to two rounds.
3. The orchestrator records the reviewed revision and phase result before
   moving on.
4. Reviewer performs a final base-to-head review. Only `VERDICT: READY` permits
   the PR-opening step.

An unresolved requirement, access request, unexpected dependency, failed
required check, or scope expansion should produce a visible BLOCKED/NOT READY
result rather than an improvised decision.

### 7. Inspect the AFK handoff

When the run succeeds, inspect the branch, commits, saved issue snapshots,
review report, and PR. Verify that the PR:

- Links the exact issue and any parent requirement.
- States what changed and what was explicitly out of scope.
- Maps evidence to every acceptance criterion.
- Separates local command results from GitHub platform-check status.
- Identifies the reviewed revision and asks for the team's required reviews.
- Remains unmerged until the responsible human approves it.

If the issue changes after execution begins, stop and reassess approval. Do not
quietly continue under approval for an older issue version. If rerunning, first
check for an existing branch or PR to avoid duplicate delivery.

### 8. Local fallback when cloud orchestration is unavailable

GitHub.com's custom-agent configuration does not currently document the
orchestrator's `agents` field, so verify named-subagent support before the live
demo. If it is unavailable:

1. Keep the approved GitHub issue as the durable AFK contract.
2. Run `afk-ready-demo.yml` to demonstrate the trigger and validation portion.
3. In VS Code, select **orchestrator** and give it the issue URL and a captured
   copy of the approved issue. Use the prompt from step 5.
4. Let the local orchestrator run approved-issue mode with its planner,
   implementer, and reviewer subagents.
5. Describe the result as a local execution of the AFK contract, not as a
   GitHub Actions agent dispatch.

This fallback demonstrates the same boundaries and evidence trail without
claiming that the example workflow provides an agent-hosting service.
