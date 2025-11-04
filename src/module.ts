import { defu } from 'defu'
import { createResolver, defineNuxtModule, addComponentsDir, addImportsDir, addPlugin, installModule, hasNuxtModule } from '@nuxt/kit'
import type { HookResult } from '@nuxt/schema'
import { addTemplates } from './templates'
import { defaultOptions, getDefaultConfig, resolveColors } from './utils/defaults'
import { name, version } from '../package.json'

export type * from './runtime/types'

type Color = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | (string & {})
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | (string & {})

export interface ModuleOptions {
  /**
   * Prefix for components
   * @defaultValue `U`
   * @see https://ui.nuxt.com/docs/getting-started/installation/nuxt#prefix
   */
  prefix?: string

  /**
   * Enable or disable `@nuxt/fonts` module
   * @defaultValue `true`
   * @see https://ui.nuxt.com/docs/getting-started/installation/nuxt#fonts
   */
  fonts?: boolean

  /**
   * Enable or disable `@nuxtjs/color-mode` module
   * @defaultValue `true`
   * @see https://ui.nuxt.com/docs/getting-started/installation/nuxt#colormode
   */
  colorMode?: boolean

  /**
   * Customize how the theme is generated
   * @see https://ui.nuxt.com/docs/getting-started/theme/design-system
   */
  theme?: {
    /**
     * Define the color aliases available for components
     * @defaultValue `['primary', 'secondary', 'success', 'info', 'warning', 'error']`
     * @see https://ui.nuxt.com/docs/getting-started/installation/nuxt#themecolors
     */
    colors?: Color[]

    /**
     * Enable or disable transitions on components
     * @defaultValue `true`
     * @see https://ui.nuxt.com/docs/getting-started/installation/nuxt#themetransitions
     */
    transitions?: boolean

    /**
     * The default variants to use for components
     * @see https://ui.nuxt.com/docs/getting-started/installation/nuxt#themedefaultvariants
     */
    defaultVariants?: {
      /**
       * The default color variant to use for components
       * @defaultValue `'primary'`
       */
      color?: Color

      /**
       * The default size variant to use for components
       * @defaultValue `'md'`
       */
      size?: Size
    }

    /**
     * Prefix for Tailwind CSS utility classes
     * @see https://ui.nuxt.com/docs/getting-started/installation/nuxt#themeprefix
     * @example 'tw'
     */
    prefix?: string
  }

  /**
   * Force the import of prose components even if `@nuxtjs/mdc` or `@nuxt/content` are not installed
   * @defaultValue false
   */
  mdc?: boolean
  /**
   * Force the import of content & prose components even if `@nuxt/content` is not installed
   * @defaultValue false
   */
  content?: boolean

  /**
   * Experimental features
   */
  experimental?: {
    /**
     * Enable automatic component detection for tree-shaking
     * Only generates theme files for components actually used in your app
     * - `true`: Enable automatic detection
     * - `string[]`: Enable detection and include additional components (useful for dynamic components)
     * @defaultValue false
     * @example true
     * @example ['Modal', 'Dropdown']
     */
    componentDetection?: boolean | string[]
  }
}

declare module '#app' {
  interface RuntimeNuxtHooks {
    'dashboard:search:toggle': () => HookResult
    'dashboard:sidebar:toggle': () => HookResult
    'dashboard:sidebar:collapse': (value: boolean) => HookResult
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    docs: 'https://ui.nuxt.com/docs/getting-started/installation/nuxt',
    configKey: 'ui',
    compatibility: {
      nuxt: '>=4.0.0'
    }
  },
  defaults: defaultOptions,
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    options.theme = options.theme || {}
    options.theme.colors = resolveColors(options.theme.colors)

    nuxt.options.ui = options

    nuxt.options.alias['#ui'] = resolve('./runtime')

    nuxt.options.appConfig.ui = defu(nuxt.options.appConfig.ui || {}, getDefaultConfig(options.theme))

