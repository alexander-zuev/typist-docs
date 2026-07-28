/**
 * Traffic reporter in front of the static asset server.
 *
 * The site stays fully static: this Worker never renders anything, it forwards
 * every request to the asset binding and reports content responses to PostHog
 * as `$http_log`. That is the only way to observe agents, which never execute
 * the client-side analytics bundle and are dropped by its bot blocking anyway.
 *
 * Humans are still measured by posthog-js. A browser page load therefore emits
 * both a `$pageview` and an `$http_log`; queries must never mix the two.
 */

/** Pages and the machine-readable surface agents read. Everything else (CSS, fonts, images) is noise. */
const REPORTABLE_CONTENT = /^text\/(html|markdown|plain)\b/

/**
 * Direct, not the app's browser relay: that relay exists to keep requests
 * first-party and survive ad blockers, neither of which applies server-side.
 * Mirrors how `@typist/core` captures server-side events.
 */
const POSTHOG_INGEST_URL = 'https://us.i.posthog.com'

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const response = await env.ASSETS.fetch(request)
    ctx.waitUntil(report(request, response, env))
    return response
  },
} satisfies ExportedHandler<Env>

/**
 * Never throws: the response has already been served, so a reporting failure
 * must not surface as a request failure. No key means no analytics, matching
 * the client-side policy for local and preview builds.
 */
async function report(request: Request, response: Response, env: Env): Promise<void> {
  if (!env.POSTHOG_KEY) return
  if (!REPORTABLE_CONTENT.test(response.headers.get('content-type') ?? '')) return

  const url = new URL(request.url)

  try {
    await fetch(`${POSTHOG_INGEST_URL}/i/v0/e/`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        api_key: env.POSTHOG_KEY,
        event: '$http_log',
        distinct_id: 'server-log',
        properties: {
          $raw_user_agent: request.headers.get('user-agent') ?? '',
          $current_url: url.href,
          $pathname: url.pathname,
          status_code: response.status,
          method: request.method,
        },
      }),
    })
  } catch {
    return
  }
}
