/**
 * PostHog, product analytics only.
 *
 * Loaded through a dynamic import so the ~73 KB library lands in its own chunk
 * rather than the page bundle. Persistence stays at the default
 * (`localStorage+cookie`): PostHog links subdomains through a first-party
 * cookie automatically, which is what keeps a docs reader and the same person
 * signing up on iamtypist.dev as one user rather than two.
 */
export function initAnalytics(key: string): void {
  void import('posthog-js').then(({ default: posthog }) => {
    posthog.init(key, {
      // The app's reverse proxy, not PostHog directly: same registrable domain
      // so requests are first-party, and blocklists that drop us.i.posthog.com
      // do not apply. It also serves PostHog's static assets from our edge.
      api_host: 'https://iamtypist.dev/relay',
      ui_host: 'https://us.posthog.com',
      // Pins the defaults for everything NOT set here (pageview, pageleave,
      // and future options), so an SDK update cannot change what is captured.
      defaults: '2026-05-30',
      // A docs site has few interactions; the ones that matter are explicit.
      autocapture: false,
      disable_surveys: true,
      disable_session_recording: true,
      loaded: (ph) => ph.register({ source: 'docs' }),
    })

    // A zero result_count names a page the docs do not have.
    document.addEventListener('nb:search', (event) => {
      const { query, resultCount } = (event as CustomEvent<SearchEventDetail>).detail
      posthog.capture('docs_search_performed', { query, result_count: resultCount })
    })

    document.addEventListener('click', (event) => {
      const target = event.target
      if (!(target instanceof Element)) return

      // Searching then clicking a result is "found it"; searching and leaving
      // is not. Without this the two are indistinguishable.
      const result = target.closest('#search-listbox a[href]')
      if (result) {
        posthog.capture('docs_search_result_clicked', { href: result.getAttribute('href') })
      }

      // Copying a snippet is the strongest intent signal on the site.
      const copied = target.closest('[data-setup-prompt]')
        ? 'setup_prompt'
        : target.closest('.nb-code-copy')
          ? 'code_block'
          : null
      if (copied) {
        posthog.capture('docs_code_copied', { page: location.pathname, kind: copied })
      }

      const link = target.closest<HTMLAnchorElement>('a[href]')
      if (link?.hostname === 'iamtypist.dev') {
        posthog.capture('docs_outbound_to_app', { href: link.href, from_page: location.pathname })
      }
    })
  })
}

interface SearchEventDetail {
  query: string
  resultCount: number
}
