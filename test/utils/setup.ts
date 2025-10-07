import * as matchers from 'vitest-axe/matchers'

import { expect } from 'vitest'

// @ts-expect-error incomplete implementation
window.IntersectionObserver = class IntersectionObserver {
  // eslint-disable-next-line
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

expect.extend(matchers)
