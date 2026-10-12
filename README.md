# 🤖 gander-settings/renovate

Shareable [Renovate](https://docs.renovatebot.com/config-presets/) presets. Pick the ones you need and list them in `extends`.

## 📦 Presets

| Preset | What it does |
| --- | --- |
| `defaults` | Base config: `config:recommended`, pinned GitHub Actions digests, weekly lock file maintenance, semantic commits, monorepo grouping, 3-day release age, separate major/minor/patch PRs, no dependency dashboard |
| `automerge` | Extends `defaults` and automerges patch updates, GitHub Actions pins and digests, and lock file maintenance. Major and minor updates are never automerged |
| `forks` | Extends `defaults` and turns on `forkProcessing`, so Renovate also runs in forks |
| `pin` | Extends `defaults` and keeps a tool on one version line, e.g. PHP 7.4.x or Node 12.x. Takes 2 parameters |
| `before` | Extends `defaults` and keeps a package below a given version, e.g. TypeScript below 7. Takes 2 parameters |

🧬 **Every preset extends `defaults`**, so you never need to add it yourself. Any single preset gives you the full base config, and combining several is safe.

## 🚀 Quick start

Add a `renovate.json` to your repo:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["github>gander-settings/renovate:automerge"]
}
```

Only need the base config? Use `github>gander-settings/renovate:defaults`.

## 🍴 Working in a fork?

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "github>gander-settings/renovate:automerge",
    "github>gander-settings/renovate:forks"
  ]
}
```

## 📌 `pin`: stay on one version line

Syntax: `pin(<dependency>,<version>)`

```json
{
  "extends": [
    "github>gander-settings/renovate:automerge",
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

🔄 **Upgrading?** Change the parameter, for example `pin(php,7.4)` to `pin(php,8.1)`.

## ⏳ `before`: keep a package below a version

Syntax: `before(<package>,<version>)`. Versions equal to or higher than the second parameter are skipped.

```json
{
  "extends": [
    "github>gander-settings/renovate:automerge",
    "github>gander-settings/renovate:before(typescript,7)"
  ]
}
```

| Example | Effect |
| --- | --- |
| `before(typescript,7)` | TypeScript stays on 6.x and lower |
| `before(symfony/*,5.0)` | All `symfony/*` packages stay below 5.0 |

🔓 **Ready to upgrade?** Raise the limit (`before(typescript,8)`) or remove the line.

## 🧩 Combining presets

```json
{
  "extends": [
    "github>gander-settings/renovate:automerge",
    "github>gander-settings/renovate:pin(php,7.4)",
    "github>gander-settings/renovate:pin(node,12)",
    "github>gander-settings/renovate:before(typescript,7)"
  ]
}
```

- 📚 Presets are merged from first to last, and later ones win when options conflict.
- ➕ `packageRules` from all presets are added together, so you can use `pin` and `before` as many times as you like.
- 🔢 Parameters are plain strings: no quotes, separated by commas. If a value contains a comma, the preset has to use `{{args}}` instead of `{{arg0}}`.

## 🧪 Validating changes

```sh
npx --yes --package renovate -- renovate-config-validator --strict --no-global *.json
```

Run it in the preset repo before pushing, because a broken preset causes a config error in every repo that extends it.

## 🗂️ Repository layout

```
defaults.json    🧱 base config
automerge.json   🚀 defaults + automerge rules
forks.json       🍴 defaults + fork processing
pin.json         📌 defaults + pin(<dependency>,<version>)
before.json      ⏳ defaults + before(<package>,<version>)
```
