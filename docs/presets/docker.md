---
title: docker
parent: Presets
nav_order: 11
---

# `docker`: pin images to digests

Modifier. Pins Docker image tags in Dockerfiles, Compose files and workflows to digests (`docker:pinDigests`). `base` already includes it through `config:best-practices`, so listing it changes nothing; it is kept so existing configs keep working.

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "github>gander-settings/renovate",
    "github>gander-settings/renovate:docker"
  ]
}
```

Digest updates for Docker images (a moved tag, e.g. `composer:2`) are automerged by [`automerge`](automerge.md) once the tag is 3 days old and CI is green. Docker Hub images with a versioned tag only: unversioned tags (`latest`, `alpine`) and other registries (`ghcr.io`, `quay.io`, ECR), which publish no release timestamp, stay as PRs for review. The first pin of an image to its digest is automerged right away.

## Source

[`docker.json`](https://github.com/gander-settings/renovate/blob/main/docker.json)
