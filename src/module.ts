import { defineNuxtModule, installModule, addComponentsDir, addImportsDir, createResolver, addPlugin } from '@nuxt/kit'
import defaultColors from 'tailwindcss/colors.js'
import { defaultExtractor as createDefaultExtractor } from 'tailwindcss/lib/lib/defaultExtractor.js'
import { iconsPlugin, getIconCollections, type CollectionNames, type IconsPluginOptions } from '@egoist/tailwindcss-icons'
import { name, version } from '../package.json'
import { generateSafelist, excludeColors, customSafelistExtractor } from './colors'
import createTemplates from './templates'
import * as config from './runtime/ui.config'
import type { DeepPartial, Strategy } from './runtime/types/utils'

const defaultExtractor = createDefaultExtractor({ tailwindConfig: { separator: ':' } })

// @ts-ignore
delete defaultColors.lightBlue
// @ts-ignore
delete defaultColors.warmGray
// @ts-ignore
delete defaultColors.trueGray
// @ts-ignore
delete defaultColors.coolGray
// @ts-ignore
delete defaultColors.blueGray

type UI = {
  primary?: string
  gray?: string
  colors?: string[]
  strategy?: Strategy
  [key: string]: any
} & DeepPartial<typeof config>
declare module '@nuxt/schema' {
  interface AppConfigInput {
    ui?: UI
  }
}

export interface ModuleOptions {
  /**
   * @default 'u'
   */
  prefix?: string

  /**
   * @default false
   */
  global?: boolean

  icons: CollectionNames[] | 'all' | IconsPluginOptions

  safelistColors?: string[]
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: 'ui',
    compatibility: {
      nuxt: '^3.0.0-rc.8'
    }
  },
  defaults: {
    prefix: 'U',
    icons: ['heroicons'],
    safelistColors: ['primary']
  },
  async setup (options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // Transpile runtime
    const runtimeDir = resolve('./runtime')
    nuxt.options.build.transpile.push(runtimeDir)
    nuxt.options.build.transpile.push('@popperjs/core', '@headlessui/vue')

    nuxt.options.alias['#ui'] = runtimeDir

    nuxt.options.css.push(resolve(runtimeDir, 'ui.css'))

    // @ts-ignore
    nuxt.hook('tailwindcss:config', function (tailwindConfig) {
      tailwindConfig.theme = tailwindConfig.theme || {}
      tailwindConfig.theme.extend = tailwindConfig.theme.extend || {}
      tailwindConfig.theme.extend.colors = tailwindConfig.theme.extend.colors || {}

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
        globalColors.cool = tailwindConfig.theme.extend.colors.cool = defaultColors.gray
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
      tailwindConfig.safelist.push(...generateSafelist(options.safelistColors || [], colors))

      tailwindConfig.plugins = tailwindConfig.plugins || []
      tailwindConfig.plugins.push(iconsPlugin(Array.isArray(options.icons) || options.icons === 'all' ? { collections: getIconCollections(options.icons) } : typeof options.icons === 'object' ? options.icons as IconsPluginOptions : {}))
    })

    createTemplates(nuxt)

    // Modules

    await installModule('nuxt-icon')
    await installModule('@nuxtjs/color-mode', { classSuffix: '' })
    await installModule('@nuxtjs/tailwindcss', {
      exposeConfig: true,
      config: {
        darkMode: 'class',
        plugins: [
          require('@tailwindcss/forms')({ strategy: 'class' }),
          require('@tailwindcss/aspect-ratio'),
          require('@tailwindcss/typography'),
          require('@tailwindcss/container-queries'),
          require('@headlessui/tailwindcss')
        ],
        content: {
          files: [
            resolve(runtimeDir, 'components/**/*.{vue,mjs,ts}'),
            resolve(runtimeDir, 'ui.config/**/*.{mjs,js,ts}')
          ],
          transform: {
            vue: (content) => {
              return content.replaceAll(/(?:\r\n|\r|\n)/g, ' ')
            }
          },
          extract: {
            vue: (content) => {
              return [
                ...defaultExtractor(content),
                // @ts-ignore
                ...customSafelistExtractor(options.prefix, content, nuxt.options.appConfig.ui.colors, options.safelistColors)
              ]
            }
          }
        }
      }
    })

    // Plugins

    addPlugin({
      src: resolve(runtimeDir, 'plugins', 'colors')
    })

    // Components

    addComponentsDir({
      path: resolve(runtimeDir, 'components', 'elements'),
      prefix: options.prefix,
      global: options.global,
      watch: false
    })
    addComponentsDir({
      path: resolve(runtimeDir, 'components', 'forms'),
      prefix: options.prefix,
      global: options.global,
      watch: false
    })
    addComponentsDir({
      path: resolve(runtimeDir, 'components', 'data'),
      prefix: options.prefix,
      global: options.global,
      watch: false
    })
    addComponentsDir({
      path: resolve(runtimeDir, 'components', 'layout'),
      prefix: options.prefix,
      global: options.global,
      watch: false
    })
    addComponentsDir({
      path: resolve(runtimeDir, 'components', 'navigation'),
      prefix: options.prefix,
      global: options.global,
      watch: false
    })
    addComponentsDir({
      path: resolve(runtimeDir, 'components', 'overlays'),
      prefix: options.prefix,
      global: options.global,
      watch: false
    })

    // Composables

    addImportsDir(resolve(runtimeDir, 'composables'))
  }
})
