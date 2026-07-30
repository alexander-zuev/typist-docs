/**
 * PostHog analytics boundary for the docs Worker.
 *
 * A copy of `PostHogAnalyticsService` from `@typist/core`, not an import: this app
 * is a git submodule outside the pnpm workspace. Keep it structurally in step with
 * core — the only intended differences are the ones core cannot express here:
 * there is no `AppDeps` composition root, no `AnalyticsContext` idempotency key,
 * and no `MissingConfigurationError`.
 *
 * The entrypoint injects only request-scoped facts (key, host, request lifetime);
 * this adapter owns enablement, environment resolution, SDK construction,
 * delivery, and source attribution.
 */

import { PostHog } from 'posthog-node'

/**
 * Direct, not the app's browser relay: that relay exists to keep requests
 * first-party and survive ad blockers, neither of which applies server-side.
 */
const POSTHOG_INGEST_URL = 'https://us.i.posthog.com'

/** The only host serving production docs; anything else is preview or local. */
const PRODUCTION_HOST = 'docs.iamtypist.dev'

/** Every event from this adapter is edge-reported, never client-side. */
const EVENT_SOURCE = 'docs-edge'

const NOOP_POSTHOG = new Proxy(
  {},
  {
    get: () => () => {},
  },
) as PostHog

/** PostHog analytics boundary used by the docs Worker. */
export class PostHogAnalyticsService {
  constructor(
    private readonly _client: PostHog | null,
    private readonly config: PostHogAnalyticsConfig,
  ) {}

  /**
   * Creates a no-op adapter when no key is configured — matching the client-side
   * policy for local and preview builds — or a fully configured PostHog client.
   */
  static create(config: PostHogAnalyticsConfig): PostHogAnalyticsService {
    const apiKey = config.apiKey?.trim()
    if (!apiKey) return new PostHogAnalyticsService(null, config)

    // PostHog's serverless guidance flushes each capture and disables timer-based delivery.
    // https://posthog.com/docs/libraries/node#options
    const client = new PostHog(apiKey, {
      host: POSTHOG_INGEST_URL,
      flushAt: 1,
      flushInterval: 0,
      waitUntil: config.waitUntil,
    })
    void client.register({
      environment: config.host === PRODUCTION_HOST ? 'production' : 'development',
      source: EVENT_SOURCE,
    })
    return new PostHogAnalyticsService(client, config)
  }

  get posthog(): PostHog {
    return this._client ?? NOOP_POSTHOG
  }

  /**
   * Capture without a person profile (`$process_person_profile: false`). Every edge
   * event shares one distinct id, so profiles would collapse into a single junk
   * person — the same reason core uses this for attempt-keyed events.
   *
   * Consequence for queries: person-scoped analysis (`uniq(person_id)`, cohort-based
   * test-account filters) does not apply to these events. Filter on `$host`.
   */
  trackAnonymous(event: AnalyticsEventInput, distinctId: string): void {
    if (!this._client) return

    this.config.waitUntil(
      this._client.captureImmediate({
        distinctId,
        event: event.name,
        properties: {
          ...event.properties,
          $process_person_profile: false,
        },
      }),
    )
  }
}

/** Mirrors core's `AnalyticsEventInput` without importing its generics. */
export interface AnalyticsEventInput {
  name: string
  properties: Record<string, unknown>
}

/** Request-scoped facts the entrypoint knows; every policy decision is made in `create`. */
export interface PostHogAnalyticsConfig {
  /** Absent or blank disables reporting entirely. */
  apiKey: string | undefined
  /** Request host, resolved to the reported environment. */
  host: string
  waitUntil: (promise: Promise<unknown>) => void
}
