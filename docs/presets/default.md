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

- Everything in [`base`](base.md): release age 3/5/7 days for patch/minor/major, new branches only in the hour after 00, 03, ..., 21 (Europe/Warsaw), pinned GitHub Actions digests, separate PRs per update type, monorepo grouping, semantic commits, no lock file maintenance, no dependency dashboard.
- Everything in [`automerge`](automerge.md): patches, minor updates of stable (>= 1.0) dependencies, GitHub Actions pins and digests, and vulnerability fixes merge themselves once CI is green, in the hour after 02, 05, ..., 23 (Europe/Warsaw); major updates and 0.x minors never do.

## Source

[`default.json`](https://github.com/gander-settings/renovate/blob/main/default.json)
