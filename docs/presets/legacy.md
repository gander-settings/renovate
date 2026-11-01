---
title: legacy
parent: Presets
nav_order: 7
---

# `legacy`

Modifier for projects far behind on updates: one PR per package with its newest minor, instead of one PR per minor line.

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "github>gander-settings/renovate",
    "github>gander-settings/renovate:legacy"
  ]
}
```

A project many minor versions behind would otherwise get one PR per minor line (e.g. `doctrine/orm` 2.8.x, 2.9.x, … 2.20.x). `legacy` turns off `separateMultipleMinor`, so each package gets one PR with its newest minor. Majors stay separate (`separateMultipleMajor`).

## Source

[`legacy.json`](https://github.com/gander-settings/renovate/blob/main/legacy.json)
