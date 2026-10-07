import * as matchers from 'vitest-axe/matchers'

import { expect } from 'vitest'
import { configureAxe } from 'vitest-axe'

// @ts-expect-error incomplete implementation
window.IntersectionObserver = class IntersectionObserver {
  // eslint-disable-next-line
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Icons render through `@iconify/vue`, which fetches icon data from the Iconify
// API. In this happy-dom environment those requests never resolve within a test
// and stay in-flight until happy-dom aborts them while tearing down the window.
// vitest 4 surfaces that abort as an unhandled `AbortError`, failing otherwise
// passing suites. Stub `fetch` so icon requests resolve instantly with an empty
// icon set: nothing stays pending, and since the icons never resolved anyway the
// rendered output (and snapshots) are unchanged. `@iconify/vue` captures the
// global `fetch` on import, which happens after this setup file runs.
globalThis.fetch = () => Promise.resolve(
  new Response(JSON.stringify({ icons: {} }), {
    status: 200,
    headers: { 'content-type': 'application/json' }
  })
)

configureAxe({
  globalOptions: {
    rules: [{
      // Disable region rule as it doesn't work well with components rendered in isolation.
      id: 'region',
      enabled: false
    }]
  }
})

expect.extend(matchers)
