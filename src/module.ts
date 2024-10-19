import { defu } from 'defu'
import { createResolver, defineNuxtModule, addComponentsDir, addImportsDir, addVitePlugin, addPlugin, installModule, extendPages, hasNuxtModule } from '@nuxt/kit'
import { addTemplates } from './templates'
import icons from './theme/icons'
import { addCustomTab, startSubprocess } from '@nuxt/devtools-kit'
import sirv from 'sirv'
import { setupDevtoolsClient } from './devtools/rpc'
import { getPort } from 'get-port-please'
import { pick } from './runtime/utils'
import { devtoolsMetaPlugin } from './devtools/meta'

export type * from './runtime/types'

export interface ModuleOptions {
  /**
   * Prefix for components
   * @defaultValue `U`
   * @see https://ui3.nuxt.dev/getting-started/installation#prefix
   */
  prefix?: string

  /**
   * Enable or disable `@nuxt/fonts` module
   * @defaultValue `true`
   * @see https://ui3.nuxt.dev/getting-started/installation#fonts
   */
  fonts?: boolean

  /**
   * Enable or disable `@nuxtjs/color-mode` module
   * @defaultValue `true`
   * @see https://ui3.nuxt.dev/getting-started/installation#colormode
   */
  colorMode?: boolean

  /**
   * Customize how the theme is generated
   * @see https://ui3.nuxt.dev/getting-started/theme
   */
  theme?: {
    /**
     * Define the color aliases available for components
     * @defaultValue `['primary', 'secondary', 'success', 'info', 'warning', 'error']`
     * @see https://ui3.nuxt.dev/getting-started/installation#themecolors
     */
    colors?: string[]

    /**
     * Enable or disable transitions on components
     * @defaultValue `true`
     * @see https://ui3.nuxt.dev/getting-started/installation#themetransitions
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
    docs: 'https://ui3.nuxt.dev/getting-started/installation'
  },
  defaults: {
    prefix: 'U',
    fonts: true,
    colorMode: true,
    theme: {
      colors: undefined,
      transitions: true
    }
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    options.theme = options.theme || {}
    options.theme.colors = options.theme.colors?.length ? [...new Set(['primary', ...options.theme.colors])] : ['primary', 'secondary', 'success', 'info', 'warning', 'error']

    nuxt.options.ui = options

    nuxt.options.alias['#ui'] = resolve('./runtime')

    nuxt.options.appConfig.ui = defu(nuxt.options.appConfig.ui || {}, {
      colors: pick({
        primary: 'green',
        secondary: 'blue',
        success: 'green',
        info: 'blue',
        warning: 'yellow',
        error: 'red',
        neutral: 'slate'
      }, [...(options.theme?.colors || []), 'neutral' as any]),
      icons
    })

    // Isolate root node from portaled components
    nuxt.options.app.rootAttrs = nuxt.options.app.rootAttrs || {}
    nuxt.options.app.rootAttrs.class = [nuxt.options.app.rootAttrs.class, 'isolate'].filter(Boolean).join(' ')

    if (nuxt.options.builder === '@nuxt/vite-builder') {
      const plugin = await import('@tailwindcss/vite').then(r => r.default)
      addVitePlugin(plugin())
    } else {
      nuxt.options.postcss.plugins['@tailwindcss/postcss'] = {}
    }

    async function registerModule(name: string, options: Record<string, any>) {
      if (!hasNuxtModule(name)) {
        await installModule(name, options)
      } else {
        (nuxt.options as any)[name] = defu((nuxt.options as any)[name], options)
      }
    }

    await registerModule('@nuxt/icon', { cssLayer: 'components' })
    if (options.fonts) {
      await registerModule('@nuxt/fonts', { experimental: { processCSSVariables: true } })
    }
    if (options.colorMode) {
      await registerModule('@nuxtjs/color-mode', { classSuffix: '', disableTransition: true })
    }

    addPlugin({ src: resolve('./runtime/plugins/colors') })
    addPlugin({ src: resolve('./runtime/plugins/modal') })
    addPlugin({ src: resolve('./runtime/plugins/slideover') })

    addComponentsDir({
      path: resolve('./runtime/components'),
      prefix: options.prefix,
      pathPrefix: false
    })

    addImportsDir(resolve('./runtime/composables'))

    addTemplates(options, nuxt)

    if (nuxt.options.dev && nuxt.options.devtools.enabled) {
      nuxt.options.vite = defu(nuxt.options?.vite, { plugins: [devtoolsMetaPlugin({ resolve })] })

      setupDevtoolsClient(options)

      // Runs UI devtools in a subprocess for local development
      if (process.env.NUXT_UI_DEVTOOLS_LOCAL) {
        const PORT = await getPort({ port: 42124 })
        nuxt.hook('app:resolve', () => {
          startSubprocess(
            {
              command: 'pnpm',
              args: ['nuxi', 'dev'],
              cwd: './devtools',
              stdio: 'pipe',
              env: {
                PORT: PORT.toString()
              }
            },
            {
              id: 'ui:devtools:local',
              name: 'Nuxt UI DevTools Local',
              icon: 'logos-nuxt-icon'
            },
            nuxt
          )
        })

        nuxt.hook('vite:extendConfig', (config) => {
          config.server ||= {}
          config.server.proxy ||= {}
          config.server.proxy['/__nuxt_ui__/devtools'] = {
            target: `http://localhost:${PORT}`,
            changeOrigin: true,
            followRedirects: true,
            ws: true,
            rewriteWsOrigin: true
          }
        })
      } else {
        nuxt.hook('vite:serverCreated', async (server) => {
          server.middlewares.use('/__nuxt_ui__/devtools', sirv(resolve('../dist/client/devtools'), {
            single: true
          }))
        })
      }

      extendPages((pages) => {
        pages.unshift({
          name: 'ui-devtools',
          path: '/__nuxt_ui__/components/:slug',
          file: resolve('./devtools/runtime/DevtoolsRenderer.vue')
          // https://github.com/nuxt/nuxt/pull/29366
          // meta: {
          //   isolate: true
          // }
        })
      })

      addCustomTab({
        name: 'nuxt-ui',
        title: 'Nuxt UI',
        icon: '/__nuxt_ui__/devtools/favicon.svg',
        view: {
          type: 'iframe',
          src: '/__nuxt_ui__/devtools'
        }
      })
    }
  }
})
