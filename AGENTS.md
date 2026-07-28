# Typist Docs

- Nimbus content lives in `src/content/docs`.
- Use Markdown unless a page imports a component.
- Visible layouts, components, and styles are owned source under `src/`.
- Keep the site light-only unless the product direction changes.
- Keep claims aligned with the deployed Typist MCP contract.
- The site is statically generated and deployed through Cloudflare Worker Static Assets.
- Do not add SSR or the Cloudflare Astro adapter without an approved requirement.
- `worker/` is a reporting shim only: it forwards every request to the `ASSETS` binding and
  reports content responses to PostHog as `$http_log`. It must never render or serve content.
- `worker/` is typed by `worker/tsconfig.json`; its runtime types replace the DOM lib, so they
  stay excluded from the Astro `tsconfig.json`.
