---
title: Home
nav_order: 1
description: Shareable Renovate presets that automate routine dependency updates behind a quality gate.
permalink: /
---

# gander-settings/renovate
{: .fs-9 }

Shareable [Renovate](https://docs.renovatebot.com/config-presets/) presets. Pick the ones you need and list them in `extends`.
{: .fs-6 .fw-300 }

[Quick start](#quick-start){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[Browse presets](presets/){: .btn .fs-5 .mb-4 .mb-md-0 }

---

## Goal

Automate as much routine dependency maintenance as possible, while keeping a quality gate:

- **Patch updates** pass CI and merge themselves (npm packages wait 3 days first).
- **Minor updates** of stable (>= 1.0) dependencies pass CI and merge themselves. Minor updates of 0.x dependencies stay open for review, because under SemVer they may break the API.
- **Major updates** always stay open for review.
- **Vulnerability fixes** merge as soon as CI is green.
- **Lock file maintenance** runs weekly and merges itself once CI is green. It stays within the existing constraints, so CI is the gate.

See [How updates flow](how-it-works.md) for the details and the reason behind each option.

## Quick start

Add a `renovate.json` to your repo:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["github>gander-settings/renovate"]
}
```

`github>gander-settings/renovate` loads [`default`](presets/default.md): the [`base`](presets/base.md) config plus the [`automerge`](presets/automerge.md) rules. It is the usual choice for every repo.

## Base and modifiers

Only `github>gander-settings/renovate` (and `base`) carry the base config. Every other preset is a **modifier**: it changes a few options and does not extend the base, so the base is loaded once however many presets you list.

{: .important }
Always start `extends` with `github>gander-settings/renovate` and list modifiers after it. A modifier on its own gives you almost nothing.

| Preset | Kind | What it does |
| --- | --- | --- |
| [*(no name)*](presets/default.md) | base | `base` plus `automerge`. Start every `extends` with it |
| [`base`](presets/base.md) | base | Base config without automerge |
| [`automerge`](presets/automerge.md) | modifier | Automerges patches, stable minors, GitHub Actions pins and digests, Docker Hub image digests (3-day release age), pins of other dependencies, and vulnerability fixes |
| [`approval`](presets/approval.md) | modifier | Holds every update in the Dependency Dashboard until you approve it |
| [`disabled`](presets/disabled.md) | modifier | Turns Renovate off, keeping the config |
| [`legacy`](presets/legacy.md) | modifier | One PR per package with its newest minor |
| [`pin`](presets/pin.md) | modifier | Keeps a tool on one version line, e.g. PHP 7.4.x |
| [`before`](presets/before.md) | modifier | Keeps a package below a given version |
| [`vue`](presets/vue.md) | modifier | Keeps TypeScript below 7 for `vue-tsc` |
| [`docker`](presets/docker.md) | modifier | Pins Docker image tags to digests |
| [`forks`](presets/forks.md) | modifier | Runs Renovate in forks too |
| [`defaults`](presets/defaults.md) | deprecated | Alias of `base` |

## For AI assistants

A machine-readable index of this documentation is published at [`llms.txt`](llms.txt), following the [llms.txt](https://llmstxt.org/) format.
