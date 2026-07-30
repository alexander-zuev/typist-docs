# Typist Docs

- Nimbus content lives in `src/content/docs`.
- Use Markdown unless a page imports a component.
- Visible layouts, components, and styles are owned source under `src/`.
- Keep the site light-only unless the product direction changes.
- Keep claims aligned with the deployed Typist MCP contract.
- The site is statically generated and deployed through Cloudflare Worker Static Assets.
- Do not add SSR or the Cloudflare Astro adapter without an approved requirement.
- `src/server/` is a reporting shim only: it forwards every request to the `ASSETS` binding and
  reports content responses to PostHog as `$http_log`. It must never render or serve content.
- `src/server/` is typed by `src/server/tsconfig.json`; its runtime types replace the DOM lib, so
  they stay excluded from the Astro `tsconfig.json`. That exclusion is what keeps the two type
  worlds apart — do not add Worker code anywhere else under `src/`.
- `src/server/analytics.ts` copies the delivery semantics of `PostHogAnalyticsService` from
  `@typist/core` rather than importing it: this app is a submodule outside the pnpm workspace.
  Keep `flushAt: 1`, `flushInterval: 0`, and `$process_person_profile: false` in step with core.
