import { defineNuxtModule, installModule, addComponentsDir, addImportsDir, createResolver, addPlugin, resolvePath, addTemplate } from '@nuxt/kit'
import defaultColors from 'tailwindcss/colors.js'
import { defaultExtractor as createDefaultExtractor } from 'tailwindcss/lib/lib/defaultExtractor.js'
import { iconsPlugin, getIconCollections } from '@egoist/tailwindcss-icons'
import { name, version } from '../package.json'
import { generateSafelist, excludeColors, customSafelistExtractor } from './colors'
import appConfig from './runtime/app.config.template'
import Prefixer from "./runtime/utils/Prefixer";

type DeepPartial<T> = Partial<{ [P in keyof T]: DeepPartial<T[P]> | { [key: string]: string } }>

const defaultExtractor = createDefaultExtractor({ tailwindConfig: { separator: ':' } })

delete defaultColors.lightBlue
delete defaultColors.warmGray
delete defaultColors.trueGray
delete defaultColors.coolGray
delete defaultColors.blueGray

declare module 'nuxt/schema' {
  interface AppConfigInput {
    ui?: {
      primary?: string
      gray?: string
      colors?: string[]
    } & DeepPartial<typeof appConfig.ui>
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

  icons: string[] | string

  safelistColors?: string[]

  tailwindPrefix?: string
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



    const appConfigFile = await resolvePath(resolve(runtimeDir, 'app.config.template'))
    let finalAppConfigFile: string|undefined

    nuxt.hook('app:resolve', (app) => {
      app.configs.push(finalAppConfigFile || appConfigFile)
    })

    nuxt.hook('tailwindcss:config', async function (tailwindConfig) {
      // Use app config and apply prefixes to classes to create new
      const appConfigContents = await import(appConfigFile)
      const prefixer = new Prefixer(tailwindConfig.prefix)
      const newConfig = prefixer.applyToConfig(appConfigContents)
      const resolvedTemplate = addTemplate({
        filename: 'app.config.ts',
        write: true,
        getContents: () => `export default ${JSON.stringify(newConfig, undefined, 2)}`
      })
      finalAppConfigFile = resolvedTemplate.dst

      const uiCssTemplate = addTemplate({
        filename: 'ui.css',
        write: true,
        getContents: () => `.dark {
  color-scheme: dark;
}

a:focus-visible {
  @apply ${tailwindConfig.prefix}outline-primary-500 dark:${tailwindConfig.prefix}outline-primary-400;
}

select {
  background-image: none;
}

/* for CommandPaletteGroup - is there a better way to apply this as a style within component with prefix? It wasn't scoped in the component or anything */
mark {
  @apply ${tailwindConfig.prefix}bg-primary-400;
}
`
      })
      nuxt.options.css.push(uiCssTemplate.dst)

      const globalColors: any = {
        ...(tailwindConfig.theme.colors || defaultColors),
        ...tailwindConfig.theme.extend?.colors
      }

      tailwindConfig.theme.extend.colors = tailwindConfig.theme.extend.colors || {}
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
        950: 'rgb(var(--color-primary-950) / <alpha-value>)'
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

      nuxt.options.appConfig.ui = {
        ...nuxt.options.appConfig.ui,
        primary: 'green',
        gray: 'cool',
        colors
      }

      tailwindConfig.safelist = tailwindConfig.safelist || []
      tailwindConfig.safelist.push(...generateSafelist(options.safelistColors))

      tailwindConfig.plugins = tailwindConfig.plugins || []
      tailwindConfig.plugins.push(iconsPlugin({ collections: getIconCollections(options.icons as any[]) }))

      tailwindConfig.content.files.push(resolvedTemplate.dst, uiCssTemplate.dst)
    })

    // Modules

    await installModule('@nuxtjs/color-mode', { classSuffix: '' })
    await installModule('@nuxtjs/tailwindcss', {
      exposeConfig: true,
      config: {
        darkMode: 'class',
        plugins: [
          require("@tailwindcss/forms")({ strategy: 'class' }),
          require('@tailwindcss/aspect-ratio'),
          require('@tailwindcss/typography'),
          require('@tailwindcss/container-queries')
        ],
        content: {
          files: [
            resolve(runtimeDir, 'components/**/*.{vue,mjs,ts}'),
            resolve(runtimeDir, '*.{mjs,js,ts}')
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
                ...customSafelistExtractor(options.prefix, content, nuxt.options.appConfig.ui.colors)
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
