import { expect, test } from '@playwright/test'

import { sitemapPaths } from './pages'

/**
 * Geometry checks axe has no rule for.
 *
 * Reflow (SC 1.4.10): at 320px — a 1280px desktop viewport zoomed to 400% —
 * the page itself must not scroll horizontally. Designated scroll regions are
 * explicitly allowed, which is why wide tables live in `.nb-table-scroll` and
 * code blocks scroll inside their own `pre`.
 *
 * Text resize (SC 1.4.4): at 200% text size the layout must not clip content.
 * Browser text-zoom scales fonts without scaling the layout, so anything sized
 * in px with a fixed height loses its text — rem-based sizing survives.
 */
// Every published page plus the fixture: layout regressions show up per-page
// (a wide table on one, an overflowing header on another), so sampling a few
// would miss exactly the cases this is for.
const PAGES = [...new Set([...sitemapPaths(), '/kitchen-sink'])]

const overflow = (page: import('@playwright/test').Page) =>
  page.evaluate(() => {
    const doc = document.documentElement
    // Elements wider than the viewport that are not inside an opted-in
    // scroll container are what actually push the page sideways.
    const offenders = [...document.body.querySelectorAll<HTMLElement>('*')]
      .filter((el) => {
        // Visually-hidden content (sr-only, off-screen skip links) is clipped to
        // 1px and never contributes to the page's scroll width.
        if (!el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) return false
        if (el.closest('.sr-only')) return false

        // SC 1.4.10 permits overflow inside a container that scrolls in that
        // axis — tab strips, code blocks, table wrappers. Detect that from
        // computed style rather than a hardcoded selector list, so a new
        // scrolling component doesn't need the test updated.
        for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
          const overflowX = getComputedStyle(a).overflowX
          if (overflowX === 'auto' || overflowX === 'scroll') return false
        }
        // The right edge is what pushes the page, not raw width: an element can
        // be narrow yet positioned past the viewport.
        return el.getBoundingClientRect().right > doc.clientWidth + 1
      })
      .slice(0, 3)
      .map((el) => `${el.tagName.toLowerCase()}.${el.className}`.slice(0, 80))

    return { pageScroll: doc.scrollWidth - doc.clientWidth, offenders }
  })

test.describe('reflow at 320px (400% zoom)', () => {
  test.use({ viewport: { width: 320, height: 800 } })

  for (const path of PAGES) {
    test(`no horizontal page scroll: ${path}`, async ({ page }) => {
      await page.goto(path)
      expect(await overflow(page)).toEqual({ pageScroll: 0, offenders: [] })
    })
  }
})

test.describe('text resized to 200%', () => {
  for (const path of PAGES) {
    test(`no clipping or page scroll: ${path}`, async ({ page }) => {
      await page.goto(path)
      // The root font size is the anchor for every rem in the system, so
      // doubling it reproduces a 200% text-only zoom.
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '32px'
      })

      expect(await overflow(page)).toEqual({ pageScroll: 0, offenders: [] })
    })
  }
})
