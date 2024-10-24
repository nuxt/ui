import { describe, expect, it } from 'vitest'
import { defu } from 'defu'
import { join } from 'pathe'
import { loadNuxt } from '@nuxt/kit'
import type { NuxtConfig } from '@nuxt/schema'
import type * as tailwindcss from 'tailwindcss'
import type resolveConfig from 'tailwindcss/resolveConfig'

type TWConfig = tailwindcss.Config

async function getTailwindCSSConfig(overrides: Partial<NuxtConfig> = {}) {
  let tailwindConfig: ReturnType<typeof resolveConfig<TWConfig>>
  const nuxt = await loadNuxt({
    ready: true,
    cwd: join(process.cwd(), 'fixtures', 'empty'),
    dev: false,
    overrides: defu(overrides, {
      ssr: false,
      modules: ['../../src/module'],
      hooks: {
        'tailwindcss:resolvedConfig'(config) {
          tailwindConfig = config
        }
      }
    } satisfies NuxtConfig) as NuxtConfig
  })
  const nuxtOptions = structuredClone({
    plugins: nuxt.options.plugins.map(p => typeof p !== 'string' && ({ src: p.src, mode: p.mode })),
    _requiredModules: nuxt.options._requiredModules,
    appConfig: nuxt.options.appConfig
  })
  await nuxt.close()

  return {
    nuxtOptions,
    tailwindConfig
  }
}

describe('nuxt', () => {
  it('should add plugins and modules to nuxt', async () => {
    const { nuxtOptions } = await getTailwindCSSConfig()
    expect(nuxtOptions.plugins).toContainEqual(
      expect.objectContaining({
        src: expect.stringContaining('plugins/colors'),
        mode: 'all'
      })
    )
    expect(nuxtOptions._requiredModules).toMatchObject({
      '@nuxtjs/color-mode': true,
      '@nuxtjs/tailwindcss': true
    })
    // default values in appConfig
    expect(nuxtOptions.appConfig.ui).toMatchObject({
      primary: 'green',
      gray: 'cool'
    })
  })
})
