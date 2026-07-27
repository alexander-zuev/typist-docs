---
title: Typist MCP
description: Search, read, and download your Typist transcripts from an MCP client.
sidebar:
  label: Overview
---

Let AI assistants search, read, and analyze your Typist transcripts without manually copying and
pasting them.

**Server URL**

```text
https://mcp.iamtypist.dev/mcp
```

The server uses Streamable HTTP and browser-based OAuth. You do not need to create or copy an API
key. [Quickstart](./quickstart/) gets you to a first answer in two minutes.

## Available tools

| Tool                                                  | Purpose                                       |
| ----------------------------------------------------- | --------------------------------------------- |
| [`search_transcripts`](./tools/search-transcripts/)   | Search the library or list recent transcripts |
| [`read_transcript`](./tools/read-transcript/)         | Read transcript text or subtitles             |
| [`download_transcript`](./tools/download-transcript/) | Create a one-hour export URL                  |

All tools are read-only. They cannot create, edit, or delete transcripts.

## How connecting works

Typist MCP is itself the OAuth authorization server, so there is no API key to create or rotate.
The client registers itself, sends you to a browser to sign in and approve read-only access, then
exchanges a code for a token bound to your account. PKCE is required and the plain code challenge
is refused.

Every tool call carries that token, and the server resolves it to your account before touching any
data. An agent never sees your Typist password, and it never holds a credential that works
anywhere else.

## Boundaries

- **No writes.** There is no tool to create, rename, edit, or delete a transcript, so no prompt can
  reach one.
- **One account.** The token resolves to a single user. There is no cross-account access.
- **Transcripts only.** Recordings and billing are not exposed.
- **Short-lived links.** Export URLs are signed for one hour, then stop working.

## What the agent receives

`search_transcripts` returns metadata rather than text: titles, topics, category, duration, and a
`locked` flag. The agent decides from that what is worth reading.

`read_transcript` returns text in pages, defaulting to 2000 characters with a `nextOffset` to
continue, because many clients cap tool output. Clients that can take more may request up to 90000
characters per call. A long recording therefore costs several calls, and an agent that ignores
`nextOffset` sees only the beginning.

Transcripts not unlocked on your plan stay visible in search with `locked: true`, and reading one
returns its preview rather than the full text. That is not an error, which is why a thin answer is
worth checking against the `locked` flag.

[Errors and limits](./errors/) has the rate limits and every error message the tools can return.
