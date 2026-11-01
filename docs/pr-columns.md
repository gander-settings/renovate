---
title: PR table columns
nav_order: 5
---

# PR table columns (trial)

`base` sets the columns of the PR body table (`prBodyColumns`) for every update. This is a trial set, trimmed down from every column Renovate offers: keep the useful columns and delete the rest from the last `packageRules` entry in `base.json`.

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

{: .note }
The Merge Confidence badges only work for the `go`, `maven`, `npm`, `nuget`, `packagist`, `pypi` and `rubygems` datasources. For others (e.g. GitHub Actions, Docker) those cells stay empty or show an unknown badge.
