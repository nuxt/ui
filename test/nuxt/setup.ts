import * as matchers from 'vitest-axe/matchers'
import type { AxeMatchers } from 'vitest-axe/matchers'

import { beforeAll, expect } from 'vitest'
import { configureAxe } from 'vitest-axe'
import { preloadOverlayContent } from '../utils/overlays'

declare module 'vitest' {
  export interface Assertion extends AxeMatchers {}
  export interface AsymmetricMatchersContaining extends AxeMatchers {}
}

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

beforeAll(preloadOverlayContent)
