---
title: default (no name)
parent: Presets
nav_order: 1
---

# `github>gander-settings/renovate`

The default preset, loaded when you reference the repo with no preset name. It is [`base`](base.md) plus [`automerge`](automerge.md), and it is the usual choice for every repo.

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["github>gander-settings/renovate"]
}
```

List it **first** in `extends` and add modifiers after it.

## What you get

- Everything in [`base`](base.md): `config:best-practices` (GitHub Actions and Docker images pinned to digests, weekly lock file maintenance, 3-day release age for npm only), one grouped PR for patch and stable minor updates, separate PRs for majors and 0.x minors, monorepo grouping, semantic commits, no dependency dashboard.
- Everything in [`automerge`](automerge.md): patches, minor updates of stable (>= 1.0) dependencies, GitHub Actions pins and digests, and vulnerability fixes merge themselves once CI is green; major updates and 0.x minors never do.

## Source

[`default.json`](https://github.com/gander-settings/renovate/blob/main/default.json)
