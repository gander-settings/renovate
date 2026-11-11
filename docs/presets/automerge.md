---
title: automerge
parent: Presets
nav_order: 3
---

# `automerge`

Modifier. Automerges the updates that CI can verify: patches, minor updates of stable (>= 1.0) dependencies, GitHub Actions pins and digests, Docker Hub image digests (3-day release age), pins of other dependencies, weekly lock file maintenance, and vulnerability fixes. Included in the default preset, so you rarely list it yourself.

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
| `packageRules` | `patch` → `automerge: true` | Patches are low risk and must pass CI |
| | `minor` with current version >= 1.0 → `automerge: true` | Under SemVer a stable minor adds features without breaking the API; it must pass CI |
| | GitHub Actions `pin`, `pinDigest`, `digest` → `automerge: true` | Same version, just pinned or re-pinned |
| | Docker `digest` of a versioned tag → `automerge: true`, `minimumReleaseAge: 3 days` | A moved tag (e.g. `composer:2`) can change the image content, so it waits 3 days and must pass CI. Docker Hub dates the digest by the tag's last push, so a re-push restarts the wait. `minimumReleaseAgeBehaviour: timestamp-optional` keeps PRs from registries without timestamps coming instead of holding them forever |
| | Docker `digest` from other registries (`ghcr.io`, `quay.io`, ECR, ...) → `automerge: false` | They publish no release timestamp, so the release age cannot be enforced: reviewed by a human |
| | `pin`, `pinDigest` (any manager) → `automerge: true` | Pins added by `config:best-practices` (exact npm `devDependencies`, Docker image digests) keep the version the same, so CI is the gate. Without this, the "Pin dependencies" PRs stay open |
| | `lockFileMaintenance` → `automerge: true` | Stays within the existing constraints, so CI is the gate |
| | `major` → `automerge: false` | Breaking by definition, always reviewed by a human |
| | `minor` with current version 0.x → `automerge: false` | Under SemVer anything may change before 1.0, so a 0.x minor is treated like a major |
| `vulnerabilityAlerts.automerge` | `true` | Security fixes land as soon as CI is green |
| `platformAutomerge` | `false` | Renovate merges the PR itself, only when every check run and commit status on the branch is `success`, `skipped` or `neutral`. GitHub native auto-merge would wait for the required checks only and merge past a red optional job. The cost: the merge happens on Renovate's next run, not the moment CI turns green |
| `automergeStrategy` | `merge-commit` | |

{: .important }
Automerge is only as good as your CI. Renovate merges on a later run and only when every check on the branch is green or skipped, so a repo without a test workflow on PRs gets no automerge at all. A failed, cancelled or timed-out check blocks the merge; making checks required in branch protection or a ruleset is still worth it, so people cannot merge past red CI either.

Unversioned Docker tags (`latest`, `alpine`) have no version to age against, so their digest updates stay as PRs for review. The first pin of an image to its digest (`pinDigest`) is automerged without a release age.

## Source

[`automerge.json`](https://github.com/gander-settings/renovate/blob/main/automerge.json)
