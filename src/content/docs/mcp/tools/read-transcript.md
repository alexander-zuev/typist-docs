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

## Output

The tool's text content contains the rendered transcript page. Its structured result contains:

| Field         | Type             | Description                                       |
| ------------- | ---------------- | ------------------------------------------------- |
| `id`          | UUID             | Transcript ID                                     |
| `displayName` | string           | Transcript name                                   |
| `language`    | string or null   | Detected language                                 |
| `duration`    | number or null   | Duration in seconds                               |
| `category`    | category or null | Typist content category                           |
| `topics`      | string[] or null | Extracted topics                                  |
| `locked`      | boolean          | Whether transcript access is locked               |
| `offset`      | integer          | Start of this page in the rendered output         |
| `nextOffset`  | integer          | Start of the next page, when one is available     |
| `totalChars`  | integer          | Total characters in the rendered output           |
| `truncated`   | boolean          | Whether more content is available                 |
| `segments`    | segment[]        | Timing and speaker data when explicitly requested |

## Pagination

When `truncated` is `true`, call the tool again with the returned `nextOffset`. Offsets refer to the
rendered format, so do not reuse a TXT offset for SRT or VTT.

The tool keeps transcript segments and subtitle cues together where possible.
