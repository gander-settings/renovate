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
| `extends` | `config:best-practices` | Renovate maintainers' best practices: `config:recommended` plus GitHub Actions and Docker images pinned to digests (a moved tag cannot change the code you run), pinned npm `devDependencies`, weekly lock file maintenance, abandoned package detection, config migration PRs and a 3-day release age for npm packages only (`security:minimumReleaseAgeNpm`) |
| | `:semanticCommits` | Conventional Commits messages |
| `enabled` | `true` | Turns Renovate back on if an earlier preset disabled it |
| `dependencyDashboard` | `{ "enabled": false }` | No dashboard issue by default |
| `groupName` (patch, and minor with current version >= 1.0) | `all non-major dependencies` | One PR per repo instead of one per package. 0.x minors stay out, so the group can still be automerged. See [Grouped updates](../how-it-works.md#grouped-updates) |
| `separateMultipleMajor`, `separateMultipleMinor`, `separateMinorPatch` | `true` | Majors and 0.x minors never share a PR with the grouped updates (`separateMajorMinor: true` is already the Renovate default) |
| `labels` | `["dependencies"]` | |
| `assignees` | `["gander"]` | |
| `enabled` (`php` in the `composer` manager) | `false` | The PHP platform requirement is not a package: Composer cannot update it in `composer.lock`. The minimum PHP version is a project decision: change it by hand |
| `prBodyColumns` | trial set | See [PR table columns](../pr-columns.md) |

No custom release age: apart from npm packages (3 days, from `config:best-practices`), updates are proposed as soon as they are released. Lock file maintenance runs weekly (Monday before 04:00 UTC, `:maintainLockFilesWeekly`). Automerge comes only from [`automerge`](automerge.md).

## Source

[`base.json`](https://github.com/gander-settings/renovate/blob/main/base.json)
