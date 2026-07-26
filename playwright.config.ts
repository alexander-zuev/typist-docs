import { defineConfig, devices } from '@playwright/test'

const PORT = 4321
const BASE_URL = `http://localhost:${PORT}`

/**
 * Style checks run against the built `dist/` output, not the dev server:
 * production CSS, real Shiki output, no HMR client. Every assertion is
 * intentionally blind to visual design — nothing here needs re-baselining when
 * colors, spacing, or type change on purpose.
 */
export default defineConfig({
  testDir: './test',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? 'github' : 'list',
  webServer: {
    command: `pnpm dlx sirv-cli dist --single --port ${PORT} --quiet`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  use: {
    baseURL: BASE_URL,
    // Deterministic runs: transitions can't be mid-flight when axe samples
    // colors or when a reflow measurement reads element geometry.
    contextOptions: { reducedMotion: 'reduce' },
  },
  projects: [
    {
      name: 'mobile',
      use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 } },
    },
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
  ],
})
