# Typist Docs

- Nimbus content lives in `src/content/docs`.
- Use Markdown unless a page imports a component.
- Visible layouts, components, and styles are owned source under `src/`.
- Keep the site light-only unless the product direction changes.
- Keep claims aligned with the deployed Typist MCP contract.
- The site is statically generated and deployed through Cloudflare Worker Static Assets.
- Do not add SSR, the Cloudflare Astro adapter, or runtime bindings without an approved requirement.
