import { describe, expect, it } from 'vitest'
import module from '../src/module'
import { loadNuxt } from '@nuxt/kit'
import { join } from 'path'

// TODO: fix these anys
async function getTailwindCSSConfig (overrides: any = {}): Promise<[any, any]> {
  overrides.modules = [ module ]
  overrides.ssr = overrides.ssr ?? false
  overrides.hooks = overrides.hooks ?? {}
  return new Promise((resolve) => {
    overrides.hooks['tailwindcss:resolvedConfig'] = async (config) => {
        resolve([config, nuxt])
      }
    const nuxt = loadNuxt({
      cwd: join(process.cwd(), 'fixtures', 'empty'),
      dev: false,
      overrides
    })
  })
}

describe('nuxt', () => {
  it('should add plugins and modules to nuxt', async () => {
    const [, lnuxt] = await getTailwindCSSConfig()
    await lnuxt.then((nuxt) => {
      expect(nuxt.options.plugins).toContainEqual(
        expect.objectContaining({
          src: expect.stringContaining('plugins/colors'),
          mode: 'all'
        })
      )
      expect(nuxt.options._requiredModules).toContain({
        '@nuxtjs/color-mode': true,
        '@nuxtjs/tailwindcss': true
      })
      // default values in appConfig
      expect(nuxt.options.appConfig.ui).toContain({
        primary: 'green',
        gray: 'cool'
      })
      // TODO: this should be done inside getTailwindCSSConfig
      nuxt.close()
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
    const [config, _nuxt] = await getTailwindCSSConfig({
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
        expect(config.safelist).not.toContainEqual({
          pattern: expect.toBeRegExp(safelistPattern)
        })
      } else {
        expect(config.safelist).toContainEqual({
          pattern: expect.toBeRegExp(safelistPattern)
        })
      }
      negate = false
    }

    await _nuxt.then((n) => {
      n.close()
    })
  })
})
