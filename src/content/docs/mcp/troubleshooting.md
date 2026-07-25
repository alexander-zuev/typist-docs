---
title: Troubleshooting
description: Resolve common Typist MCP connection and tool errors.
---

## The browser authorization page does not open

Open your MCP client's connection settings and start authorization for `typist` again. Terminal
clients may provide a separate login command after the server is added.

## The client reports an invalid or expired token

Disconnect Typist from the client, add it again, and complete the browser flow. Tokens from a
different Typist account cannot be reused.

## A transcript cannot be found

`read_transcript` deliberately returns the same not-found result for unknown IDs, transcripts owned
by another account, incomplete transcripts, and transcripts without a stored result. Run
`search_transcripts` and use the returned ID.

## A tool is rate limited

Wait for the retry period returned by the tool. Current per-user limits are 60 searches per minute
and 30 read or download calls per minute.

## A transcript is shorter than expected

Check `locked`. Locked transcripts expose only the preview available to the connected account.
