import { readFileSync } from 'node:fs'

const NON_SITEMAP_PAGES = ['/404.html', '/kitchen-sink'] as const

/**
 * Page list is derived from the built sitemap so new docs pages are covered
 * automatically. Special and noindex pages are added explicitly because they
 * are absent from the sitemap by design.
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

export function testedPagePaths(): string[] {
  return [...new Set([...sitemapPaths(), ...NON_SITEMAP_PAGES])]
}
