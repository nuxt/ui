import { describe, expect, it } from 'vitest'
import module from '../src/module'
import { loadNuxt } from '@nuxt/kit'
import { join } from 'path'

async function getTailwindCSSConfig (): Promise<[any, any]> {
  return new Promise((resolve, reject) => {
    const nuxt = loadNuxt({
      cwd: join(process.cwd(), 'fixtures', 'empty'),
      dev: false,
      overrides:
      {
        ssr: false,
        modules: [ module ],
        hooks: {
          'tailwindcss:resolvedConfig': async (config) => {
            console.log('resolvedConfig in test')
            resolve([config, nuxt])
          }
        }
      }
    })
  })
}

describe('basic', () => {
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
    })
  })
})
