import { join } from 'pathe'
import { addTemplate, createResolver, installModule, useNuxt } from '@nuxt/kit'
import defaultColors from 'tailwindcss/colors.js'

import { excludeColors, generateSafelist } from './runtime/utils/colors'
import type { ModuleOptions } from './module'

export default async function installTailwind (
  moduleOptions: ModuleOptions,
  nuxt = useNuxt()
) {
  const { resolve } = createResolver(import.meta.url)
  const runtimeDir = resolve('./runtime')

  // 1. register hook
  // @ts-ignore
  nuxt.hook('tailwindcss:config', function (tailwindConfig) {
    tailwindConfig.theme = tailwindConfig.theme || {}
    tailwindConfig.theme.extend = tailwindConfig.theme.extend || {}
    tailwindConfig.theme.extend.colors =
      tailwindConfig.theme.extend.colors || {}

    const globalColors: any = {
      ...(tailwindConfig.theme.colors || defaultColors),
      ...tailwindConfig.theme.extend?.colors
    }

    // @ts-ignore
    globalColors.primary = tailwindConfig.theme.extend.colors.primary = {
      50: 'rgb(var(--color-primary-50) / <alpha-value>)',
      100: 'rgb(var(--color-primary-100) / <alpha-value>)',
      200: 'rgb(var(--color-primary-200) / <alpha-value>)',
      300: 'rgb(var(--color-primary-300) / <alpha-value>)',
      400: 'rgb(var(--color-primary-400) / <alpha-value>)',
      500: 'rgb(var(--color-primary-500) / <alpha-value>)',
      600: 'rgb(var(--color-primary-600) / <alpha-value>)',
      700: 'rgb(var(--color-primary-700) / <alpha-value>)',
      800: 'rgb(var(--color-primary-800) / <alpha-value>)',
      900: 'rgb(var(--color-primary-900) / <alpha-value>)',
      950: 'rgb(var(--color-primary-950) / <alpha-value>)',
      DEFAULT: 'rgb(var(--color-primary-DEFAULT) / <alpha-value>)'
    }

    if (globalColors.gray) {
      // @ts-ignore
      globalColors.cool = tailwindConfig.theme.extend.colors.cool =
        defaultColors.gray
    }

    // @ts-ignore
    globalColors.gray = tailwindConfig.theme.extend.colors.gray = {
      50: 'rgb(var(--color-gray-50) / <alpha-value>)',
      100: 'rgb(var(--color-gray-100) / <alpha-value>)',
      200: 'rgb(var(--color-gray-200) / <alpha-value>)',
      300: 'rgb(var(--color-gray-300) / <alpha-value>)',
      400: 'rgb(var(--color-gray-400) / <alpha-value>)',
      500: 'rgb(var(--color-gray-500) / <alpha-value>)',
      600: 'rgb(var(--color-gray-600) / <alpha-value>)',
      700: 'rgb(var(--color-gray-700) / <alpha-value>)',
      800: 'rgb(var(--color-gray-800) / <alpha-value>)',
      900: 'rgb(var(--color-gray-900) / <alpha-value>)',
      950: 'rgb(var(--color-gray-950) / <alpha-value>)'
    }

    const colors = excludeColors(globalColors)

    // @ts-ignore
    nuxt.options.appConfig.ui = {
      primary: 'green',
      gray: 'cool',
      colors,
      strategy: 'merge'
    }

    tailwindConfig.safelist = tailwindConfig.safelist || []
    tailwindConfig.safelist.push(
      ...generateSafelist(moduleOptions.safelistColors || [], colors)
    )
  })

  // 2. add config template
  const configTemplate = addTemplate({
    filename: 'nuxtui-tailwind.config.cjs',
    write: true,
    getContents: () => `
      const { defaultExtractor: createDefaultExtractor } = require('tailwindcss/lib/lib/defaultExtractor.js')
      const { customSafelistExtractor } = require(${JSON.stringify(resolve(runtimeDir, 'utils', 'colors'))})
      const { iconsPlugin, getIconCollections } = require('@egoist/tailwindcss-icons')

      const defaultExtractor = createDefaultExtractor({ tailwindConfig: { separator: ':' } })

      module.exports = {
        darkMode: 'class',
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
        }
      }
    `
  })

  // 3. install module
  await installModule('@nuxtjs/tailwindcss', {
    exposeConfig: true,
    configPath: [
      configTemplate.dst,
      join(nuxt.options.rootDir, 'tailwind.config')
    ]
  })
}
