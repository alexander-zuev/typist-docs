import { expect, test } from '@playwright/test'

/**
 * Nimbus ships no CSS — it ships MARKUP. Our stylesheets hook onto the classes
 * and attributes its transforms and client scripts emit, so a nimbus upgrade
 * that renames any of them leaves the site styled by rules that match nothing:
 * valid HTML, passing types, passing axe, visibly broken.
 *
 * This asserts the hooks still exist. Unlike a screenshot baseline it is blind
 * to intentional design changes — colors, spacing, and type can move freely
 * without touching a single expectation here.
 */
const CONTRACT = [
  { selector: '.nb-code-figure', owner: 'nimbus code transform', styledBy: 'globals.css:284' },
  { selector: '.nb-code-figure[data-nb-lang]', owner: 'nimbus', styledBy: 'globals.css:331' },
  { selector: '.nb-code-figure-titled', owner: 'nimbus (title meta)', styledBy: 'globals.css:331' },
  { selector: 'pre.astro-code .line', owner: 'shiki', styledBy: 'globals.css:366' },
  {
    selector: 'pre.astro-code .line.highlighted',
    owner: 'shiki transform',
    styledBy: 'globals.css:375',
  },
  {
    selector: 'pre.astro-code .line.diff.add',
    owner: 'shiki transform',
    styledBy: 'globals.css:384',
  },
  {
    selector: 'pre.astro-code .line.diff.remove',
    owner: 'shiki transform',
    styledBy: 'globals.css:388',
  },
  { selector: '.nb-table-scroll', owner: 'tableScroll() plugin', styledBy: 'prose.css:185' },
  { selector: '.docs-content', owner: 'docs layout', styledBy: 'prose.css:3' },
] as const

test('nimbus markup contract holds', async ({ page }) => {
  await page.goto('/kitchen-sink')

  const missing: string[] = []
  for (const { selector, owner, styledBy } of CONTRACT) {
    if ((await page.locator(selector).count()) === 0) {
      missing.push(`${selector} (emitted by ${owner}, styled at ${styledBy})`)
    }
  }

  expect(missing).toEqual([])
})

test('client scripts inject their styled hooks', async ({ page }) => {
  await page.goto('/kitchen-sink')

  // codeCopy() and headingAnchors() run on load; both inject elements that
  // exist only in CSS we own.
  await expect(page.locator('.nb-code-copy').first()).toBeAttached()
  await expect(page.locator('.heading-anchor').first()).toBeAttached()
})

test('prose boundary is intact', async ({ page }) => {
  await page.goto('/kitchen-sink')

  // prose.css styles only classless markdown elements. If a component starts
  // emitting classless headings or paragraphs it silently inherits prose rules
  // (double margins, wrong size) — assert markdown h2s still land unclassed.
  const classlessHeadings = await page.locator('.docs-content h2:not([class])').count()
  expect(classlessHeadings).toBeGreaterThan(0)
})
