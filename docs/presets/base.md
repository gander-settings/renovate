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
| `lockFileMaintenance.enabled` | `false` | A full lock refresh bypasses the release age and the automerge rules per update type. Use [`lockfile`](lockfile.md) to run it on demand |
| `timezone` | `Europe/Warsaw` | Schedules below are in Polish local time, with daylight saving time handled by Renovate |
| `schedule` | `* 0,3,6,9,12,15,18,21 * * *` | New branches and PRs only in the hour after 00:00, 03:00, ..., 21:00, so updates arrive in batches. See [Schedule](../how-it-works.md#schedule) |
| `dependencyDashboard` | `false` | No dashboard issue by default |
| `minimumReleaseAge` | 3 / 5 / 7 days for patch / minor / major | Time for broken or malicious releases to be pulled |
| `minimumReleaseAgeBehaviour` | `timestamp-optional` | Updates without a release date still get PRs (but [`automerge`](automerge.md) does not merge them) |
| `internalChecksFilter` | `strict` | No branch until the release age has passed |
| `separateMajorMinor`, `separateMultipleMajor`, `separateMultipleMinor`, `separateMinorPatch` | `true` | A safe patch is never blocked by a risky minor in the same PR |
| `vulnerabilityAlerts.minimumReleaseAge` | `null` | Security fixes do not wait |
| `rebaseWhen` | `auto` | Keeps branches mergeable |
| `labels` | `["dependencies"]` | |
| `assignees` | `["gander"]` | |
| `rangeStrategy` (`composer` manager) | `bump` | Raises the `composer.json` constraint together with `composer.lock`: with `bump-after-update` a lock-only update leaves a `content-hash` that does not match `composer.json` |
| `prBodyColumns` | trial set | See [PR table columns](../pr-columns.md) |

The release age is lifted for `pinDigest` updates, the `github-runners` datasource and `ghcr.io/zizmorcore/zizmor`, which have no release timestamps.

## Source

[`base.json`](https://github.com/gander-settings/renovate/blob/main/base.json)
