import { docsLoader } from '@astrojs/starlight/loaders'
import { docsSchema } from '@astrojs/starlight/schema'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { defineCollection } from 'astro:content'

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  changelog: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/changelog' }),
    schema: z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      product: z.enum(['MCP']),
    }),
  }),
}
