import type { HastPluginInput } from '@cloudflare/nimbus-docs/types'

/**
 * Wraps wide tables in a keyboard-reachable scroll container.
 *
 * nimbus's own `tableScroll()` emits a bare `<div class="nb-table-scroll">`,
 * which axe flags as `scrollable-region-focusable`: the region scrolls but no
 * keyboard user can reach it, so a wide table's right-hand columns become
 * unreachable without a pointer. Adding tabindex + an accessible name fixes
 * that at build time, with no client JS.
 *
 * Keep the `nb-table-scroll` class — prose.css owns its overflow styling.
 */
export function scrollableTable(wrapperClass = 'nb-table-scroll'): HastPluginInput {
  return {
    name: 'typist:scrollable-table',
    element: {
      filter: ['table'],
      visit(node) {
        // Component-owned tables carry their own classes and scroll handling.
        const className = node.properties?.className
        if (Array.isArray(className) && className.length > 0) return

        return {
          type: 'element',
          tagName: 'div',
          properties: {
            className: [wrapperClass],
            tabindex: '0',
            // `group`, not `region`: region is a landmark, and a page with more
            // than one table would then carry duplicate unnamed landmarks.
            role: 'group',
            'aria-label': 'Scrollable table',
          },
          children: [
            {
              type: 'element',
              tagName: 'table',
              properties: { ...node.properties },
              children: node.children ?? [],
            },
          ],
        }
      },
    },
  }
}
