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

The tool returns the selected format, an expiration time, and a presigned download URL valid for
one hour.

Locked transcripts export only the preview available to your account.
