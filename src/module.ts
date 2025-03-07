import { defu } from 'defu'
import { createResolver, defineNuxtModule, addComponentsDir, addImportsDir, addVitePlugin, addPlugin, installModule, hasNuxtModule } from '@nuxt/kit'
import { addTemplates } from './templates'
import { defaultOptions, getDefaultUiConfig, resolveColors } from './defaults'

export type * from './runtime/types'

export interface ModuleOptions {
  /**
   * Prefix for components
   * @defaultValue `U`
   * @link https://ui3.nuxt.dev/getting-started/installation/nuxt#prefix
   */
  prefix?: string

  /**
   * Enable or disable `@nuxt/fonts` module
   * @defaultValue `true`
   * @link https://ui3.nuxt.dev/getting-started/installation/nuxt#fonts
   */
  fonts?: boolean

  /**
   * Enable or disable `@nuxtjs/color-mode` module
   * @defaultValue `true`
   * @link https://ui3.nuxt.dev/getting-started/installation/nuxt#colormode
   */
  colorMode?: boolean

  /**
   * Customize how the theme is generated
   * @link https://ui3.nuxt.dev/getting-started/theme
   */
  theme?: {
    /**
     * Define the color aliases available for components
     * @defaultValue `['primary', 'secondary', 'success', 'info', 'warning', 'error']`
     * @link https://ui3.nuxt.dev/getting-started/installation/nuxt#themecolors
     */
    colors?: string[]

    /**
     * Enable or disable transitions on components
     * @defaultValue `true`
     * @link https://ui3.nuxt.dev/getting-started/installation/nuxt#themetransitions
     */
    transitions?: boolean
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'ui',
    configKey: 'ui',
    compatibility: {
      nuxt: '>=3.13.1'
    },
    docs: 'https://ui3.nuxt.dev/getting-started/installation/nuxt'
  },
  defaults: defaultOptions,
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    options.theme = options.theme || {}
    options.theme.colors = resolveColors(options.theme.colors)

    nuxt.options.ui = options

    nuxt.options.alias['#ui'] = resolve('./runtime')

    nuxt.options.appConfig.ui = defu(nuxt.options.appConfig.ui || {}, getDefaultUiConfig(options.theme.colors))

    // Isolate root node from portaled components
    nuxt.options.app.rootAttrs = nuxt.options.app.rootAttrs || {}
    nuxt.options.app.rootAttrs.class = [nuxt.options.app.rootAttrs.class, 'isolate'].filter(Boolean).join(' ')

    if (nuxt.options.builder === '@nuxt/vite-builder') {
      const plugin = await import('@tailwindcss/vite').then(r => r.default)
      addVitePlugin(plugin())
    } else {
      nuxt.options.postcss.plugins['@tailwindcss/postcss'] = {}
    }

    async function registerModule(name: string, key: string, options: Record<string, any>) {
      if (!hasNuxtModule(name)) {
        await installModule(name, options)
      } else {
        (nuxt.options as any)[key] = defu((nuxt.options as any)[key], options)
      }
    }

    await registerModule('@nuxt/icon', 'icon', { cssLayer: 'components' })
    if (options.fonts) {
      await registerModule('@nuxt/fonts', 'fonts', { experimental: { processCSSVariables: true } })
    }
    if (options.colorMode) {
      await registerModule('@nuxtjs/color-mode', 'colorMode', { classSuffix: '', disableTransition: true })
    }

    addPlugin({ src: resolve('./runtime/plugins/colors') })

    addComponentsDir({
      path: resolve('./runtime/components'),
      prefix: options.prefix,
      pathPrefix: false
    })

    addImportsDir(resolve('./runtime/composables'))

    addTemplates(options, nuxt, resolve)
  }
})
