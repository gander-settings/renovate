---
title: before
parent: Presets
nav_order: 9
---

# `before`: keep a package below a version

Modifier with 2 parameters. Syntax: `before(<package>,<version>)`. Versions equal to or higher than the second parameter are skipped.

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "github>gander-settings/renovate",
    "github>gander-settings/renovate:before(typescript,7)"
  ]
}
```

| Example | Effect |
| --- | --- |
| `before(typescript,7)` | TypeScript stays on 6.x and lower |
| `before(symfony/*,5.0)` | All `symfony/*` packages stay below 5.0 |

**Ready to upgrade?** Raise the limit (`before(typescript,8)`) or remove the line.

## Source

[`before.json`](https://github.com/gander-settings/renovate/blob/main/before.json)
