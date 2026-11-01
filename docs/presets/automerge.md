---
title: automerge
parent: Presets
nav_order: 3
---

# `automerge`

Modifier. Automerges the updates that are cheap to verify: patches, GitHub Actions pins and digests, and vulnerability fixes. Included in the default preset, so you rarely list it yourself.

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
| | GitHub Actions `pin`, `pinDigest`, `digest` → `automerge: true` | Same version, just pinned or re-pinned |
| | `major`, `minor` → `automerge: false` | Always reviewed by a human |
| `vulnerabilityAlerts.automerge` | `true` | Security fixes land as soon as CI is green |
| `platformAutomerge` | `true` | Uses GitHub auto-merge, so branch protection and required checks decide |
| `automergeStrategy` | `merge-commit` | |
| `minimumReleaseAgeBehaviour` | `timestamp-required` | An update without a release date cannot prove its age, so it is not automerged |
| `rebaseWhen` | `auto` | |

{: .important }
Automerge is only as good as your CI. Set required status checks in branch protection, otherwise updates merge without a test gate.

Docker digest and pin updates are **not** automerged (see [`docker`](docker.md)).

## Source

[`automerge.json`](https://github.com/gander-settings/renovate/blob/main/automerge.json)
