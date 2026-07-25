---
title: search_transcripts
description: Search the Typist transcript library or list recent transcripts.
---

Search completed transcripts by title, exact topic, category, or inclusive UTC date range. Omit all
filters to list the most recent transcripts.

## Input

| Field      | Type         | Default | Description                                      |
| ---------- | ------------ | ------- | ------------------------------------------------ |
| `query`    | string       | —       | Title substring or exact topic, 1–200 characters |
| `category` | category     | —       | Exact Typist content category                    |
| `from`     | `YYYY-MM-DD` | —       | Earliest upload date, inclusive and UTC          |
| `to`       | `YYYY-MM-DD` | —       | Latest upload date, inclusive and UTC            |
| `limit`    | integer      | `20`    | Results per page, from 1 to 100                  |
| `cursor`   | string       | —       | Opaque cursor returned by the previous page      |

`from` must be on or before `to`.

## Output

Each item includes its ID, display name, duration, upload time, category, topics, and `locked`
status. When `nextCursor` is present, pass it unchanged as `cursor` to fetch the next page.

Locked transcripts remain searchable. Use `read_transcript` to read the entitled preview.
