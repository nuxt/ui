import { describe, expect, it } from 'vitest'
import module from '../src/module'
import { loadNuxt } from '@nuxt/kit'
import { join } from 'path'
import { getIconCollections, iconsPlugin } from '@egoist/tailwindcss-icons'

// TODO: fix these anys
async function getTailwindCSSConfig (overrides: any = {}): Promise<[any, any]> {
  overrides.modules = [ module ]
  overrides.ssr = overrides.ssr ?? false
  overrides.hooks = overrides.hooks ?? {}
  return new Promise((resolve, reject) => {
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
    const [_config, lnuxt] = await getTailwindCSSConfig()
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
    })
  })
})

describe.only('tailwind', () => {
  it.each([
    [ ['myColor'], '', /bg-(myColor|primary)-50/ ]
  ])('smart safelist %s should %s generate safelist %s', async (safelistColors, not, safelistPattern) => {
    const [config, _nuxt] = await getTailwindCSSConfig({
      ui: {
        safelistColors
      }
    })
    expect(config.safelist).toContainEqual({
      pattern: safelistPattern
    })
  })
})
