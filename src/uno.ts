import { join } from 'pathe'
import { addTemplate, createResolver, installModule, useNuxt } from '@nuxt/kit'

import { setGlobalColors } from './runtime/utils/colors'
import type { ModuleOptions } from './module'

export default async function installUnocss (
  moduleOptions: ModuleOptions,
  nuxt = useNuxt(),
  resolve = createResolver(import.meta.url).resolve
) {
  const runtimeDir = resolve('./runtime')

  // 1. register hook
  // @ts-ignore
  nuxt.hook('unocss:config', function (unoConfig) {
    unoConfig.theme = unoConfig.theme || {}
    unoConfig.theme.extend = unoConfig.theme.extend || {}
    unoConfig.theme.extend.colors =
      unoConfig.theme.extend.colors || {}

    const colors = setGlobalColors(unoConfig.theme)

    // @ts-ignore
    nuxt.options.appConfig.ui = {
      primary: 'green',
      gray: 'cool',
      colors,
      strategy: 'merge'
    }
  })

  // 2. add config template
  const configTemplate = addTemplate({
    filename: 'nuxtui-unocss.config.cjs',
    write: true,
    getContents: () => `
      const { defineConfig, presetWind, presetTypography, presetIcons } = require('unocss')
      const { presetForms } = require('@julr/unocss-preset-forms')
      const { presetHeadlessUi } = require('unocss-preset-primitives')

      const { defaultExtractor: createDefaultExtractor } = require('tailwindcss/lib/lib/defaultExtractor.js')
      const { customSafelistExtractor } = require(${JSON.stringify(resolve(runtimeDir, 'utils', 'colors'))})

      const defaultExtractor = createDefaultExtractor({ tailwindConfig: { separator: ':' } })

      module.exports = defineConfig({
        presets: [
          presetWind(),
          presetTypography(),
          presetForms(),
          presetHeadlessUi(),
          // presetIcons(),
        ],
        content: {
          filesystem: [
            ${JSON.stringify(resolve(runtimeDir, 'components/**/*.{vue,mjs,ts}'))},
            ${JSON.stringify(resolve(runtimeDir, 'ui.config/**/*.{mjs,js,ts}'))}
          ],
        },
        transformers: [
          {
            name: 'vue', enforce: 'pre',
            idFilter: (id) => id.match(/\\.vue$/),
            transform: (code, id, { uno }) => {
              code.replaceAll(/(?:\\r\\n|\\r|\\n)/g, ' ')
            },
          }
        ],
        extractors: [
          {
            name: 'vue', order: -1,
            extract: (ctx) => {
              if (!ctx.id || !ctx.id.endsWith('.vue'))
                return

              ctx.code = defaultExtractor(ctx.code).join(',')
              ctx.code = customSafelistExtractor(${JSON.stringify(moduleOptions.prefix)}, ctx.code, ${JSON.stringify(nuxt.options.appConfig.ui.colors)}, ${JSON.stringify(moduleOptions.safelistColors)}).join(',')
            }
          }
        ]
      })
    `
  })

  // 3. install module
  await installModule('@unocss/nuxt', {
    configFile: configTemplate.dst,
    configDeps: [join(nuxt.options.rootDir, 'uno.config')]
  })
}
