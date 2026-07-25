---
title: Typist MCP
description: Search, read, and download your Typist transcripts from an MCP client.
---

Let AI assistants search, read, and analyze your Typist transcripts without manually copying and
pasting them.

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
