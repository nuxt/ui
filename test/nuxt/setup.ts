import * as matchers from 'vitest-axe/matchers'
import type { AxeMatchers } from 'vitest-axe/matchers'

import { expect } from 'vitest'
import { configureAxe } from 'vitest-axe'

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

if (typeof window !== 'undefined') {
  const localStorage = window.localStorage

  if (!localStorage || typeof localStorage.getItem !== 'function' || typeof localStorage.setItem !== 'function') {
    Object.defineProperty(window, 'localStorage', {
      value: storage,
      configurable: true
    })
  }
}

if (typeof globalThis.localStorage === 'undefined' || typeof globalThis.localStorage.getItem !== 'function' || typeof globalThis.localStorage.setItem !== 'function') {
  Object.defineProperty(globalThis, 'localStorage', {
    value: storage,
    configurable: true
  })
}

expect.extend(matchers)
