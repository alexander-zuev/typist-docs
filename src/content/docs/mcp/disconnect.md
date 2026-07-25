---
title: Disconnect Typist
description: Remove Typist MCP access from an MCP client.
---

Remove the `typist` server or connector from the client where you added it.

| Client      | Remove Typist                                                                                  | Official guide                                                                    |
| ----------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Claude      | Open **Customize → Connectors**, find Typist, then select **Remove**                           | [Claude connectors](https://support.claude.com/en/articles/11175166)              |
| ChatGPT     | Open **Settings → Apps**, select Typist, then disconnect it                                    | [ChatGPT apps](https://help.openai.com/en/articles/11487775-apps-in-chatgpt)      |
| Claude Code | Run `claude mcp remove typist`                                                                 | [Claude Code MCP](https://code.claude.com/docs/en/mcp)                            |
| Codex       | Run `codex mcp remove typist`                                                                  | [Codex MCP](https://developers.openai.com/codex/mcp)                              |
| Cursor      | Remove `typist` from `.cursor/mcp.json` or your global `mcp.json`, then reload Cursor          | [Cursor MCP](https://cursor.com/docs/context/mcp)                                 |
| VS Code     | Run **MCP: List Servers** from the Command Palette, select `typist`, then choose **Uninstall** | [VS Code MCP](https://code.visualstudio.com/docs/agent-customization/mcp-servers) |

Adding Typist again starts a new browser authorization flow.
