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
| GitHub Actions `pin`, `pinDigest`, `digest` | Yes |
| Vulnerability fixes | Yes |
| `minor`, `major` | **Never**: always a PR for review |
| Docker digests and pins | No (a moved tag can change the image content) |
| Lock file maintenance | Off; on demand only, never automerged ([`lockfile`](presets/lockfile.md)) |

Automerge uses the platform's native auto-merge (`platformAutomerge: true`), so **branch protection and required CI checks decide** whether an update lands. A repo without required checks automerges without a test gate, so set them up.

`automerge` also sets `minimumReleaseAgeBehaviour: "timestamp-required"`: an update whose release date is unknown is not automerged, because its age cannot be verified.

## Merge Confidence in the PR body

`base` sets the PR table columns (`prBodyColumns`), including the Merge Confidence badges `Age`, `Adoption`, `Passing` and `Confidence`. They help you judge the minor and major PRs that stay open for review. See [PR table columns](pr-columns.md).

## PR layout

- `separateMajorMinor`, `separateMultipleMajor`, `separateMultipleMinor`, `separateMinorPatch`: each update type gets its own PR, so a safe patch is never blocked by a risky minor in the same PR. Use [`legacy`](presets/legacy.md) for projects far behind.
- `group:monorepos`: packages released together (e.g. `@babel/*`) are updated in one PR.
- `:semanticCommits`: commit messages follow Conventional Commits (`chore(deps): …`, `fix(deps): …`).
- `rebaseWhen: "auto"`: branches are rebased when they fall behind or conflict, so automerge is not blocked.
- `labels: ["dependencies"]`, `assignees: ["gander"]`.
- `dependencyDashboard: false`: no dashboard issue by default. [`approval`](presets/approval.md) and [`lockfile`](presets/lockfile.md) bring it back when they need it.

## Merge order

Presets are merged from first to last, and later ones win when options conflict. `packageRules` from all presets are added together. See [Combining presets](combining.md).
