import nimbus, { defineConfig as defineNimbusConfig } from '@cloudflare/nimbus-docs'
import tailwindcss from '@tailwindcss/vite'
import icon from 'astro-icon'
import { defineConfig } from 'astro/config'

import { scrollableTable } from './src/lib/scrollable-table'

const nimbusConfig = defineNimbusConfig({
  site: 'https://docs.iamtypist.dev',
  title: 'Typist Platform',
  description: 'Connect AI agents and developer tools to Typist.',
  locale: 'en',
  homeLabel: 'Typist Platform',
  github: 'https://github.com/alexander-zuev/typist-docs',
  editPattern: 'https://github.com/alexander-zuev/typist-docs/edit/main/{path}',
  socialImageAlt: 'Typist Platform documentation',
  sidebar: {
    items: [
      {
        label: 'Typist MCP',
        items: ['mcp', 'mcp/connect'],
      },
      {
        label: 'Tools',
        items: [
          'mcp/tools/search-transcripts',
          'mcp/tools/read-transcript',
          'mcp/tools/download-transcript',
        ],
      },
      {
        label: 'Help',
        items: ['mcp/troubleshooting', 'mcp/disconnect'],
      },
    ],
    indexDisplay: 'overview-leaf',
    overviewLabel: true,
  },
})

export default defineConfig({
  output: 'static',
  // nimbus keeps its own Shiki themes unless this is set. Its github-light
  // default renders parameters at 3.49:1 on the code surface; the -default
  // palettes are GitHub's contrast-corrected rebuild, all tokens above 4.5:1.
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light-default', dark: 'github-dark-default' },
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  integrations: [
    icon(),
    nimbus(nimbusConfig, {
      rules: {
        'nimbus/frontmatter-shape': 'error',
        'nimbus/internal-link': 'error',
      },
      markdown: {
        hastPlugins: [scrollableTable()],
      },
      // The sitemap is built from routes, not collections, so the harness
      // fixture at /kitchen-sink has to be dropped explicitly. Returning
      // undefined omits an entry.
      sitemap: {
        serialize: (item) => (item.url.includes('/kitchen-sink') ? undefined : item),
      },
    }),
  ],
})
