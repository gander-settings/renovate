---
title: lockfile
parent: Presets
nav_order: 6
---

# `lockfile`

Modifier. Lock file maintenance on demand. `base` turns lock file maintenance off, because a full lock refresh bypasses the release age and the automerge rules per update type. Add `lockfile` when you want to refresh the lock file yourself, at a moment you choose.

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "github>gander-settings/renovate",
    "github>gander-settings/renovate:lockfile"
  ]
}
```

- Renovate lists "Lock file maintenance" under "Pending Approval" in the Dependency Dashboard issue (created automatically, even though `base` turns the dashboard off). Tick it to get the PR; there is no schedule to wait for (`schedule: ["at any time"]`).
- The PR is not automerged (`automerge: false`), even next to the `automerge` modifier: review it and let CI judge it. `minimumReleaseAge` does not apply to the transitive versions it pulls in.
- A repo `packageRules` entry with `matchUpdateTypes: ["lockFileMaintenance"]` and `enabled: false` still wins, so you can keep it off for one manager (e.g. a frozen npm frontend).

## Source

[`lockfile.json`](https://github.com/gander-settings/renovate/blob/main/lockfile.json)
