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
| `platformAutomerge` | `true` | Uses GitHub auto-merge, so branch protection and required checks decide |
| `automergeStrategy` | `merge-commit` | |
| `minimumReleaseAgeBehaviour` | `timestamp-required` | An update without a release date cannot prove its age, so it is not automerged |
| `rebaseWhen` | `auto` | |

{: .important }
Automerge is only as good as your CI. Where branch protection is available, make the test workflow a required status check. Without branch protection (private repos on GitHub Free), Renovate merges itself on a later run and only when all status checks have passed, so a repo without a test workflow on PRs gets no automerge at all.

Docker digest and pin updates are **not** automerged (see [`docker`](docker.md)).

## Source

[`automerge.json`](https://github.com/gander-settings/renovate/blob/main/automerge.json)
