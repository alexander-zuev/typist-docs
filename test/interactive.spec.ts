import { expect, test } from '@playwright/test'

import { axeViolations } from './axe'

/**
 * axe skips hidden content, so a page scan at load never reaches the search
 * dialog, the mobile sidebar, inactive tab panels, or closed disclosures —
 * which is precisely where focus management and ARIA state live. Each test here
 * opens one of those surfaces first, then scans.
 */

test('search dialog is accessible when open', async ({ page }) => {
  await page.goto('/mcp')
  await page.locator('[data-search-trigger]').first().click()
  await expect(page.locator('dialog[open], [role="dialog"]').first()).toBeVisible()

  expect(await axeViolations(page)).toEqual([])
})

test('every tab panel is accessible, not just the first', async ({ page }) => {
  await page.goto('/kitchen-sink')

  const tabs = page.getByRole('tab')
  const count = await tabs.count()
  expect(count).toBeGreaterThan(1)

  for (let i = 0; i < count; i++) {
    await tabs.nth(i).click()
    expect(await axeViolations(page)).toEqual([])
  }
})

test('open disclosures are accessible', async ({ page }) => {
  await page.goto('/kitchen-sink')

  for (const summary of await page.locator('.docs-content details > summary').all()) {
    await summary.click()
  }

  expect(await axeViolations(page)).toEqual([])
})

test('mobile sidebar is accessible when open', async ({ page, viewport }) => {
  test.skip((viewport?.width ?? 0) > 1024, 'sidebar is always visible on desktop')

  await page.goto('/mcp')
  await page.locator('[data-menu-btn]').first().click()
  await expect(page.locator('[data-mobile-sidebar]').first()).toBeVisible()

  expect(await axeViolations(page)).toEqual([])
})

test('client navigation preserves runtime and rebinds page scripts', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async () => {} },
    })
  })
  await page.goto('/mcp/connect')
  await page.evaluate(
    () => ((window as Window & { __routerRuntime?: boolean }).__routerRuntime = true),
  )

  await page.locator('header a[href="/"]').click()
  await page.locator('a[href="/mcp/connect"]').first().click()

  expect(
    await page.evaluate(() => (window as Window & { __routerRuntime?: boolean }).__routerRuntime),
  ).toBe(true)
  await page.locator('[data-setup-prompt]').click()
  await expect(page.locator('[data-copy-label]')).toHaveText('Prompt copied')
})
