import AxeBuilder from '@axe-core/playwright'
import type { Page } from '@playwright/test'

/**
 * `best-practice` is included on purpose: landmark uniqueness, region coverage,
 * and heading order are not WCAG failures, but they are how a screen-reader
 * user navigates a reference site — which is most of what this site is for.
 */
export const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag22aa', 'best-practice']

/** Violations as `rule: offending html`, the form assertions compare against. */
export async function axeViolations(page: Page): Promise<string[]> {
  const { violations } = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze()
  return violations.map((v) => `${v.id}: ${v.nodes[0]?.html ?? ''}`)
}
