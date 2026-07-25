---
title: read_transcript
description: Read TXT, SRT, or VTT transcript content in bounded pages.
---

Read a transcript by the ID returned from `search_transcripts`.

## Input

| Field             | Type                | Default  | Description                                            |
| ----------------- | ------------------- | -------- | ------------------------------------------------------ |
| `id`              | UUID                | required | Transcript ID                                          |
| `format`          | `txt`, `srt`, `vtt` | `txt`    | Rendered output format                                 |
| `offset`          | integer             | `0`      | Character offset in the rendered output                |
| `maxChars`        | integer             | `2000`   | Page size from 1,000 to 90,000 characters              |
| `includeSegments` | boolean             | `false`  | Include complete source segments contained in the page |

## Pagination

When `truncated` is `true`, call the tool again with the returned `nextOffset`. Offsets refer to the
rendered format, so do not reuse a TXT offset for SRT or VTT.

The renderer prefers complete transcript segments or subtitle cues. If one unit exceeds
`maxChars`, it is sliced without splitting a Unicode surrogate pair.

## Locked transcripts

A locked transcript returns only the preview available to your account. All offsets and
`totalChars` refer to that preview.
