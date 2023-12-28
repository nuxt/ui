import { describe, expect, it } from 'vitest'
import { defu } from 'defu'
import { join } from 'pathe'
import { loadNuxt } from '@nuxt/kit'
import type { NuxtConfig } from '@nuxt/schema'
import type * as tailwindcss from 'tailwindcss'
type TWConfig = tailwindcss.Config;
import type resolveConfig from 'tailwindcss/resolveConfig'

async function getTailwindCSSConfig (overrides: Partial<NuxtConfig> = {}) {
  let tailwindConfig: ReturnType<typeof resolveConfig<TWConfig>>
  const nuxt = await loadNuxt({
    ready: true,
    cwd: join(process.cwd(), 'fixtures', 'empty'),
    dev: false,
    overrides: defu(overrides, {
      ssr: false,
      modules: ['../../src/module'],
      hooks: {
        'tailwindcss:resolvedConfig' (config) {
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

describe('tailwindcss config', () => {
  it.each([
    /* format:
     name,
     tailwindcss config, safelistColors,
     expected safelistPatterns (add "!" before a pattern to negate it)
    */
    [
      'default safelist',
      {}, [],
      ['bg-(primary)-50', 'bg-(red)-500'] // these both should be in the safelist
    ],
    [
      'safelisting single new color',
      {}, ['myColor'],
      'bg-(myColor|primary)-50'
    ],
    [
      'reducing amount of theme colors',
      { theme: { colors: { plainBlue: '#00F' } } }, ['plainBlue'],
      ['bg-(plainBlue|primary)-50', '!', /orange/] // the word "orange" should _not_ be found in any safelist pattern
    ]
  ])('%s', async (_description, tailwindcss, safelistColors, safelistPatterns) => {
    const { tailwindConfig } = await getTailwindCSSConfig({
      ui: {
        safelistColors
      },
      tailwindcss: {
        config: tailwindcss
      }
    })
    expect.extend({
      toBeRegExp: (received, expected) => {
        if (typeof expected === 'string' || expected instanceof String) {
          return {
            message: () => `expected ${received} to be exact regex ${expected}`,
            pass: received.toString() === RegExp(expected as string).toString()
          }
        } else if (expected instanceof RegExp) {
          return {
            message: () => `expected ${received} to be a regex like ${expected.toString()}`,
            pass: received.toString().match(expected)
          }
        }
        return {
          message: () => `expected ${received} to be a regex`,
          pass: false
        }
      }
    })
    safelistPatterns = safelistPatterns instanceof Array ? safelistPatterns : [safelistPatterns]

    let negate = false
    for (const safelistPattern of safelistPatterns) {
      if (safelistPattern === '!') {
        // negate next!
        negate = true
        continue
      }
      if (negate) {
        expect(tailwindConfig.safelist).not.toContainEqual({
          pattern: expect.toBeRegExp(safelistPattern)
        })
      } else {
        expect(tailwindConfig.safelist).toContainEqual({
          pattern: expect.toBeRegExp(safelistPattern)
        })
      }
      negate = false
    }
  })
})
