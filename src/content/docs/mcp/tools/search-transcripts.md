---
title: Search transcripts
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

| Field        | Type   | Description                                     |
| ------------ | ------ | ----------------------------------------------- |
| `items`      | array  | Matching completed transcripts                  |
| `nextCursor` | string | Cursor for the next page, when one is available |

Each item contains:

| Field         | Type              | Description                         |
| ------------- | ----------------- | ----------------------------------- |
| `id`          | UUID              | Transcript ID                       |
| `displayName` | string            | Transcript name                     |
| `duration`    | number            | Duration in seconds                 |
| `uploadedAt`  | ISO 8601 datetime | Upload time                         |
| `category`    | category or null  | Typist content category             |
| `topics`      | string[] or null  | Extracted topics                    |
| `locked`      | boolean           | Whether transcript access is locked |

When `nextCursor` is present, pass it unchanged as `cursor` to fetch the next page.
