import { join } from 'pathe'
import { defu } from 'defu'
import { addTemplate, createResolver, installModule, useNuxt } from '@nuxt/kit'

import { setGlobalColors } from './runtime/utils/colors'
import type { ModuleOptions } from './module'

export default async function installTailwind (
  moduleOptions: ModuleOptions,
  nuxt = useNuxt(),
  resolve = createResolver(import.meta.url).resolve
) {
  const runtimeDir = resolve('./runtime')

  // 1. register hook
  // @ts-ignore
  nuxt.hook('tailwindcss:config', function (tailwindConfig) {
    tailwindConfig.theme = tailwindConfig.theme || {}
    tailwindConfig.theme.extend = tailwindConfig.theme.extend || {}
    tailwindConfig.theme.extend.colors =
      tailwindConfig.theme.extend.colors || {}

    const colors = setGlobalColors(tailwindConfig.theme)

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
    filename: 'nuxtui-tailwind.config.cjs',
    write: true,
    getContents: ({ nuxt }) => `
      const { defaultExtractor: createDefaultExtractor } = require('tailwindcss/lib/lib/defaultExtractor.js')
      const { customSafelistExtractor, generateSafelist } = require(${JSON.stringify(resolve(runtimeDir, 'utils', 'colors'))})
      const { iconsPlugin, getIconCollections } = require('@egoist/tailwindcss-icons')

      const defaultExtractor = createDefaultExtractor({ tailwindConfig: { separator: ':' } })

      module.exports = {
        plugins: [
          require('@tailwindcss/forms')({ strategy: 'class' }),
          require('@tailwindcss/aspect-ratio'),
          require('@tailwindcss/typography'),
          require('@tailwindcss/container-queries'),
          require('@headlessui/tailwindcss'),
          iconsPlugin(${Array.isArray(moduleOptions.icons) || moduleOptions.icons === 'all' ? `{ collections: getIconCollections(${JSON.stringify(moduleOptions.icons)}) }` : typeof moduleOptions.icons === 'object' ? JSON.stringify(moduleOptions.icons) : {}})
        ],
        content: {
          files: [
            ${JSON.stringify(resolve(runtimeDir, 'components/**/*.{vue,mjs,ts}'))},
            ${JSON.stringify(resolve(runtimeDir, 'ui.config/**/*.{mjs,js,ts}'))}
          ],
          transform: {
            vue: (content) => {
              return content.replaceAll(/(?:\\r\\n|\\r|\\n)/g, ' ')
            }
          },
          extract: {
            vue: (content) => {
              return [
                ...defaultExtractor(content),
                ...customSafelistExtractor(${JSON.stringify(moduleOptions.prefix)}, content, ${JSON.stringify(nuxt.options.appConfig.ui.colors)}, ${JSON.stringify(moduleOptions.safelistColors)})
              ]
            }
          }
        },
        safelist: generateSafelist(${JSON.stringify(moduleOptions.safelistColors || [])}, ${JSON.stringify(nuxt.options.appConfig.ui.colors)}),
      }
    `
  })

  // 3. install module
  await installModule('@nuxtjs/tailwindcss', defu({
    exposeConfig: true,
    config: { darkMode: 'class' },
    configPath: [
      configTemplate.dst,
      join(nuxt.options.rootDir, 'tailwind.config')
    ]
  }, nuxt.options.tailwindcss))
}
