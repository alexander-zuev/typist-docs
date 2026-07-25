---
title: Typist MCP
description: Search, read, and download your Typist transcripts from an MCP client.
---

Typist MCP connects an MCP-compatible AI client directly to your transcript library.

**Server URL**

```text
https://mcp.iamtypist.dev/mcp
```

The server uses Streamable HTTP and browser-based OAuth. You do not need to create or copy an API
key.

## Available tools

| Tool                                                  | Purpose                                       |
| ----------------------------------------------------- | --------------------------------------------- |
| [`search_transcripts`](./tools/search-transcripts/)   | Search the library or list recent transcripts |
| [`read_transcript`](./tools/read-transcript/)         | Read transcript text or subtitles             |
| [`download_transcript`](./tools/download-transcript/) | Create a one-hour export URL                  |

All tools are read-only. They cannot create, edit, or delete transcripts.

## Transcript access

Only completed transcripts are returned. Locked transcripts remain discoverable, but reading or
downloading one returns only the preview available to your account.
