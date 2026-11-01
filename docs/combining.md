---
title: Combining presets
nav_order: 4
---

# Combining presets

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "github>gander-settings/renovate",
    "github>gander-settings/renovate:pin(php,7.4)",
    "github>gander-settings/renovate:pin(node,12)",
    "github>gander-settings/renovate:before(typescript,7)"
  ]
}
```

- Presets are merged from first to last, and later ones win when options conflict.
- `packageRules` from all presets are added together, so you can use [`pin`](presets/pin.md) and [`before`](presets/before.md) as many times as you like.
- Parameters are plain strings: no quotes, separated by commas. If a value contains a comma, the preset has to use `{% raw %}{{args}}{% endraw %}` instead of `{% raw %}{{arg0}}{% endraw %}`.

{: .warning }
Keep `github>gander-settings/renovate` **first**. The base config sets `enabled: true`, so `["…:disabled", "github>gander-settings/renovate"]` turns Renovate back on.

## Base without automerge

Use `github>gander-settings/renovate:base` instead of `github>gander-settings/renovate`:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["github>gander-settings/renovate:base"]
}
```
