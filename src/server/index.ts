/**
 * Worker entrypoint for the docs site.
 *
 * A reporting shim, nothing more: every request is forwarded to the asset binding
 * and the response is reported to PostHog out of band. It must never render or
 * serve content — the site is statically generated, and `assets.run_worker_first`
 * exists only so this handler can observe traffic the client bundle cannot.
 *
 * Agents never execute the client analytics bundle, and posthog-js drops them as
 * bots anyway, so `$http_log` from the edge is the only way to observe them. A
 * browser page load emits BOTH a `$pageview` and an `$http_log`, so a query must
 * never mix the two.
 *
 * If the Cloudflare Astro adapter is ever adopted, its custom-entrypoint contract
 * is this exact shape (`ExportedHandler<Env>`), so only the `env.ASSETS.fetch`
 * line would change.
 */

import { PostHogAnalyticsService } from './analytics'

/** Pages and the machine-readable surface agents read. CSS, fonts, and images are noise. */
const REPORTABLE_CONTENT = /^text\/(html|markdown|plain)\b/

/**
 * One synthetic id for all edge traffic; profiles are opted out, see
 * `captureEdgeEvent`. The value is the one PostHog's own `$http_log` example uses.
 */
const EDGE_DISTINCT_ID = 'server-log'

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const response = await env.ASSETS.fetch(request)

    // Reporting is observability, never correctness: deleting this must leave the
    // site fully working, just unmeasured. The SDK owns delivery via waitUntil.
    if (REPORTABLE_CONTENT.test(response.headers.get('content-type') ?? '')) {
      const url = new URL(request.url)

      // This handler is the composition root — the role `createAppDeps` plays in the
      // monorepo Worker. It only forwards request-scoped facts; enablement,
      // environment, source, and delivery are the adapter's.
      const analytics = PostHogAnalyticsService.create({
        apiKey: env.POSTHOG_KEY,
        host: url.host,
        waitUntil: (promise) => ctx.waitUntil(promise),
      })

      analytics.trackAnonymous(
        {
          name: '$http_log',
          properties: {
            // `$raw_user_agent` is the one property PostHog's traffic classification
            // requires: getTrafficType, getBotName, and getBotOperator all read it.
            $raw_user_agent: request.headers.get('user-agent') ?? '',
            $current_url: url.href,
            // The project's test-account filters are all `$host not_icontains ...`.
            // Without this property they match nothing, so preview and local traffic
            // cannot be excluded from any agent-facing insight.
            $host: url.host,
            $pathname: url.pathname,
            // Cloudflare resolved the visitor's country at the edge, so no IP is sent
            // to PostHog and its own GeoIP step stays off (it would only ever see
            // Cloudflare's anycast address). `$geoip_country_code` is the property
            // PostHog's country breakdowns read.
            $geoip_country_code: request.cf?.country,
            status_code: response.status,
            method: request.method,
          },
        },
        EDGE_DISTINCT_ID,
      )
    }

    return response
  },
} satisfies ExportedHandler<Env>
