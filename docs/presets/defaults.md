---
title: defaults (deprecated)
parent: Presets
nav_order: 13
---

# `defaults` (deprecated)

Deprecated alias of [`base`](base.md), kept so older configs that extend `defaults` keep working. Switch to the default preset:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["github>gander-settings/renovate"]
}
```

or, without automerge, to `github>gander-settings/renovate:base`.

## Source

[`defaults.json`](https://github.com/gander-settings/renovate/blob/main/defaults.json)
