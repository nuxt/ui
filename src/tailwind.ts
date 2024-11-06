import { join } from 'pathe'
import { defu } from 'defu'
import { addTemplate, createResolver, installModule, useNuxt } from '@nuxt/kit'
import { setGlobalColors } from './runtime/utils/colors'
import type { ModuleOptions } from './module'

export default function installTailwind(
  moduleOptions: ModuleOptions,
  nuxt = useNuxt(),
  resolve = createResolver(import.meta.url).resolve
): Promise<void> {
  const runtimeDir = resolve('./runtime')

  // 1. register hook
  nuxt.hook('tailwindcss:config', function (tailwindConfig) {
    tailwindConfig.theme = tailwindConfig.theme || {}
    tailwindConfig.theme.extend = tailwindConfig.theme.extend || {}
    tailwindConfig.theme.extend.colors = tailwindConfig.theme.extend.colors || {}

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

      const defaultExtractor = createDefaultExtractor({ tailwindConfig: { separator: ':' } })

      module.exports = {
        plugins: [
          require('@tailwindcss/forms')({ strategy: 'class' }),
          require('@tailwindcss/aspect-ratio'),
          require('@tailwindcss/typography'),
          require('@tailwindcss/container-queries'),
          require('@headlessui/tailwindcss')
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

  const { configPath: userTwConfigPath = [], ...twModuleConfig } = nuxt.options.tailwindcss ?? {}

  const twConfigPaths = [
    configTemplate.dst,
    join(nuxt.options.rootDir, 'tailwind.config')
  ]

  if (typeof userTwConfigPath === 'string') {
    twConfigPaths.push(userTwConfigPath)
  } else {
    twConfigPaths.push(...userTwConfigPath)
  }

  // 3. install module
  return installModule('@nuxtjs/tailwindcss', defu({
    exposeConfig: true,
    config: {
      darkMode: 'class' as const
    },
    configPath: twConfigPaths
  }, twModuleConfig))
}
