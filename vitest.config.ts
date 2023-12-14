/// <reference types="vitest" />
import { fileURLToPath } from 'node:url'
import { defineVitestConfig } from 'nuxt-vitest/config'

export default defineVitestConfig({
  // @ts-ignore
  test: {
    testTimeout: 20000,
    globals: true,
    silent: true,
    environment: 'nuxt',
    environmentOptions: {
      nuxt: {
        rootDir: fileURLToPath(new URL('test/nuxt/', import.meta.url))
      }
    }
  }
})
