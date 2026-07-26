import { expect, test } from '@playwright/test'

import { axeViolations } from './axe'
import { sitemapPaths } from './pages'

/**
 * axe covers text contrast, heading order, landmarks, and ARIA on every
 * published page. Two gaps are covered elsewhere: non-text contrast has no axe
 * rule (tokens.spec.ts), and hidden surfaces are skipped entirely by axe
 * (interactive.spec.ts).
 */
for (const path of new Set([...sitemapPaths(), '/kitchen-sink'])) {
  test(`a11y: ${path}`, async ({ page }) => {
    await page.goto(path)
    expect(await axeViolations(page)).toEqual([])
  })
}
