---
title: Changing the presets
nav_order: 6
---

# Changing the presets

## Validate before pushing

```sh
npx --yes --package renovate -- renovate-config-validator --strict --no-global *.json
```

Run it in the preset repo before pushing, because a broken preset causes a config error in every repo that extends it. CI runs the same check on every pull request and weekly, to catch presets broken by new Renovate releases.

## Rules for new presets

- A new preset is a **modifier**: it must not extend `base` or `default`. Extending the base from several presets loads it repeatedly and can make Renovate runs hang.
- Give it a `description` that starts with `Modifier, list after github>gander-settings/renovate.`
- Add a page under `docs/presets/`, a row to the preset tables (`README.md`, `docs/index.md`) and a link in `docs/llms.txt`.
- Every snippet in the docs is a complete, copy-ready `renovate.json`.

## Repository layout

```
default.json     github>gander-settings/renovate: base + automerge
base.json        base config without automerge
defaults.json    deprecated alias of base
automerge.json   modifier: automerge rules
forks.json       modifier: fork processing
pin.json         modifier: pin(<dependency>,<version>)
before.json      modifier: before(<package>,<version>)
vue.json         modifier: before(typescript,7)
docker.json      modifier: docker:pinDigests
legacy.json      modifier: one PR per package for minors
approval.json    modifier: updates only after dashboard approval
lockfile.json    modifier: lock file maintenance on demand
disabled.json    modifier: Renovate turned off
docs/            this documentation (GitHub Pages) and llms.txt
```
