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

`base` sets `minimumReleaseAge` per update type:

| Update type | Release age | Why |
| --- | --- | --- |
| `patch` | 3 days | Enough time for a broken or malicious release to be yanked or reported |
| `minor` | 5 days | New features carry more risk, so they wait longer |
| `major` | 7 days | Breaking changes; gives the ecosystem time to report problems |
| `pinDigest` | none | Pinning has no release timestamp and is safer than leaving a dependency unpinned |
| vulnerability fixes | none | A known vulnerability is a bigger risk than a fresh release |

`internalChecksFilter: "strict"` makes Renovate wait for the release age before it even creates the branch, so you do not get PRs that sit in a pending state.

Some datasources do not expose release timestamps (`github-runners`, GHCR images such as `ghcr.io/zizmorcore/zizmor`). `base` lifts the release age for those, so they are not stuck forever.

## Automerge per update type

With the [`automerge`](presets/automerge.md) modifier (included in the default preset):

| Update | Automerged? |
| --- | --- |
| `patch` | Yes, after the release age and green CI |
| `minor`, current version >= 1.0 | Yes, after the release age and green CI |
| `minor`, current version 0.x | **No**: under SemVer a 0.x minor may break the API, so it stays a PR for review |
| GitHub Actions `pin`, `pinDigest`, `digest` | Yes |
| Vulnerability fixes | Yes |
| `major` | **Never**: always a PR for review |
| Docker digests and pins | No (a moved tag can change the image content) |
| Lock file maintenance | Yes, daily, after green CI (no release age applies) |

Renovate merges the PR itself (`platformAutomerge: false`), on a later run, and only when **every** check run and commit status on the branch is `success`, `skipped` or `neutral`. GitHub native auto-merge is not used on purpose: it waits only for the checks a ruleset or branch protection marks as required, so a red CI job that is not required would not stop it. The trade-off is timing: an update lands on Renovate's next run after CI turns green, which can take hours. Renovate ignores its own `renovate/*` statuses, so a repo with no CI checks at all is never automerged: it needs a workflow that runs the tests on PRs.

`automerge` also sets `minimumReleaseAgeBehaviour: "timestamp-required"`: an update whose release date is unknown is not automerged, because its age cannot be verified.

## Grouped updates

`base` puts every patch update and every minor update of a stable (>= 1.0) dependency into one PR per repo, "Update all non-major dependencies" (branch `renovate/all-minor-patch`). Fewer PRs and fewer CI runs, while majors and 0.x minors keep their own PRs for review.

- **Release age still applies per update.** With `internalChecksFilter: "strict"`, an update younger than its release age is left out of the group; once it is old enough, Renovate adds it to the same branch and CI runs again.
- **Automerge works for the whole group.** Renovate automerges a group only if every update in it is automergeable. 0.x minors are never automerged, so they stay out of the group: one of them would block the rest.
- **Monorepos.** Patch and stable minor updates of a monorepo join this group; its majors stay grouped per monorepo (`group:monorepos`).
- **GitHub Actions pins and digests** are separate update types (`pin`, `pinDigest`, `digest`) and keep their own PRs.

{: .warning }
One red update blocks the whole group: nothing in it merges until CI is green. Fix the code, wait for a newer version of the failing package, or hold it back with [`before`](presets/before.md) or [`pin`](presets/pin.md), so the group can merge without it.

## Lock file maintenance

`base` turns lock file maintenance on with `schedule: ["* 0-5 * * *"]`: every day between 00:00 and 05:59 UTC (wide enough to catch at least one run of the hosted app, which runs about every 4 hours) Renovate opens one PR that refreshes the lock files, updating direct and transitive dependencies within the existing constraints. [`automerge`](presets/automerge.md) merges it once every check is green. It stays within the existing constraints, but `minimumReleaseAge` and the automerge rules per update type do not apply to the versions it pulls in, so CI is the only gate. A lock refresh has no release timestamp, so `base` sets `minimumReleaseAge: null` for it; otherwise `minimumReleaseAgeBehaviour: "timestamp-required"` from `automerge` would keep it pending forever. Turn it off per repo with `lockFileMaintenance.enabled: false`.

## Composer `php` requirement

`base` does not update the `php` platform requirement in `composer.json` (`enabled: false` for `php` in the `composer` manager). Renovate reads it as a dependency on PHP releases, but it is not a package: Composer cannot update it in `composer.lock`, so the lock update fails and `composer validate --strict` reports a stale `content-hash`. The minimum PHP version is a project decision: change it by hand. PHP in Docker images and workflows is still updated.

## Merge Confidence in the PR body

`base` sets the PR table columns (`prBodyColumns`), including the Merge Confidence badges `Age`, `Adoption`, `Passing` and `Confidence`. They help you judge the major and 0.x minor PRs that stay open for review. See [PR table columns](pr-columns.md).

## PR layout

- Patch and stable (>= 1.0) minor updates share one PR per repo; see [Grouped updates](#grouped-updates).
- `separateMajorMinor`, `separateMultipleMajor`, `separateMultipleMinor`, `separateMinorPatch`: majors and 0.x minors get their own PRs, so a risky update never blocks the grouped ones. Use [`legacy`](presets/legacy.md) for projects far behind.
- `group:monorepos`: major updates of packages released together (e.g. `@babel/*`) share one PR.
- `:semanticCommits`: commit messages follow Conventional Commits (`chore(deps): …`, `fix(deps): …`).
- `rebaseWhen: "auto"`: branches are rebased when they fall behind or conflict, so automerge is not blocked.
- `labels: ["dependencies"]`, `assignees: ["gander"]`.
- `dependencyDashboard: false`: no dashboard issue by default. [`approval`](presets/approval.md) brings it back when it needs it.

## Merge order

Presets are merged from first to last, and later ones win when options conflict. `packageRules` from all presets are added together. See [Combining presets](combining.md).
