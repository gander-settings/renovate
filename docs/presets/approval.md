---
title: approval
parent: Presets
nav_order: 4
---

# `approval`

Modifier. Holds every update in the Dependency Dashboard until you approve it there (`dependencyDashboardApproval: true`). No branches or PRs until then.

Add it right after the default preset and keep the rest of `extends` as it is:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "github>gander-settings/renovate",
    "github>gander-settings/renovate:approval",
    "github>gander-settings/renovate:pin(php,7.4)"
  ]
}
```

- Renovate keeps scanning and lists every pending update in the Dependency Dashboard issue (created automatically, even though `base` turns the dashboard off). Tick an update there to get its PR.
- Security fixes still open PRs straight away, because Renovate's `vulnerabilityAlerts` defaults set `dependencyDashboardApproval: false`.

## Source

[`approval.json`](https://github.com/gander-settings/renovate/blob/main/approval.json)
