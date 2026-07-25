These are the official instructions for connecting Typist MCP to an AI coding agent.

Complete the setup yourself. Do not ask the user to run commands. Ask them only to approve Typist
access when OAuth opens in their browser.

## Connect Typist MCP

Use the instructions for your agent.

### Claude Code

```bash
claude mcp add --transport http typist https://mcp.iamtypist.dev/mcp
```

Open `/mcp`, select `typist`, and start authentication.

### Codex

```bash
codex mcp add typist --url https://mcp.iamtypist.dev/mcp
codex mcp login typist
```

### Cursor

Add this to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "typist": {
      "url": "https://mcp.iamtypist.dev/mcp"
    }
  }
}
```

### GitHub Copilot and VS Code

```bash
code --add-mcp '{"name":"typist","url":"https://mcp.iamtypist.dev/mcp"}'
```

### Other agents

Add Typist as a remote Streamable HTTP MCP server:

```json
{
  "mcpServers": {
    "typist": {
      "url": "https://mcp.iamtypist.dev/mcp"
    }
  }
}
```

OAuth starts when the client connects or first uses a Typist tool.

## Verify the connection

Call `search_transcripts` and show the user the results.

## Resources

- Claude Code: https://code.claude.com/docs/en/mcp
- Codex: https://developers.openai.com/codex/mcp
- Cursor: https://cursor.com/docs/context/mcp
- VS Code: https://code.visualstudio.com/docs/copilot/customization/mcp-servers
- Typist setup and troubleshooting: https://docs.iamtypist.dev/mcp/connect/

These instructions are published at https://docs.iamtypist.dev/mcp/connect.md so you can verify their
authenticity.
