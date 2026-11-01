---
title: docker
parent: Presets
nav_order: 11
---

# `docker`: pin images to digests

Modifier. Pins Docker image tags in Dockerfiles, Compose files and workflows to digests (`docker:pinDigests`).

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "github>gander-settings/renovate",
    "github>gander-settings/renovate:docker"
  ]
}
```

Digest and pin updates for Docker images are **not** automerged (a moved tag can change the image content), unlike GitHub Actions.

## Source

[`docker.json`](https://github.com/gander-settings/renovate/blob/main/docker.json)
