import * as matchers from 'vitest-axe/matchers'
import type { AxeMatchers } from 'vitest-axe/matchers'

import { expect } from 'vitest'
import { configureAxe } from 'vitest-axe'
import { installVueWrapperAxePlugin } from '../utils/vue-wrapper-plugin'

declare module 'vitest' {
  export interface Assertion extends AxeMatchers {}
  export interface AsymmetricMatchersContaining extends AxeMatchers {}
}

configureAxe({})

installVueWrapperAxePlugin()

expect.extend(matchers)
