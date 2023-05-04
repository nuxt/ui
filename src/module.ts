import { defineNuxtModule, installModule, addComponentsDir, addImportsDir, createResolver, addPlugin } from '@nuxt/kit'
import colors from 'tailwindcss/colors.js'
import { iconsPlugin, getIconCollections } from '@egoist/tailwindcss-icons'
import { defu } from 'defu'
import { name, version } from '../package.json'
import { colorsAsRegex, excludeColors } from './runtime/utils/colors'
import { ui as preset } from './preset'
import type { DeepPartial } from './runtime/types'

// @ts-ignore
delete colors.lightBlue
// @ts-ignore
delete colors.warmGray
// @ts-ignore
delete colors.trueGray
// @ts-ignore
delete colors.coolGray
// @ts-ignore
delete colors.blueGray

declare module 'nuxt/schema' {
  interface AppConfigInput {
    ui?: {
      primary?: string
      gray?: string
      colors?: string[]
    } & DeepPartial<typeof preset>
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

  icons: string[]
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
    prefix: 'u',
    icons: ['heroicons']
  },
  async setup (options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // Transpile runtime
    const runtimeDir = resolve('./runtime')
    nuxt.options.build.transpile.push(runtimeDir)
    nuxt.options.build.transpile.push('@popperjs/core', '@headlessui/vue')

    nuxt.options.css.push(resolve(runtimeDir, 'ui.css'))

    nuxt.options.appConfig.ui = defu(nuxt.options.appConfig.ui, preset)

    // @ts-ignore
    nuxt.hook('tailwindcss:config', function (tailwindConfig: TailwindConfig) {
      const globalColors = {
        ...(tailwindConfig.theme.colors || colors),
        ...tailwindConfig.theme.extend?.colors
      }

      tailwindConfig.theme.extend.colors = tailwindConfig.theme.extend.colors || {}
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
        950: 'rgb(var(--color-primary-950) / <alpha-value>)'
      }

      if (globalColors.gray) {
        globalColors.cool = tailwindConfig.theme.extend.colors.cool = colors.gray
      }

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

      const variantColors = excludeColors(globalColors)
      const safeColorsAsRegex = colorsAsRegex(variantColors)

      nuxt.options.appConfig.ui = {
        ...nuxt.options.appConfig.ui,
        primary: 'sky',
        gray: 'cool',
        colors: variantColors
      }

      tailwindConfig.safelist = tailwindConfig.safelist || []
      tailwindConfig.safelist.push(...[{
        pattern: new RegExp(`bg-(${safeColorsAsRegex})-(50|400|500)`)
      }, {
        pattern: new RegExp(`bg-(${safeColorsAsRegex})-500`),
        variants: ['disabled']
      }, {
        pattern: new RegExp(`bg-(${safeColorsAsRegex})-(400|950)`),
        variants: ['dark']
      }, {
        pattern: new RegExp(`bg-(${safeColorsAsRegex})-(500|900|950)`),
        variants: ['dark:hover']
      }, {
        pattern: new RegExp(`bg-(${safeColorsAsRegex})-400`),
        variants: ['dark:disabled']
      }, {
        pattern: new RegExp(`bg-(${safeColorsAsRegex})-(50|100|600)`),
        variants: ['hover']
      }, {
        pattern: new RegExp(`outline-(${safeColorsAsRegex})-500`),
        variants: ['focus-visible']
      }, {
        pattern: new RegExp(`outline-(${safeColorsAsRegex})-400`),
        variants: ['dark:focus-visible']
      }, {
        pattern: new RegExp(`ring-(${safeColorsAsRegex})-500`),
        variants: ['focus-visible']
      }, {
        pattern: new RegExp(`ring-(${safeColorsAsRegex})-400`),
        variants: ['dark', 'dark:focus-visible']
      }, {
        pattern: new RegExp(`text-(${safeColorsAsRegex})-400`),
        variants: ['dark']
      }, {
        pattern: new RegExp(`text-(${safeColorsAsRegex})-600`),
        variants: ['hover']
      }, {
        pattern: new RegExp(`text-(${safeColorsAsRegex})-500`),
        variants: ['dark:hover']
      }])

      tailwindConfig.plugins = tailwindConfig.plugins || []
      tailwindConfig.plugins.push(iconsPlugin({ collections: getIconCollections(options.icons as any[]) }))
    })

    await installModule('@nuxtjs/color-mode', { classSuffix: '' })
    await installModule('@nuxtjs/tailwindcss', {
      viewer: false,
      exposeConfig: true,
      config: {
        darkMode: 'class',
        plugins: [
          require('@tailwindcss/forms'),
          require('@tailwindcss/aspect-ratio'),
          require('@tailwindcss/typography')
        ],
        content: [
          resolve(runtimeDir, 'components/**/*.{vue,js,ts}'),
          resolve(runtimeDir, '*.{mjs,js,ts}')
        ]
      }
    })

    addPlugin({
      src: resolve(runtimeDir, 'plugins', 'colors')
    })

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

    addImportsDir(resolve(runtimeDir, 'composables'))
  }
})
