# 🤖 gander-settings/renovate

Shareable [Renovate](https://docs.renovatebot.com/config-presets/) presets. Pick the ones you need and list them in `extends`.

## 📦 Presets

| Preset | What it does |
| --- | --- |
| `defaults` | Base config: `config:recommended`, pinned GitHub Actions digests, weekly lock file maintenance, semantic commits, monorepo grouping, 3/7/30-day release age for patch/minor/major, separate major/minor/patch PRs, no dependency dashboard |
| `automerge` | Extends `defaults` and automerges patch updates, GitHub Actions pins and digests, and lock file maintenance, plus vulnerability fixes. Updates without a release timestamp are not automerged. Major and minor updates are never automerged |
| `forks` | Extends `defaults` and turns on `forkProcessing`, so Renovate also runs in forks |
| `pin` | Keeps a tool on one version line, e.g. PHP 7.4.x or Node 12.x. Takes 2 parameters |
| `before` | Keeps a package below a given version, e.g. TypeScript below 7. Takes 2 parameters |
| `vue` | Extends `defaults` and keeps TypeScript below 7, because `vue-tsc` does not support it yet |
| `docker` | Extends `defaults` and pins Docker image tags to digests (`docker:pinDigests`) |
| `legacy` | Extends `defaults` and opens one PR per package with its newest minor, instead of one PR per minor line. Multiple majors still get separate PRs |
| `approval` | Extends `defaults` and holds every update in the Dependency Dashboard until you approve it there (`dependencyDashboardApproval`). No branches or PRs until then. Vulnerability fixes are not held |
| `disabled` | Extends `defaults` and turns Renovate off for the repo (`enabled: false`), keeping the config in place |

🧬 **`automerge`, `forks`, `vue`, `docker`, `legacy`, `approval` and `disabled` extend `defaults`**, so any one of them gives you the full base config. `pin` and `before` are parameterised and are often listed many times, so they do **not** extend `defaults` (each copy would pull in a full copy of `config:recommended`). Always combine them with `automerge` or `defaults`.

## 🚀 Quick start

Add a `renovate.json` to your repo.

🚀 **Automerge** (the usual choice):

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["github>gander-settings/renovate:automerge"]
}
```

🛑 **Disabled** (Renovate off, config kept):

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["github>gander-settings/renovate:disabled"]
}
```

🏚️ **Legacy** (project far behind on updates: one PR per package with its newest minor, instead of one per minor line):

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "github>gander-settings/renovate:automerge",
    "github>gander-settings/renovate:legacy"
  ]
}
```

To switch between automerge and disabled, change only the preset name. Only need the base config? Use `github>gander-settings/renovate:defaults`. Want updates held until you approve them? Use `github>gander-settings/renovate:approval`.

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

## 💚 `vue`: Vue.js projects

```json
{
  "extends": [
    "github>gander-settings/renovate:automerge",
    "github>gander-settings/renovate:vue"
  ]
}
```

Same as `before(typescript,7)`, with the reason built in. `vue-tsc` crashes on TypeScript 7 with `ERR_PACKAGE_PATH_NOT_EXPORTED './lib/tsc'`. Since the `vue-tsc` peer range is `>=5`, npm alone does not stop version 7, so also set `"typescript": "~6.x"` in `package.json`. Lift both together when `vue-tsc` supports TypeScript 7.

## 🐳 `docker`: pin images to digests

```json
{
  "extends": [
    "github>gander-settings/renovate:automerge",
    "github>gander-settings/renovate:docker"
  ]
}
```

Digest and pin updates for Docker images are **not** automerged (a moved tag can change the image content), unlike GitHub Actions.

## 🏚️ `legacy`: projects far behind on updates

```json
{
  "extends": [
    "github>gander-settings/renovate:automerge",
    "github>gander-settings/renovate:legacy"
  ]
}
```

A project many minor versions behind would otherwise get one PR per minor line (e.g. `doctrine/orm` 2.8.x, 2.9.x, … 2.20.x). `legacy` turns off `separateMultipleMinor`, so each package gets one PR with its newest minor. Majors stay separate (`separateMultipleMajor`).

## ⏸️ `approval` and `disabled`: pause a repo

Swap the main preset, keep the rest of `extends` as it is:

```json
{
  "extends": [
    "github>gander-settings/renovate:approval",
    "github>gander-settings/renovate:pin(php,7.4)"
  ]
}
```

- `approval`: Renovate keeps scanning and lists every pending update in the Dependency Dashboard issue (created automatically, even though `defaults` turns the dashboard off). Tick an update there to get its PR. Security fixes still open PRs straight away, because Renovate's `vulnerabilityAlerts` defaults set `dependencyDashboardApproval: false`.
- `disabled`: Renovate stops working on the repo. On the first run after the switch it closes its open PRs and issues and deletes its branches. Switch back to `automerge` or `defaults` to turn it on again.

⚠️ `defaults` sets `enabled: true`, and later presets win. Use `approval` or `disabled` **instead of** `automerge`/`defaults`, not next to them: `["…:disabled", "…:automerge"]` turns Renovate back on.

## 🧪 PR table columns (trial)

`defaults` sets the columns of the PR body table (`prBodyColumns`) for every update. This is a trial set, trimmed down from every column Renovate offers: keep the useful columns and delete the rest from the last `packageRules` entry in `defaults.json`.

| Column | Shows |
| --- | --- |
| `Package` | Package name, linked to its source |
| `Type` | Dependency type, e.g. `dependencies`, `devDependencies` |
| `Update` | Update type: `major`, `minor`, `patch`, `digest`, … |
| `Change` | Old → new version |
| `Pending` | Newer versions held back, e.g. by `minimumReleaseAge` |
| `References` | Links to the source, homepage and changelog |
| `Age` | Merge Confidence badge: how long the new version has been out |
| `Adoption` | Merge Confidence badge: share of Renovate users on the new version |
| `Passing` | Merge Confidence badge: share of updates with passing tests |
| `Confidence` | Merge Confidence badge: overall confidence for this update |

Already removed: `Current value`, `New value` and `Package file`. Add them back to `prBodyColumns` if needed.

The Merge Confidence badges only work for the `go`, `maven`, `npm`, `nuget`, `packagist`, `pypi` and `rubygems` datasources. For others (e.g. GitHub Actions, Docker) those cells stay empty or show an unknown badge.

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
pin.json         📌 pin(<dependency>,<version>)
before.json      ⏳ before(<package>,<version>)
vue.json         💚 defaults + before(typescript,7)
docker.json      🐳 defaults + docker:pinDigests
legacy.json      🏚️ defaults + one PR per package for minors
approval.json    ⏸️ defaults + updates only after dashboard approval
disabled.json    🛑 defaults + Renovate turned off
```
