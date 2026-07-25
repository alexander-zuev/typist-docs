---
title: Authentication
description: How Typist MCP authenticates clients and protects transcript access.
---

Typist MCP uses browser-based OAuth with PKCE. It does not use manually created API keys.

## Authorization flow

1. Your MCP client discovers the Typist authorization server.
2. Typist asks you to sign in if you do not have an active session.
3. Typist shows the requesting client and its read-only access.
4. You approve or deny the connection.
5. The client receives access associated with your Typist user.

The MCP server passes that user identity through a private Worker binding. The main Typist
application remains responsible for transcript ownership and entitlement checks.

## Access boundary

- The connection can search, read, and download transcripts.
- It cannot create, edit, or delete transcripts.
- It can access only transcripts owned by the account that approved it.
- Locked transcripts expose only the preview available to that account.
