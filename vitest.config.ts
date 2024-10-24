import { fileURLToPath } from 'node:url'
import { defineVitestConfig } from '@nuxt/test-utils/config'
import { defaultExclude } from 'vitest/config'

export default defineVitestConfig({
  test: {
    testTimeout: 1000,
    globals: true,
    silent: true,
    exclude: [...defaultExclude, './test/vue/**.spec.ts'],
    environment: 'nuxt',
    environmentOptions: {
      nuxt: {
        rootDir: fileURLToPath(new URL('test/nuxt/', import.meta.url))
      }
    },
    setupFiles: fileURLToPath(new URL('test/nuxt/setup.ts', import.meta.url))
  }
})
