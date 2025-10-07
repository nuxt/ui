import * as matchers from 'vitest-axe/matchers'
import type { AxeMatchers } from 'vitest-axe/matchers'

import { expect } from 'vitest'

declare module 'vitest' {
  export interface Assertion extends AxeMatchers {}
  export interface AsymmetricMatchersContaining extends AxeMatchers {}
}

expect.extend(matchers)
