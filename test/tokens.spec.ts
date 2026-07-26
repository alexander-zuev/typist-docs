import { expect, test } from '@playwright/test'

/**
 * Contrast pairs that axe cannot reach: non-text contrast (WCAG 2.2 SC 1.4.11
 * has no automated rule) and states that only exist under interaction.
 *
 * Every pair below is one that actually occurs in the UI — asserting the full
 * token cartesian product would fail on combinations the site never renders.
 * When a token starts appearing on a new surface, add the pair here.
 *
 * Colors resolve through a canvas so the browser performs the oklch -> sRGB
 * conversion and alpha compositing, matching what a user's eye receives.
 */
type Pair = { fg: string; bg: string; min: number; where: string }

const NON_TEXT = 3
const TEXT = 4.5

const PAIRS: Pair[] = [
  // Focus ring — lands on every interactive surface.
  { fg: '--nb-ring', bg: '--nb-background', min: NON_TEXT, where: 'focus ring on page' },
  { fg: '--nb-ring', bg: '--nb-card', min: NON_TEXT, where: 'focus ring on card/header' },
  { fg: '--nb-ring', bg: '--nb-muted', min: NON_TEXT, where: 'focus ring on muted row' },

  // Links carry body color, so the underline alone identifies them (1.4.11).
  // --nb-border and --nb-border-strong are absent by design: dividers and hover
  // borders are decorative, and the controls they outline are identified by
  // their own text and surface contrast.
  { fg: '--nb-link-underline', bg: '--nb-background', min: NON_TEXT, where: 'link underline' },
  { fg: '--nb-link-underline', bg: '--nb-card', min: NON_TEXT, where: 'link underline on card' },

  // Status colors: as aside borders/icons on the page, and as text on their own tint.
  { fg: '--nb-info', bg: '--nb-background', min: NON_TEXT, where: 'info border' },
  { fg: '--nb-info-foreground', bg: '--nb-info-muted', min: TEXT, where: 'info aside text' },
  { fg: '--nb-success', bg: '--nb-background', min: NON_TEXT, where: 'success border' },
  { fg: '--nb-success-foreground', bg: '--nb-success-muted', min: TEXT, where: 'success text' },
  { fg: '--nb-warning', bg: '--nb-background', min: NON_TEXT, where: 'warning border' },
  { fg: '--nb-warning-foreground', bg: '--nb-warning-muted', min: TEXT, where: 'warning text' },
  { fg: '--nb-danger', bg: '--nb-background', min: NON_TEXT, where: 'danger border' },
  { fg: '--nb-danger-foreground', bg: '--nb-danger-muted', min: TEXT, where: 'danger text' },

  // De-emphasized text never sits on plain background alone: table headers, the
  // code language badge, and inline code all place it on the muted surface.
  { fg: '--nb-muted-foreground', bg: '--nb-background', min: TEXT, where: 'secondary text' },
  { fg: '--nb-muted-foreground', bg: '--nb-muted', min: TEXT, where: 'badge / table header' },
  { fg: '--nb-muted-foreground', bg: '--nb-card', min: TEXT, where: 'copy button icon' },

  // Body text on every surface it renders against.
  { fg: '--nb-foreground', bg: '--nb-background', min: TEXT, where: 'body copy' },
  { fg: '--nb-foreground', bg: '--nb-muted', min: TEXT, where: 'inline code / kbd' },
  { fg: '--nb-foreground', bg: '--nb-card', min: TEXT, where: 'code block text' },

  // Hover states — axe only ever samples the default state.
  {
    fg: '--nb-primary-foreground',
    bg: '--nb-primary',
    min: TEXT,
    where: 'primary button label',
  },
  {
    fg: '--nb-primary-foreground',
    bg: '--nb-primary-hover',
    min: TEXT,
    where: 'primary button label (hover)',
  },
  { fg: '--nb-foreground', bg: '--nb-accent', min: TEXT, where: 'sidebar link (hover)' },
  { fg: '--nb-foreground', bg: '--nb-selected', min: TEXT, where: 'sidebar link (selected)' },
]

test('token contrast pairs meet WCAG minimums', async ({ page }) => {
  await page.goto('/')

  const failures = await page.evaluate((pairs) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!
    const root = getComputedStyle(document.documentElement)

    // Paints `color` over `backdrop` and returns the composited sRGB pixel, so
    // semi-transparent tokens are measured as they actually appear.
    const paint = (color: string, backdrop?: string): [number, number, number] => {
      if (backdrop) {
        ctx.fillStyle = backdrop
        ctx.fillRect(0, 0, 1, 1)
      }
      ctx.fillStyle = color
      ctx.fillRect(0, 0, 1, 1)
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
      return [r, g, b]
    }

    const luminance = ([r, g, b]: [number, number, number]) => {
      const [rl, gl, bl] = [r, g, b].map((v) => {
        const s = v / 255
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
      })
      return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl
    }

    const token = (name: string) => {
      const value = root.getPropertyValue(name).trim()
      if (!value) throw new Error(`Token ${name} is not defined`)
      return value
    }

    return pairs
      .map(({ fg, bg, min, where }) => {
        const bgValue = token(bg)
        const bgLuminance = luminance(paint(bgValue))
        const fgLuminance = luminance(paint(token(fg), bgValue))
        const [lighter, darker] =
          fgLuminance > bgLuminance ? [fgLuminance, bgLuminance] : [bgLuminance, fgLuminance]
        const ratio = Math.round(((lighter + 0.05) / (darker + 0.05)) * 100) / 100
        return { where, fg, bg, ratio, min }
      })
      .filter((r) => r.ratio < r.min)
  }, PAIRS)

  expect(failures).toEqual([])
})
