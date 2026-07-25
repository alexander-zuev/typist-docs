---
title: download_transcript
description: Create a one-hour download URL for a transcript export.
---

Create a temporary export URL for a transcript.

## Input

| Field    | Type                | Default  | Description   |
| -------- | ------------------- | -------- | ------------- |
| `id`     | UUID                | required | Transcript ID |
| `format` | `txt`, `srt`, `vtt` | `txt`    | Export format |

## Output

| Field         | Type                | Description                       |
| ------------- | ------------------- | --------------------------------- |
| `downloadUrl` | URL                 | Temporary transcript download URL |
| `format`      | `txt`, `srt`, `vtt` | Export format                     |
| `expiresAt`   | ISO 8601 datetime   | URL expiration time               |

The download URL is valid for one hour.
