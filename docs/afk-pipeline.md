# AFK Issue Pipeline

This repo includes a small AFK-agent demo pipeline for well-defined GitHub
issues. It is a teaching scaffold, not a production automation framework.

## Ticket Contract

Only issues labeled `afk-ready` are eligible for unattended work.

Use `.github/ISSUE_TEMPLATE/afk-ready.yml` to create the ticket. A good AFK
ticket has:

- one small behaviour change
- objective acceptance criteria
- explicit scope boundaries and non-goals
- relevant files or code areas named
- required verification commands listed
- no secrets, external accounts, payment providers, or production data

If a ticket needs product decisions or broad design work, it is not AFK-ready.
Split or clarify it first.

## Agent Roles

The orchestrator is the entrypoint. The CI workflow finds an eligible issue and
hands it to `.github/agents/orchestrator.agent.md`.

The issue template carries the planning context. The orchestrator coordinates
these two role-separated agents:

- `implementer.agent.md` makes the scoped code change.
- `tester.agent.md` runs format, lint, typecheck, tests, and security checks.

The separation is deliberate: the role that writes the code is not the same role
that verifies it. Code review happens on the pull request: Copilot reviews
first, then a human reviews second.

## Pipeline Shape

1. Developer creates a GitHub issue using the AFK-ready issue template.
2. Developer applies or keeps the `afk-ready` label only when the checklist is
   true.
3. GitHub Actions detects the eligible issue.
4. The orchestrator reads the issue and coordinates implementer and tester.
5. Automation commits to a branch and opens a pull request.
6. The PR asks Copilot to review first.
7. A human performs the second review before merge.

## Tester Gates

The tester must report evidence for:

- `npm run format:check`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm audit --audit-level=high`

Platform checks may also apply in GitHub:

- secret scanning
- dependency review
- CodeQL

If platform checks are not available locally, the tester should report them as
CI/platform checks, not as locally executed commands.

## Demo Notes

For the module demo, open these files in order:

1. `.github/ISSUE_TEMPLATE/afk-ready.yml`
2. `.github/workflows/afk-ready-demo.yml`
3. `.github/agents/orchestrator.agent.md`
4. `.github/agents/implementer.agent.md`
5. `.github/agents/tester.agent.md`

Emphasize the two review gates: Copilot review first, human review second.
