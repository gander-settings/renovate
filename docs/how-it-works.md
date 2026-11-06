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
| Lock file maintenance | Off; on demand only, never automerged ([`lockfile`](presets/lockfile.md)) |

Renovate merges the PR itself (`platformAutomerge: false`), on a later run, and only when **every** check run and commit status on the branch is `success`, `skipped` or `neutral`. GitHub native auto-merge is not used on purpose: it waits only for the checks a ruleset or branch protection marks as required, so a red CI job that is not required would not stop it. The trade-off is timing: an update lands on Renovate's next run after CI turns green, which can take hours. Renovate ignores its own `renovate/*` statuses, so a repo with no CI checks at all is never automerged: it needs a workflow that runs the tests on PRs.

`automerge` also sets `minimumReleaseAgeBehaviour: "timestamp-required"`: an update whose release date is unknown is not automerged, because its age cannot be verified.

## Schedule

Times are in `Europe/Warsaw` (`timezone` in `base`), so they follow Polish daylight saving time.

| Option | Preset | Cron | Window |
| --- | --- | --- | --- |
| `schedule` | `base` | `* 0,3,6,9,12,15,18,21 * * *` | New branches and PRs: 00:00-00:59, 03:00-03:59, ..., 21:00-21:59 |
| `automergeSchedule` | `automerge` | `* 2,5,8,11,14,17,20,23 * * *` | Automerge: 02:00-02:59, 05:00-05:59, ..., 23:00-23:59 |

Updates arrive in batches every three hours, and CI gets about two hours to finish before the next merge window.

Limits to know:

- **No minute precision.** Renovate cron schedules must use `*` for minutes, so a window is a whole hour, not "at :05" or "at :55".
- **A schedule is a gate, not a trigger.** Renovate acts only when a run happens inside the window. Mend Renovate Community Edition runs each repo about every 4 hours (plus runs triggered by pushes and PR events), so a one-hour window every three hours catches about every third run: expect roughly two branch windows and two merge windows hit per day, at irregular hours.
- **Existing branches are still kept up to date** outside the window (`updateNotScheduled` defaults to `true`): Renovate rebases them, so they are ready when a merge window comes.
- **Vulnerability fixes ignore `schedule`**: Renovate's `vulnerabilityAlerts` defaults to "at any time". Their automerge still waits for an automerge window.
- `automergeSchedule` is honoured only because [`automerge`](presets/automerge.md) sets `platformAutomerge: false`; GitHub native auto-merge would merge outside the window.
- [`lockfile`](presets/lockfile.md) sets its own `schedule: ["at any time"]`, so a ticked lock file refresh does not wait.

To change the schedule in one repo, override it after the presets, e.g. `"schedule": ["at any time"]` or `"automergeSchedule": ["at any time"]`.

## Composer constraints

`base` sets `rangeStrategy: "bump"` for the `composer` manager. Composer projects that use `bump-after-update` keep `composer.json` constraints in step with `composer.lock`. With Renovate's default (`update-lockfile`) an update in range would change only `composer.lock`, and its `content-hash` would no longer match `composer.json` (`composer validate` fails). With `bump`, every update raises the constraint in `composer.json` and refreshes the lock file in the same commit.

## Merge Confidence in the PR body

`base` sets the PR table columns (`prBodyColumns`), including the Merge Confidence badges `Age`, `Adoption`, `Passing` and `Confidence`. They help you judge the major and 0.x minor PRs that stay open for review. See [PR table columns](pr-columns.md).

## PR layout

- `separateMajorMinor`, `separateMultipleMajor`, `separateMultipleMinor`, `separateMinorPatch`: each update type gets its own PR, so a safe patch is never blocked by a risky minor in the same PR. Use [`legacy`](presets/legacy.md) for projects far behind.
- `group:monorepos`: packages released together (e.g. `@babel/*`) are updated in one PR.
- `:semanticCommits`: commit messages follow Conventional Commits (`chore(deps): …`, `fix(deps): …`).
- `rebaseWhen: "auto"`: branches are rebased when they fall behind or conflict, so automerge is not blocked.
- `labels: ["dependencies"]`, `assignees: ["gander"]`.
- `dependencyDashboard: false`: no dashboard issue by default. [`approval`](presets/approval.md) and [`lockfile`](presets/lockfile.md) bring it back when they need it.

## Merge order

Presets are merged from first to last, and later ones win when options conflict. `packageRules` from all presets are added together. See [Combining presets](combining.md).