    // Isolate root node from portaled components
    nuxt.options.app.rootAttrs = nuxt.options.app.rootAttrs || {}
    nuxt.options.app.rootAttrs.class = [nuxt.options.app.rootAttrs.class, `${options.theme?.prefix ? options.theme.prefix + ':' : ''}isolate`].filter(Boolean).join(' ')

    nuxt.hook('vite:extend', async ({ config }) => {
      const plugin = await import('@tailwindcss/vite').then(r => r.default)
      config.plugins ||= []
      config.plugins.push(plugin())
    })
    if (nuxt.options.builder !== '@nuxt/vite-builder') {
      nuxt.options.postcss.plugins['@tailwindcss/postcss'] = {}
    }

    async function registerModule(name: string, key: string, options: Record<string, any>) {
      if (!hasNuxtModule(name)) {
        await installModule(name, defu((nuxt.options as any)[key], options))
      } else {
        (nuxt.options as any)[key] = defu((nuxt.options as any)[key], options)
      }
    }

    await registerModule('@nuxt/icon', 'icon', {
      cssLayer: 'components'
    })
    if (options.fonts) {
      await registerModule('@nuxt/fonts', 'fonts', {
        defaults: {
          weights: [400, 500, 600, 700]
        }
      })
    }
    if (options.colorMode) {
      await registerModule('@nuxtjs/color-mode', 'colorMode', {
        classSuffix: '',
        disableTransition: true
      })
    }

    addPlugin({ src: resolve('./runtime/plugins/colors') })

    if ((hasNuxtModule('@nuxtjs/mdc') || options.mdc) || (hasNuxtModule('@nuxt/content') || options.content)) {
      nuxt.options.mdc = defu(nuxt.options.mdc, {
        highlight: {
          theme: {
            light: 'material-theme-lighter',
            default: 'material-theme',
            dark: 'material-theme-palenight'
          }
        },
        components: {
          map: {
            'accordion': 'ProseAccordion',
            'accordion-item': 'ProseAccordionItem',
            'badge': 'ProseBadge',
            'callout': 'ProseCallout',
            'card': 'ProseCard',
            'card-group': 'ProseCardGroup',
            'caution': 'ProseCaution',
            'code-collapse': 'ProseCodeCollapse',
            'code-group': 'ProseCodeGroup',
            'code-icon': 'ProseCodeIcon',
            'code-preview': 'ProseCodePreview',
            'code-tree': 'ProseCodeTree',
            'collapsible': 'ProseCollapsible',
            'field': 'ProseField',
            'field-group': 'ProseFieldGroup',
            'icon': 'ProseIcon',
            'kbd': 'ProseKbd',
            'note': 'ProseNote',
            'steps': 'ProseSteps',
            'tabs': 'ProseTabs',
            'tabs-item': 'ProseTabsItem',
            'tip': 'ProseTip',
            'warning': 'ProseWarning'
          }
        }
      })

      addComponentsDir({
        path: resolve('./runtime/components/prose'),
        pathPrefix: false,
        prefix: 'Prose',
        global: true
      })
    }

    if ((hasNuxtModule('@nuxt/content') || options.content)) {
      addComponentsDir({
        path: resolve('./runtime/components/content'),
        pathPrefix: false,
        prefix: options.prefix
      })
    }

    if (hasNuxtModule('@nuxtjs/color-mode')) {
      addComponentsDir({
        path: resolve('./runtime/components/color-mode'),
        pathPrefix: false,
        prefix: options.prefix
      })
    } else {
      // Stub `useColorMode` composable used in `DashboardSearch` and `ContentSearch` components
      addImportsDir(resolve('./runtime/composables/color-mode'))
    }

    addComponentsDir({
      path: resolve('./runtime/components'),
      pathPrefix: false,
      prefix: options.prefix,
      ignore: ['color-mode/**', 'content/**', 'prose/**']
    })

    addImportsDir(resolve('./runtime/composables'))

    addTemplates(options, nuxt, resolve)
  }
})
