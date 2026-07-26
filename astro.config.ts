import nimbus, { defineConfig as defineNimbusConfig } from '@cloudflare/nimbus-docs'
import { tableScroll } from '@cloudflare/nimbus-docs/markdown'
import tailwindcss from '@tailwindcss/vite'
import icon from 'astro-icon'
import { defineConfig } from 'astro/config'

const nimbusConfig = defineNimbusConfig({
  site: 'https://docs.iamtypist.dev',
  title: 'Typist Platform',
  description: 'Connect AI agents and developer tools to Typist.',
  locale: 'en',
  homeLabel: 'Typist Platform',
  github: 'https://github.com/alexander-zuev/typist-mcp',
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
        hastPlugins: [tableScroll()],
      },
    }),
  ],
})
