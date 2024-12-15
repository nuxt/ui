import { defu } from 'defu'
import { createResolver, defineNuxtModule, addComponentsDir, addImportsDir, addVitePlugin, addPlugin, installModule, extendPages, hasNuxtModule } from '@nuxt/kit'
import { addTemplates, buildTemplates } from './templates'
import { addCustomTab, startSubprocess } from '@nuxt/devtools-kit'
import sirv from 'sirv'
import { getPort } from 'get-port-please'
import { devtoolsMetaPlugin } from './devtools/meta'
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

  /**
   * Configuration for the Nuxt UI devtools.
   */
  devtools?: {
    /**
     * Enable or disable Nuxt UI devtools.
     * @defaultValue `true`
     */
    enabled?: boolean
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

    addTemplates(options, nuxt, resolve)

    if (nuxt.options.dev && nuxt.options.devtools.enabled && options.devtools?.enabled) {
      const templates = buildTemplates(options)
      nuxt.options.vite = defu(nuxt.options?.vite, { plugins: [devtoolsMetaPlugin({ resolve, templates, options })] })

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
            single: true,
            dev: true
          }))
        })
      }

      nuxt.options.routeRules = defu(nuxt.options.routeRules, { '/__nuxt_ui__/**': { ssr: false } })
      extendPages((pages) => {
        if (pages.length) {
          pages.unshift({
            name: 'ui-devtools',
            path: '/__nuxt_ui__/components/:slug',
            file: resolve('./devtools/runtime/DevtoolsRenderer.vue'),
            meta: {
              // https://github.com/nuxt/nuxt/pull/29366
              // isolate: true
              layout: false
            }
          })
        }
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
