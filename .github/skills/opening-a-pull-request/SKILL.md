---
name: opening-a-pull-request
description: "Use when implementation and review are finished and the branch must be pushed and a pull request opened — e.g. 'open a PR', 'raise the pull request'. Re-runs every check, fills .github/pull_request_template.md, and never merges."
---

# Opening a Pull Request

**Announce first:** `Using opening-a-pull-request for <branch>.`

## Preconditions — check, do not assume

Stop with a clear message if any fails:

- Current branch is **not** `main` (`git branch --show-current`).
- Working tree is clean (`git status --porcelain` prints nothing).
- If a review file exists in `docs/superpowers/reviews/`, its verdict is `READY`.

## Steps

1. **Fresh evidence.** Run, in order, and keep the last lines of each output:
   `npm run format:check` · `npm run lint` · `npm run typecheck` · `npm test` ·
   `npm audit --audit-level=high`. Any failure → STOP; the branch is not ready.
2. **Title.** A Conventional Commit summary for the whole branch, e.g.
   `feat(cart): add cart and checkout (F1)`.
3. **Body.** Copy `.github/pull_request_template.md` and fill **every**
   section: intent feature ID, spec / plan / review paths, the done-when
   checklist copied from the spec (tick only items the review marked met), the
   check outputs from step 1, and anything a reviewer should look at first.
   Write it to a temp file outside the repo (e.g. `$TMPDIR/pr-body.md`).
4. **Push.** `git push -u origin <branch>`
5. **Open.**
   `gh pr create --base main --head <branch> --title "<title>" --body-file <file>`
   - If `gh` is missing or not authenticated: do not improvise. Print the
     title and body, and tell the user to open the PR from the GitHub page or
     the GitHub Pull Requests view in VS Code.
   - If you are the Copilot cloud agent, the platform opens the PR for you:
     put the filled template in the PR description instead.
6. **Report** the PR URL and remind the user: request **Copilot review first**
   (Reviewers → Copilot on the PR page), then a human review.

## Never

- Never push to `main`, force-push, or merge.
- Never mark a done-when item as met without evidence in the review file.
- Never edit tests or checks to get step 1 green.
