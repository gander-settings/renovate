---
title: base
parent: Presets
nav_order: 2
---

# `base`

The base config without automerge. Use it instead of the default preset when every update should stay a PR for review.

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["github>gander-settings/renovate:base"]
}
```

## What it sets

| Option | Value | Why |
| --- | --- | --- |
| `extends` | `config:recommended` | Renovate's recommended defaults |
| | `helpers:pinGitHubActionDigests` | Actions pinned to commit digests: a moved tag cannot change the code you run |
| | `:semanticCommits` | Conventional Commits messages |
| | `group:monorepos` | Packages released together get one PR |
| `enabled` | `true` | Turns Renovate back on if an earlier preset disabled it |
| `lockFileMaintenance` | `enabled: true`, `schedule: ["* 0-5 * * *"]` | One lock file refresh PR a day (00:00-05:59 UTC, wide enough for one run of the hosted app, which runs about every 4 hours). Automerged only by [`automerge`](automerge.md) |
| `dependencyDashboard` | `false` | No dashboard issue by default |
| `minimumReleaseAge` | 3 / 5 / 7 days for patch / minor / major | Time for broken or malicious releases to be pulled |
| `minimumReleaseAgeBehaviour` | `timestamp-optional` | Updates without a release date still get PRs (but [`automerge`](automerge.md) does not merge them) |
| `internalChecksFilter` | `strict` | No branch until the release age has passed |
| `separateMajorMinor`, `separateMultipleMajor`, `separateMultipleMinor`, `separateMinorPatch` | `true` | A safe patch is never blocked by a risky minor in the same PR |
| `vulnerabilityAlerts.minimumReleaseAge` | `null` | Security fixes do not wait |
| `rebaseWhen` | `auto` | Keeps branches mergeable |
| `labels` | `["dependencies"]` | |
| `assignees` | `["gander"]` | |
| `enabled` (`php` in the `composer` manager) | `false` | The PHP platform requirement is not a package: Composer cannot update it in `composer.lock`. The minimum PHP version is a project decision: change it by hand |
| `prBodyColumns` | trial set | See [PR table columns](../pr-columns.md) |

The release age is lifted for `pinDigest` and `lockFileMaintenance` updates, the `github-runners` datasource and `ghcr.io/zizmorcore/zizmor`, which have no release timestamps.

## Source

[`base.json`](https://github.com/gander-settings/renovate/blob/main/base.json)
