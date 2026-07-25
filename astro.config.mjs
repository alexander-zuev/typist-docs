import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightThemeBlack from 'starlight-theme-black'

export default defineConfig({
  site: 'https://docs.iamtypist.dev',
  integrations: [
    starlight({
      title: 'Typist Docs',
      description: 'Connect AI agents and developer tools to Typist.',
      favicon: '/favicon.svg',
      logo: {
        src: './src/assets/logo.svg',
        alt: 'Typist',
      },
      plugins: [
        starlightThemeBlack({
          navLinks: [
            { label: 'Docs', link: '/mcp/' },
            {
              label: 'Typist',
              link: 'https://iamtypist.dev',
              attrs: { target: '_blank', rel: 'noopener' },
            },
          ],
        }),
      ],
      components: {
        ThemeProvider: './src/components/theme-provider.astro',
      },
      editLink: {
        baseUrl: 'https://github.com/alexander-zuev/typist-docs/edit/main/',
      },
      social: [
        {
          icon: 'github',
          label: 'Typist MCP on GitHub',
          href: 'https://github.com/alexander-zuev/typist-mcp',
        },
      ],
      sidebar: [
        {
          label: 'Typist MCP',
          items: [
            { label: 'Overview', slug: 'mcp' },
            { label: 'Connect a client', slug: 'mcp/connect' },
            { label: 'Authentication', slug: 'mcp/authentication' },
          ],
        },
        {
          label: 'Tools',
          items: [
            { label: 'search_transcripts', slug: 'mcp/tools/search-transcripts' },
            { label: 'read_transcript', slug: 'mcp/tools/read-transcript' },
            { label: 'download_transcript', slug: 'mcp/tools/download-transcript' },
          ],
        },
        {
          label: 'Help',
          items: [
            { label: 'Troubleshooting', slug: 'mcp/troubleshooting' },
            { label: 'Disconnect', slug: 'mcp/disconnect' },
          ],
        },
      ],
      customCss: ['./src/styles/custom.css'],
    }),
  ],
})
