---
title: How updates flow
nav_order: 2
---

# How updates flow
{: .no_toc }

The presets combine a few measured controls instead of accepting every update blindly. Each one has a job.

1. TOC
{:toc}

## Release age

`base` sets no release age of its own. It follows `config:best-practices`: npm packages wait 3 days (`security:minimumReleaseAgeNpm`, against malicious releases and npm's 72-hour unpublish window), every other update is proposed as soon as it is released. The one exception is Docker image digest updates, which wait 3 days (see the table below). Vulnerability fixes never wait.

A custom release age per update type was dropped on purpose: lock file maintenance has no release age, so it moved the lock files ahead of the versions the update PRs proposed, and those PRs then downgraded packages.

## Automerge per update type

With the [`automerge`](presets/automerge.md) modifier (included in the default preset):

| Update | Automerged? |
| --- | --- |
| `patch` | Yes, after green CI |
| `minor`, current version >= 1.0 | Yes, after green CI |
| `minor`, current version 0.x | **No**: under SemVer a 0.x minor may break the API, so it stays a PR for review |
| GitHub Actions `pin`, `pinDigest`, `digest` | Yes |
| `pin`, `pinDigest` of other dependencies ("Pin dependencies" PRs from `config:best-practices`) | Yes, after green CI |
| Vulnerability fixes | Yes |
| `major` | **Never**: always a PR for review |
| Docker digest updates (`digest`), Docker Hub, versioned tag | Yes, once the tag is 3 days old and CI is green (a moved tag can change the image content) |
| Docker digest updates of unversioned tags (`latest`) or from other registries (`ghcr.io`, `quay.io`, ECR) | No: no release timestamp, so the release age cannot be enforced |
| Lock file maintenance | Yes, weekly, after green CI |

Renovate merges the PR itself (`platformAutomerge: false`), on a later run, and only when **every** check run and commit status on the branch is `success`, `skipped` or `neutral`. GitHub native auto-merge is not used on purpose: it waits only for the checks a ruleset or branch protection marks as required, so a red CI job that is not required would not stop it. The trade-off is timing: an update lands on Renovate's next run after CI turns green, which can take hours. Renovate ignores its own `renovate/*` statuses, so a repo with no CI checks at all is never automerged: it needs a workflow that runs the tests on PRs.

## Grouped updates

`base` puts every patch update and every minor update of a stable (>= 1.0) dependency into one PR per repo, "Update all non-major dependencies" (branch `renovate/all-minor-patch`). Fewer PRs and fewer CI runs, while majors and 0.x minors keep their own PRs for review.

- **npm release age still applies per update.** An npm update younger than 3 days is left out of the group; once it is old enough, Renovate adds it to the same branch and CI runs again.
- **Automerge works for the whole group.** Renovate automerges a group only if every update in it is automergeable. 0.x minors are never automerged, so they stay out of the group: one of them would block the rest.
- **Monorepos.** Patch and stable minor updates of a monorepo join this group; its majors stay grouped per monorepo (`group:monorepos`, part of `config:recommended`).
- **GitHub Actions pins and digests** are separate update types (`pin`, `pinDigest`, `digest`) and keep their own PRs.

{: .warning }
One red update blocks the whole group: nothing in it merges until CI is green. Fix the code, wait for a newer version of the failing package, or hold it back with [`before`](presets/before.md) or [`pin`](presets/pin.md), so the group can merge without it.

## Lock file maintenance

`config:best-practices` turns lock file maintenance on weekly (`:maintainLockFilesWeekly`, Monday before 04:00 UTC): Renovate opens one PR that refreshes the lock files, updating direct and transitive dependencies within the existing constraints. [`automerge`](presets/automerge.md) merges it once every check is green. The automerge rules per update type do not apply to the versions it pulls in, so CI is the only gate. Turn it off per repo with `lockFileMaintenance.enabled: false`.

## Composer `php` requirement

`base` does not update the `php` platform requirement in `composer.json` (`enabled: false` for `php` in the `composer` manager). Renovate reads it as a dependency on PHP releases, but it is not a package: Composer cannot update it in `composer.lock`, so the lock update fails and `composer validate --strict` reports a stale `content-hash`. The minimum PHP version is a project decision: change it by hand. PHP in Docker images and workflows is still updated.

## Merge Confidence in the PR body

`base` sets the PR table columns (`prBodyColumns`), including the Merge Confidence badges `Age`, `Adoption`, `Passing` and `Confidence`. They help you judge the major and 0.x minor PRs that stay open for review. See [PR table columns](pr-columns.md).

## PR layout

- Patch and stable (>= 1.0) minor updates share one PR per repo; see [Grouped updates](#grouped-updates).
- `separateMultipleMajor`, `separateMultipleMinor`, `separateMinorPatch` (plus the default `separateMajorMinor`): majors and 0.x minors get their own PRs, so a risky update never blocks the grouped ones. Use [`legacy`](presets/legacy.md) for projects far behind.
- `group:monorepos` (from `config:recommended`): major updates of packages released together (e.g. `@babel/*`) share one PR.
- `:semanticCommits`: commit messages follow Conventional Commits (`chore(deps): …`, `fix(deps): …`).
- Renovate's default `rebaseWhen: "auto"`: branches are rebased when they fall behind or conflict, so automerge is not blocked.
- `labels: ["dependencies"]`, `assignees: ["gander"]`.
- `dependencyDashboard: { "enabled": false }`: no dashboard issue by default. [`approval`](presets/approval.md) brings it back when it needs it.

## Merge order

Presets are merged from first to last, and later ones win when options conflict. `packageRules` from all presets are added together. See [Combining presets](combining.md).
