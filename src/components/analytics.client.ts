import posthog from 'posthog-js'

/**
 * PostHog, product analytics only.
 *
 * Persistence stays at the default (`localStorage+cookie`): PostHog links
 * subdomains through a first-party cookie automatically, which is what keeps
 * a docs reader and the same person signing up on iamtypist.dev as one user
 * rather than two.
 */
interface AnalyticsConfig {
  key: string
  apiHost: string
  uiHost: string
}

export function initAnalytics({ key, apiHost, uiHost }: AnalyticsConfig): void {
  posthog.init(key, {
    // The app's reverse proxy, not PostHog directly: same registrable domain
    // so requests are first-party, and blocklists that drop us.i.posthog.com
    // do not apply. It also serves PostHog's static assets from our edge.
    api_host: apiHost,
    ui_host: uiHost,
    // Pins the defaults for everything NOT set here (pageview, pageleave,
    // and future options), so an SDK update cannot change what is captured.
    defaults: '2026-05-30',
    disable_surveys: true,
    disable_session_recording: true,
    loaded: (ph) => ph.register({ environment: import.meta.env.MODE, source: 'docs' }),
  })
}
