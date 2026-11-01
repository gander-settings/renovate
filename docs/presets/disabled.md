---
title: disabled
parent: Presets
nav_order: 5
---

# `disabled`

Modifier. Turns Renovate off for the repo (`enabled: false`), keeping the config in place. Remove the second line to turn it back on.

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "github>gander-settings/renovate",
    "github>gander-settings/renovate:disabled"
  ]
}
```

- On the first run after the switch Renovate closes its open PRs and issues and deletes its branches.

{: .warning }
The base config sets `enabled: true`, and later presets win. Keep `github>gander-settings/renovate` **first**: `["…:disabled", "github>gander-settings/renovate"]` turns Renovate back on.

## Source

[`disabled.json`](https://github.com/gander-settings/renovate/blob/main/disabled.json)
