import { defineNuxtModule, installModule, addComponentsDir, addImportsDir, addTemplate, createResolver } from '@nuxt/kit'
import colors from 'tailwindcss/colors.js'
import type { Config } from 'tailwindcss'
import { iconsPlugin, getIconCollections } from '@egoist/tailwindcss-icons'
import { name, version } from '../package.json'
import { colorsAsRegex, excludeColors } from './runtime/utils/colors'
import defaultPreset, { DefaultPreset } from './runtime/presets/default'

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
    ui?: Partial<DefaultPreset>
  }
}

interface ColorsOptions {
  /**
   * @default 'indigo'
   */
  primary?: string

  /**
   * @default 'gray'
   */
  gray?: string
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

  colors?: ColorsOptions

  icons: string[]

  tailwindcss?: Partial<Config>
}

const defaults = {
  prefix: 'u',
  colors: {
    primary: 'indigo',
    gray: 'gray'
  },
  icons: ['heroicons'],
  tailwindcss: {
    theme: {}
  }
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
  defaults,
  async setup (options, nuxt) {
    const { prefix, colors: { primary = 'indigo', gray = 'gray' } = {}, tailwindcss: { theme = {} } = {}, global } = options

    const { resolve } = createResolver(import.meta.url)

    // Transpile runtime
    const runtimeDir = resolve('./runtime')
    nuxt.options.build.transpile.push(runtimeDir)
    nuxt.options.build.transpile.push('@popperjs/core', '@headlessui/vue')

    // @ts-ignore
    nuxt.hook('tailwindcss:config', function (tailwindConfig: TailwindConfig) {
      const globalColors = {
        ...(tailwindConfig.theme.colors || colors),
        ...tailwindConfig.theme.extend?.colors
      }

      // @ts-ignore
      tailwindConfig.theme.extend.colors = tailwindConfig.theme.extend.colors || {}
      // @ts-ignore
      globalColors.primary = tailwindConfig.theme.extend.colors.primary = globalColors[primary] || colors[primary]
      // @ts-ignore
      globalColors.gray = tailwindConfig.theme.extend.colors.gray = globalColors[gray] || colors[gray]

      const variantColors = excludeColors(globalColors)
      const safeColorsAsRegex = colorsAsRegex(variantColors)

      tailwindConfig.safelist = tailwindConfig.safelist || []
      tailwindConfig.safelist.push(...[{
        pattern: new RegExp(`bg-(${safeColorsAsRegex})-(100|400)`)
      }, {
        pattern: new RegExp(`bg-(${safeColorsAsRegex})-700`),
        variants: ['dark']
      }, {
        pattern: new RegExp(`bg-(${safeColorsAsRegex})-600`),
        variants: ['disabled']
      }, {
        pattern: new RegExp(`bg-(${safeColorsAsRegex})-500`),
        variants: ['dark', 'hover', 'dark:disabled']
      }, {
        pattern: new RegExp(`bg-(${safeColorsAsRegex})-400`),
        variants: ['dark:hover']
      }, {
        pattern: new RegExp(`outline-(${safeColorsAsRegex})-600`),
        variants: ['focus-visible']
      }, {
        pattern: new RegExp(`outline-(${safeColorsAsRegex})-500`),
        variants: ['dark:focus-visible']
      }, {
        pattern: new RegExp(`text-(${safeColorsAsRegex})-800`)
      }, {
        pattern: new RegExp(`text-(${safeColorsAsRegex})-100`),
        variants: ['dark']
      }])

      tailwindConfig.plugins = tailwindConfig.plugins || []
      tailwindConfig.plugins.push(iconsPlugin({ collections: getIconCollections(options.icons as any[]) }))

      const ui: object = defaultPreset(variantColors)

      nuxt.options.appConfig.ui = ui

      addTemplate({
        filename: 'ui.mjs',
        getContents: () => `export default ${JSON.stringify(ui)}`
      })
      addTemplate({
        filename: 'ui.d.ts',
        write: true,
        getContents: () => `declare const d: ${JSON.stringify(ui)}; export default d;`
      })
    })

    await installModule('@nuxtjs/color-mode', { classSuffix: '' })
    await installModule('@nuxtjs/tailwindcss', {
      viewer: false,
      config: {
        darkMode: 'class',
        theme,
        plugins: [
          require('@tailwindcss/forms'),
          require('@tailwindcss/aspect-ratio'),
          require('@tailwindcss/typography')
        ],
        content: [
          resolve(runtimeDir, 'components/**/*.{vue,js,ts}'),
          resolve(runtimeDir, 'presets/*.{mjs,js,ts}')
        ],
        safelist: [
          'dark',
          {
            pattern: /rounded-(sm|md|lg|xl|2xl|3xl)/,
            variants: ['sm']
          }
        ]
      },
      cssPath: resolve(runtimeDir, 'tailwind.css')
    })

    addComponentsDir({
      path: resolve(runtimeDir, 'components', 'elements'),
      prefix,
      global,
      watch: false
    })
    addComponentsDir({
      path: resolve(runtimeDir, 'components', 'feedback'),
      prefix,
      global,
      watch: false
    })
    addComponentsDir({
      path: resolve(runtimeDir, 'components', 'forms'),
      prefix,
      global,
      watch: false
    })
    addComponentsDir({
      path: resolve(runtimeDir, 'components', 'layout'),
      prefix,
      global,
      watch: false
    })
    addComponentsDir({
      path: resolve(runtimeDir, 'components', 'navigation'),
      prefix,
      global,
      watch: false
    })
    addComponentsDir({
      path: resolve(runtimeDir, 'components', 'overlays'),
      prefix,
      global,
      watch: false
    })

    addImportsDir(resolve(runtimeDir, 'composables'))
  }
})
