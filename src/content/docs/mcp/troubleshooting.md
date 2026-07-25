---
title: Troubleshooting
description: Resolve common Typist MCP connection and tool errors.
---

## The browser authorization page does not open

Open your MCP client's connection settings and start authorization for `typist` again. Terminal
clients may provide a separate login command after the server is added.

## `Missing or invalid access token`

Disconnect Typist from the client, add it again, and complete the browser flow. Tokens from a
different Typist account cannot be reused.

## The connection request expired or was already used

Restart authorization from the MCP client. Connection request pages cannot be reused.

## `This request belongs to another account`

Sign in with the Typist account that started the connection, or restart authorization and choose
the intended account.

## `Transcript not found`

Run `search_transcripts` and find the transcript. If it is absent, it is not available to this
connection. If it appears but still cannot be read, retry once, then contact support.

## `Rate limit exceeded`

Wait for the number of seconds returned by the tool before trying again.

## The client rejects tool input

Check the tool's required fields, formats, ranges, and transcript ID against the corresponding tool
page.

## `Something went wrong`

Retry the tool once. If the error continues, email
[support@iamtypist.dev](mailto:support@iamtypist.dev) with the client, tool name, and approximate
time of the failure.
