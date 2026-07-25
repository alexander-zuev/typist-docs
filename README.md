# Typist Docs

Public developer documentation for [Typist](https://iamtypist.dev).

## Development

```bash
pnpm install
pnpm dev
```

Documentation lives in `src/content/docs`. Use Markdown by default and MDX only when a page imports
an Astro or Starlight component.

## Checks

```bash
pnpm format:check
pnpm lint
pnpm check
pnpm build
```

Pushes to `main` deploy the static site to `docs.iamtypist.dev`.
