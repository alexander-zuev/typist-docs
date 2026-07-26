import { readFileSync } from 'node:fs'

/**
 * Page list is derived from the built sitemap so new docs pages are covered
 * automatically. `noindex` pages (kitchen sink) are absent by design — they
 * are asserted explicitly where relevant.
 */
export function sitemapPaths(): string[] {
  const xml = readFileSync(new URL('../dist/sitemap-0.xml', import.meta.url), 'utf8')
  // Trailing slashes are normalized so an explicitly-added path can't duplicate
  // its sitemap twin into two identical test cases.
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
    new URL(m[1]).pathname.replace(/(.)\/$/, '$1'),
  )
  if (urls.length === 0) throw new Error('No URLs in sitemap — run `pnpm build` first')
  return urls.sort()
}
