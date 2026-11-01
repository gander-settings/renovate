---
title: vue
parent: Presets
nav_order: 10
---

# `vue`: Vue.js projects

Modifier. Same as [`before(typescript,7)`](before.md), with the reason built in.

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "github>gander-settings/renovate",
    "github>gander-settings/renovate:vue"
  ]
}
```

`vue-tsc` crashes on TypeScript 7 with `ERR_PACKAGE_PATH_NOT_EXPORTED './lib/tsc'`. Since the `vue-tsc` peer range is `>=5`, npm alone does not stop version 7, so also set `"typescript": "~6.x"` in `package.json`. Lift both together when `vue-tsc` supports TypeScript 7.

## Source

[`vue.json`](https://github.com/gander-settings/renovate/blob/main/vue.json)
