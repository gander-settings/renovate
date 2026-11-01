---
title: Presets
nav_order: 3
has_children: true
permalink: /presets/
---

# Presets

Every preset is a JSON file in the repository root. Reference it as `github>gander-settings/renovate:<name>`; the file `default.json` is loaded by `github>gander-settings/renovate` with no name.

- **Base presets** carry the whole base config: [`default`](default.md) and [`base`](base.md).
- **Modifiers** change a few options and never extend the base. List them after `github>gander-settings/renovate`.
