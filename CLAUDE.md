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

### Pull requests
- No AI attribution: no `Co-Authored-By`/`Claude-Session` trailers, no "Generated with Claude Code" lines or links in PR bodies or GitHub comments.
- Bulk config changes in consumer repos go on the branch `ci/renovate-reconfigure`, one PR per repo.

## What this repo is

Shared Renovate presets for every `gander*` repo, run by the hosted Mend Renovate Community app: repo-level config only (no global/admin options, no `allowedCommands`, no `postUpgradeTasks`). Goal: automate routine updates, but automerge only what is well tested; everything else stays reviewable.

## Preset rules

- `default.json` (`github>gander-settings/renovate`) = `base` + `automerge`. Only `default.json`, `base.json` and the deprecated `defaults.json` alias carry the base config.
- Every other preset is a modifier and must never extend `base`, `default` or `defaults`: repeated extends of the base once made a consumer's Renovate run hang. Modifiers may extend built-in presets (`docker:pinDigests`) or this repo's parameterised presets (`vue` → `before(typescript,7)`).
- Lock file maintenance stays off: a full lock refresh bypasses `minimumReleaseAge` and the minor/major automerge block.
- Keep a release age on every update type (3/5/7 days for patch/minor/major). Exempt only sources without release timestamps (`pinDigest`, `github-runners`, GHCR images) and vulnerability fixes, each with a `description`.
- `automerge` covers only patches, GitHub Actions pins/digests and vulnerability fixes, with `minimumReleaseAgeBehaviour: timestamp-required` and `automergeStrategy: merge-commit`. Never automerge minor or major.
- `minimumReleaseAge` only gates the package Renovate bumps, not transitive packages in the lock file.

## Docs

- README snippets are complete, copy-ready `renovate.json` files (with `$schema`) that start `extends` with `github>gander-settings/renovate`.
- Update the preset table and the repository layout in README when a preset changes.

## Validation

```sh
npx --yes --package renovate -- renovate-config-validator --strict --no-global *.json
```

CI runs it on every PR and weekly. A broken preset breaks every consumer repo.

## Consumers

- Consumers use `"extends": ["github>gander-settings/renovate", …modifiers]`. A repo that extends only a modifier (e.g. `:automerge`) runs without the base config.
- Right after a consumer switches to the base, Renovate autocloses PRs younger than the release age. This is expected.
