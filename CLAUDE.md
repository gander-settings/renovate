# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Conventions

### Language
- Communicate with Claude in Polish.
- Write all code, documentation, and comments in English.

### Commits
- Never commit without explicit user instruction.
- Use Conventional Commits format (feat, fix, chore, docs, refactor, test, ci).
- Commit messages in English.
- No AI attribution in commits, PR bodies or GitHub comments.

## What this repo is

Shared Renovate presets for every `gander*` repo. Renovate runs as the hosted Mend Renovate Community app, so only repo-level config is available: no global/admin config, no `allowedCommands`, no `postUpgradeTasks`, no CLI flags.

## Preset rules

- `default.json` (`github>gander-settings/renovate`) = `base` + `automerge`. Only `default.json`, `base.json` and the `defaults.json` alias carry the base config.
- Every other preset is a modifier: it must never extend `base`, `default` or `defaults`. Repeated extends of the base once multiplied `config:recommended` ~29 times in feng-shui-wlade and made the Renovate run hang.
- Modifiers may extend built-in Renovate presets (`docker:pinDigests`) or parameterised presets of this repo (`vue` → `before(typescript,7)`).
- Lock file maintenance stays off everywhere: a full lock refresh bypasses `minimumReleaseAge` and the minor/major automerge block.
- Every update type keeps a release age (3/5/7 days for patch/minor/major). Exempt only sources that expose no release timestamps (`pinDigest`, `github-runners`, GHCR images) and vulnerability fixes; add a `description` explaining each exemption.
- `automerge` only covers patch, GitHub Actions pins/digests and vulnerability fixes, with `minimumReleaseAgeBehaviour: timestamp-required`. Do not add minor or major automerge.
- Automerge uses `automergeStrategy: merge-commit` with `platformAutomerge`.

## Docs

- README snippets are complete, copy-ready `renovate.json` files (with `$schema`), never a bare `extends` fragment.
- Every snippet starts `extends` with `github>gander-settings/renovate`; modifiers come after it.
- Update the preset table, the repository layout and the "Known limits" section when a preset changes.

## Validation

```sh
npx --yes --package renovate -- renovate-config-validator --strict --no-global *.json
```

CI runs the same command on every PR and weekly. A broken preset breaks every consumer repo.

## Changing consumers

- New or migrated consumer repos use `"extends": ["github>gander-settings/renovate", …modifiers]`. A repo that extends only a modifier (e.g. `:automerge`) runs without the base config.
- Right after a consumer switches to the base, Renovate autocloses PRs whose versions are younger than `minimumReleaseAge`. This is expected.
- Bulk config changes across consumer repos go on the branch `ci/renovate-reconfigure`, one PR per repo.
