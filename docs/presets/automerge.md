---
title: automerge
parent: Presets
nav_order: 3
---

# `automerge`

Modifier. Automerges the updates that CI can verify: patches, minor updates of stable (>= 1.0) dependencies, GitHub Actions pins and digests, and vulnerability fixes. Included in the default preset, so you rarely list it yourself.

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "github>gander-settings/renovate:base",
    "github>gander-settings/renovate:automerge"
  ]
}
```

The snippet above is the same as `github>gander-settings/renovate` on its own.

## What it sets

| Option | Value | Why |
| --- | --- | --- |
| `packageRules` | `patch` → `automerge: true` | Patches are low risk and have waited 3 days |
| | `minor` with current version >= 1.0 → `automerge: true` | Under SemVer a stable minor adds features without breaking the API; it has waited 5 days and must pass CI |
| | GitHub Actions `pin`, `pinDigest`, `digest` → `automerge: true` | Same version, just pinned or re-pinned |
| | `major` → `automerge: false` | Breaking by definition, always reviewed by a human |
| | `minor` with current version 0.x → `automerge: false` | Under SemVer anything may change before 1.0, so a 0.x minor is treated like a major |
| `vulnerabilityAlerts.automerge` | `true` | Security fixes land as soon as CI is green |
| `platformAutomerge` | `false` | Renovate merges the PR itself, only when every check run and commit status on the branch is `success`, `skipped` or `neutral`. GitHub native auto-merge would wait for the required checks only and merge past a red optional job. The cost: the merge happens on Renovate's next run, not the moment CI turns green |
| `automergeStrategy` | `merge-commit` | |
| `minimumReleaseAgeBehaviour` | `timestamp-required` | An update without a release date cannot prove its age, so it is not automerged |
| `rebaseWhen` | `auto` | |

{: .important }
Automerge is only as good as your CI. Renovate merges on a later run and only when every check on the branch is green or skipped, so a repo without a test workflow on PRs gets no automerge at all. A failed, cancelled or timed-out check blocks the merge; making checks required in branch protection or a ruleset is still worth it, so people cannot merge past red CI either.

Docker digest and pin updates are **not** automerged (see [`docker`](docker.md)).

## Source

[`automerge.json`](https://github.com/gander-settings/renovate/blob/main/automerge.json)
