import { fileURLToPath } from 'node:url'

import { normalize } from 'pathe'
import type { UnpluginOptions } from 'unplugin'
import { createUnplugin } from 'unplugin'
import type { Options as AutoImportOptions } from 'unplugin-auto-import/types'
import type { Options as ComponentsOptions } from 'unplugin-vue-components/types'
import { defu } from 'defu'
import tailwind from '@tailwindcss/vite'
import type colors from 'tailwindcss/colors'
import type { RuntimeOptions } from '@nuxt/icon'

import type * as ui from '#build/ui'

import { defaultOptions, getDefaultConfig, resolveColors } from './utils/defaults'
import type { ModuleOptions } from './module'
import type icons from './theme/icons'

import TemplatePlugin from './plugins/templates'
import PluginsPlugin from './plugins/plugins'
import AppConfigPlugin from './plugins/app-config'
import ComponentImportPlugin from './plugins/components'
import NuxtEnvironmentPlugin from './plugins/nuxt-environment'
import AutoImportPlugin from './plugins/auto-import'
import IconsPlugin from './plugins/icons'

import type { TVConfig } from './runtime/types/tv'

type NeutralColor = 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone' | 'taupe' | 'mauve' | 'mist' | 'olive'
type Color = Exclude<keyof typeof colors, 'inherit' | 'current' | 'transparent' | 'black' | 'white' | NeutralColor> | (string & {})

type AppConfigUI = {
  // TODO: add type hinting for colors from `options.theme.colors`
  colors?: Record<string, Color> & { neutral?: NeutralColor }
  icons?: Partial<typeof icons>
  prefix?: string
} & TVConfig<typeof ui>

export interface NuxtUIOptions extends Omit<ModuleOptions, 'fonts' | 'colorMode' | 'content' | 'experimental'> {
  /** Whether to generate declaration files for auto-imported components. */
  dts?: boolean
  ui?: AppConfigUI
  /**
   * Default props for the `Icon` component, and build-time icon bundling.
   */
  icon?: Pick<RuntimeOptions, 'customize' | 'size' | 'mode'> & {
    /**
     * Embed the icons Nuxt UI uses into the build so they render during SSR and fully
     * offline, instead of being fetched from the Iconify API at runtime. Enabled by
     * default for Nuxt UI's own icons (when their collection is installed); set to
     * `false` to opt out.
     * @see https://ui.nuxt.com/docs/getting-started/integrations/ssr#icons-display
     */
    clientBundle?: false | {
      /**
       * Extra icons to bundle, on top of Nuxt UI's defaults. Accepts `i-{collection}-{name}`
       * or `{collection}:{name}` (use the colon form for multi-word collections, e.g.
       * `material-symbols:menu`). Only bundled when the collection's data is installed.
       */
      icons?: string[]
      /**
       * Scan your source for icon usages and bundle the ones from installed collections, so
       * icons you use in your own components render offline too. Mirrors `@nuxt/icon`'s
       * `clientBundle.scan`.
       * @defaultValue `false`
       */
      scan?: boolean | {
        /** @defaultValue `['**\/*.{vue,jsx,tsx,md,mdc,mdx,yml,yaml}']` */
        globInclude?: string[]
        /** @defaultValue `['node_modules', 'dist', 'build', 'coverage', 'test', 'tests', '.*']` */
        globExclude?: string[]
      }
    }
  }
  /**
   * Enable or disable `@vueuse/core` color-mode integration
   * @defaultValue `true`
   * @see https://ui.nuxt.com/docs/getting-started/installation/vue#colormode
   */
  colorMode?: boolean
  /**
   * Override options for `unplugin-auto-import`, or `false` to disable composable auto-imports
   * @see https://ui.nuxt.com/docs/getting-started/installation/vue#autoimport
   */
  autoImport?: false | Partial<AutoImportOptions>
  /**
   * Override options for `unplugin-vue-components`, or `false` to disable component auto-imports
   * @see https://ui.nuxt.com/docs/getting-started/installation/vue#components
   */
  components?: false | Partial<ComponentsOptions>
  /**
   * Router integration mode
   * - `true` (default): Use vue-router integration
   * - `false`: Disable routing, use anchor tags
   * - `'inertia'`: Use Inertia.js compatibility layer
   * @defaultValue `true`
   * @see https://ui.nuxt.com/docs/getting-started/installation/vue#router
   */
  router?: boolean | 'inertia'
  /**
   * Enables compatibility layer for InertiaJS
   * @deprecated Use `router: 'inertia'` instead
   */
  inertia?: boolean
  /**
   * Additional packages to scan for components using Nuxt UI
   * @see https://ui.nuxt.com/docs/getting-started/installation/vue#scanpackages
   */
  scanPackages?: string[]
  /**
   * Root directory where the `.nuxt-ui` directory (generated theme templates) is created.
   * Useful for setups like `electron-vite` where `config.root` points to a sub-directory
   * (e.g. `src/renderer`) that Tailwind doesn't scan.
   * @defaultValue `config.root`
   * @see https://ui.nuxt.com/docs/getting-started/installation/vue#root
   */
  root?: string
}

export const runtimeDir = normalize(fileURLToPath(new URL('./runtime', import.meta.url)))

export const NuxtUIPlugin = createUnplugin<NuxtUIOptions | undefined>((_options = {}, meta) => {
  const options = defu(_options, { fonts: false }, defaultOptions)

  options.theme = options.theme || {}
  options.theme.colors = resolveColors(options.theme.colors)

  // `clientBundle` is a build-time concern, so keep it out of the runtime app config.
  const { clientBundle, ...icon } = options.icon || {}
  const appConfig = defu({ ui: options.ui, colorMode: options.colorMode, icon }, { ui: getDefaultConfig(options.theme) })

  return [
    NuxtEnvironmentPlugin(options),
    ComponentImportPlugin(options, meta),
    AutoImportPlugin(options, meta),
    tailwind(),
    IconsPlugin(options, appConfig),
    PluginsPlugin(options),
    TemplatePlugin(options, appConfig),
    AppConfigPlugin(options, appConfig),
    <UnpluginOptions>{
      name: 'nuxt:ui:plugins-duplication-detection',
      vite: {
        configResolved(config) {
          const plugins = config.plugins || []

          if (options.autoImport !== false && plugins.filter(i => i.name === 'unplugin-auto-import').length > 1) {
            throw new Error('[Nuxt UI] Multiple instances of `unplugin-auto-import` detected. Nuxt UI includes `unplugin-auto-import` already, and you can configure it using `autoImport` option in Nuxt UI module options.')
          }
          if (options.components !== false && plugins.filter(i => i.name === 'unplugin-vue-components').length > 1) {
            throw new Error('[Nuxt UI] Multiple instances of `unplugin-vue-components` detected. Nuxt UI includes `unplugin-vue-components` already, and you can configure it using `components` option in Nuxt UI module options.')
          }
        }
      }
    }
  ].flat(1) as UnpluginOptions[]
})
