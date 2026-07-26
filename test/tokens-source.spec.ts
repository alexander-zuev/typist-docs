import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, test } from '@playwright/test'

/**
 * Source-level policy: colors live in the token layer. A literal color anywhere
 * else bypasses the theme, so retheming silently misses it. Preventive rather
 * than detective — the point is that the next one-off color can't be merged.
 */
const SRC = fileURLToPath(new URL('../src', import.meta.url))
const TOKEN_FILE = join(SRC, 'styles', 'globals.css')
const LITERAL_COLOR = /(oklch\(|rgba?\(|hsla?\(|#[0-9a-fA-F]{3,8}\b)/

function* walk(dir: string): Generator<string> {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) yield* walk(path)
    else if (/\.(astro|css)$/.test(path)) yield path
  }
}

test('colors are declared only in the token layer', () => {
  const offenders: string[] = []

  for (const path of walk(SRC)) {
    if (path === TOKEN_FILE) continue
    readFileSync(path, 'utf8')
      .split('\n')
      .forEach((line, i) => {
        // `currentColor` and SVG `fill="none"` are colorless; skip comments.
        if (line.trimStart().startsWith('*') || line.trimStart().startsWith('/*')) return
        if (LITERAL_COLOR.test(line)) {
          offenders.push(`${path.replace(SRC, 'src')}:${i + 1}  ${line.trim()}`)
        }
      })
  }

  expect(offenders).toEqual([])
})
