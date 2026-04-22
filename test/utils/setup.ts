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

function createStorageMock() {
  const store = new Map<string, string>()

  return {
    get length() {
      return store.size
    },
    clear() {
      store.clear()
    },
    getItem(key: string) {
      return store.get(key) ?? null
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null
    },
    removeItem(key: string) {
      store.delete(key)
    },
    setItem(key: string, value: string) {
      store.set(key, String(value))
    }
  }
}

const storage = createStorageMock()

if (!window.localStorage || typeof window.localStorage.getItem !== 'function' || typeof window.localStorage.setItem !== 'function') {
  Object.defineProperty(window, 'localStorage', {
    value: storage,
    configurable: true
  })
}

if (typeof globalThis.localStorage === 'undefined' || typeof globalThis.localStorage.getItem !== 'function' || typeof globalThis.localStorage.setItem !== 'function') {
  Object.defineProperty(globalThis, 'localStorage', {
    value: storage,
    configurable: true
  })
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
