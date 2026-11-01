---
title: pin
parent: Presets
nav_order: 8
---

# `pin`: stay on one version line

Modifier with 2 parameters. Syntax: `pin(<dependency>,<version>)`. Matches the dependency name (`matchDepNames`) and allows only versions on the given line.

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "github>gander-settings/renovate",
    "github>gander-settings/renovate:pin(php,7.4)",
    "github>gander-settings/renovate:pin(node,12)",
    "github>gander-settings/renovate:pin(npm,6)"
  ]
}
```

| Example | Allowed | Blocked |
| --- | --- | --- |
| `pin(php,7.4)` | `7.4`, `7.4.33` | `7.3.x`, `8.0.x` |
| `pin(node,12)` | `12.x.y` | `10.x`, `14.x` |
| `pin(npm,6)` | `6.x.y` | `5.x`, `7.x` |

**Upgrading?** Change the parameter, for example `pin(php,7.4)` to `pin(php,8.1)`.

## Source

[`pin.json`](https://github.com/gander-settings/renovate/blob/main/pin.json)
