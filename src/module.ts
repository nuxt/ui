import { readFile } from 'node:fs/promises'
import { join, relative } from 'pathe'
import { defu } from 'defu'
import { createResolver, defineNuxtModule, addComponentsDir, addImports, addImportsDir, addPlugin, addPluginTemplate, addBuildPlugin, findPath, getLayerDirectories, hasNuxtModule, logger, resolvePath, tryResolveModule, directoryToURL } from '@nuxt/kit'
import { IconUsageScanner } from '@nuxt/icon/utils'
import { createUnplugin } from 'unplugin'
import type { HookResult, ModuleDependencies } from '@nuxt/schema'
import type { NuxtUIESLintOptions } from './utils/eslint'
import { addTemplates } from './templates'
import { publicComposables } from './imports'
import { defaultOptions, getDefaultConfig } from './utils/defaults'
import { readAppConfigColors } from './utils/eslint'
import { getClientBundleIcons } from './utils/icons'
import { generateI18nPlugin, getLocaleKeys } from './utils/locales'
import type { I18nLocale } from './utils/locales'
import { findTailwindPrefix } from './utils/tailwind'
import OptionalDepsPlugin from './plugins/optional-deps'
import { name, version } from '../package.json'

export type * from './runtime/types'

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
   * The prefix of your Tailwind CSS import, `@import "tailwindcss" prefix(tw)`,
   * so components prefix their classes the same way
   * @see https://ui.nuxt.com/docs/getting-started/installation/nuxt#tailwindprefix
   * @example 'tw'
   */
  tailwindPrefix?: string

  /**
   * Force the import of prose components even if `@nuxtjs/mdc` or `@nuxt/content` are not installed
   * Set to `false` to skip them even when one of these modules is installed
   * @defaultValue undefined
   * @see https://ui.nuxt.com/docs/getting-started/installation/nuxt#prose
   */
  prose?: boolean

  /**
   * @deprecated Use `prose` instead
   * @see https://ui.nuxt.com/docs/getting-started/installation/nuxt#mdc
   */
  mdc?: boolean

  /**
   * Force the import of content & prose components (unless `prose` is `false`) even if `@nuxt/content` is not installed
   * @defaultValue false
   * @see https://ui.nuxt.com/docs/getting-started/installation/nuxt#content
   */
  content?: boolean

  /**
   * Add the `@nuxt/ui/eslint` config to the one `@nuxt/eslint` generates, with
   * your stylesheet as its entry point. Needs `@nuxt/eslint` and `eslint-plugin-better-tailwindcss`.
   * @defaultValue false
   * @see https://ui.nuxt.com/docs/getting-started/integrations/eslint/nuxt
   */
  eslint?: boolean | Partial<NuxtUIESLintOptions>

  /**
   * Experimental features
   */
  experimental?: {
    /**
     * Enable automatic component detection for tree-shaking
     * Only generates the theme CSS of the components actually used in your app
     * - `true`: Enable automatic detection
     * - `string[]`: Enable detection and include additional components (useful for dynamic components)
     * @defaultValue false
     * @example true
     * @example ['Modal', 'DropdownMenu']
     */
    componentDetection?: boolean | string[]
  }
}

/**
 * Whether the nearest `eslint.config` in these directories, the one ESLint uses, already registers `eslint-plugin-better-tailwindcss`.
 */
async function hasOwnESLintSetup(dirs: string[]) {
  for (const dir of new Set(dirs)) {
    const path = await findPath(join(dir, 'eslint.config'), { extensions: ['.js', '.mjs', '.cjs', '.ts', '.mts', '.cts'] })
    if (path) {
      // An import of the plugin or one of its entries, left out when commented
      const code = (await readFile(path, 'utf-8')).replace(/\/\*[\s\S]*?\*\/|^\s*\/\/.*$/gm, '')
      return /["']eslint-plugin-better-tailwindcss(?:\/[^"']*)?["']/.test(code)
    }
  }
  return false
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
      nuxt: '>=4.1.0'
    }
  },
  defaults: defaultOptions,
  moduleDependencies(nuxt): ModuleDependencies {
    const userUiOptions = nuxt.options.ui || {}
    return {
      '@nuxt/icon': {
        defaults: {
          cssLayer: 'base'
        }
      },
      ...userUiOptions.fonts !== false && {
        '@nuxt/fonts': {
          defaults: {
            defaults: {
              weights: [400, 500, 600, 700]
            }
          }
        }
      },
      ...userUiOptions.colorMode !== false && {
        '@nuxtjs/color-mode': {
          defaults: {
            classSuffix: '',
            disableTransition: true
          }
        }
      },
      '@nuxtjs/mdc': {
        optional: !userUiOptions.mdc,
        defaults: {
          highlight: {
            theme: {
              light: 'material-theme-lighter',
              default: 'material-theme',
              dark: 'material-theme-palenight'
            }
          },
          ...userUiOptions.prose !== false && {
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
                'prompt': 'ProsePrompt',
                'steps': 'ProseSteps',
                'tabs': 'ProseTabs',
                'tabs-item': 'ProseTabsItem',
                'tip': 'ProseTip',
                'warning': 'ProseWarning'
              }
            }
          }
        }
      }
    }
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    nuxt.options.ui = options

    nuxt.options.alias['#ui'] = resolve('./runtime')

    // Read the prefix off the app's `@import "tailwindcss" prefix(...)`, so it's set in one place
    const stylesheets = await Promise.all(nuxt.options.css.filter(entry => typeof entry === 'string').map(entry => resolvePath(entry)))
    const tailwind = await findTailwindPrefix(stylesheets)
    if (tailwind) {
      if (!options.tailwindPrefix) {
        options.tailwindPrefix = tailwind.prefix ?? undefined
      } else if (options.tailwindPrefix !== tailwind.prefix) {
        logger.warn(`Nuxt UI \`tailwindPrefix\` is \`${options.tailwindPrefix}\` but \`${relative(nuxt.options.rootDir, tailwind.path)}\` imports Tailwind CSS ${tailwind.prefix ? `with \`prefix(${tailwind.prefix})\`` : 'without a prefix'}: components will render classes Tailwind CSS doesn't generate`)
      }
    }

    nuxt.options.appConfig.ui = defu(nuxt.options.appConfig.ui || {}, getDefaultConfig(options.tailwindPrefix)) as typeof nuxt.options.appConfig.ui

    // Pre-bundle the icons Nuxt UI uses into `@nuxt/icon`'s client bundle so they're
    // embedded at build time instead of fetched at runtime. Its `clientBundle.scan`
    // skips `node_modules`, so it can't discover the icons baked into our components.
    //
    // `@nuxt/icon` drops any name it can't resolve (collection not installed, icon
    // missing) and falls back to runtime loading instead of failing the build
    // (nuxt/icon#504), so we add them all and let it sort out what's available.
    nuxt.hook('icon:clientBundleIcons', async (icons) => {
      for (const name of getClientBundleIcons(nuxt.options.appConfig.ui?.icons)) {
        icons.add(name)
      }

      // `app.config.ts` is only evaluated at runtime, so the icons it sets never reach
      // `nuxt.options.appConfig`. Read the icon names written in each layer's file instead,
      // matching custom collections too, as `clientBundle.scan` does.
      const scanner = new IconUsageScanner({
        additionalCollections: ((nuxt.options.icon || {}).customCollections ?? []).map(collection => collection.prefix)
      })
      for (const layer of getLayerDirectories(nuxt)) {
        const path = await findPath(join(layer.app, 'app.config'))
        if (path) {
          scanner.extractFromCode(await readFile(path, 'utf-8'), icons)
        }
      }
    })

    nuxt.options.build.transpile.push('reka-ui')

    // Isolate root node from portaled components
    nuxt.options.app.rootAttrs = nuxt.options.app.rootAttrs || {}
    nuxt.options.app.rootAttrs.class = [nuxt.options.app.rootAttrs.class, `${options.tailwindPrefix ? options.tailwindPrefix + ':' : ''}isolate`].filter(Boolean).join(' ')

    nuxt.hook('vite:extend', async ({ config }) => {
      const plugin = await import('@tailwindcss/vite').then(r => r.default)
      config.plugins ||= []
      config.plugins.push(plugin())
    })
    if (nuxt.options.builder !== '@nuxt/vite-builder') {
      nuxt.options.postcss.plugins['@tailwindcss/postcss'] = {}
    }

    addPlugin({ src: resolve('./runtime/plugins/colors') })
    addBuildPlugin(createUnplugin(() => OptionalDepsPlugin(resolve('./runtime'))))

    if (hasNuxtModule('@nuxtjs/i18n')) {
      addPluginTemplate({
        filename: 'ui-i18n.mjs',
        dependsOn: [],
        getContents: () => {
          // Resolved by `@nuxtjs/i18n`, including layers
          const { locales } = (nuxt.options.runtimeConfig.public.i18n || {}) as { locales?: I18nLocale[] }

          return generateI18nPlugin(Array.isArray(locales) ? locales : [], getLocaleKeys(resolve('./runtime/locale')), resolve('./runtime'))
        }
      })
    }

    if (options.prose !== false && (options.prose || options.mdc || options.content || hasNuxtModule('@nuxtjs/mdc') || hasNuxtModule('@nuxt/content'))) {
      addComponentsDir({
        path: resolve('./runtime/components/prose'),
        pathPrefix: false,
        prefix: 'Prose',
        // Skip the `index` barrel
        extensions: ['vue'],
        global: true
      })
    }

    if (options.content || hasNuxtModule('@nuxt/content')) {
      addComponentsDir({
        path: resolve('./runtime/components/content'),
        pathPrefix: false,
        prefix: options.prefix
      })
    }

    if (options.colorMode || hasNuxtModule('@nuxtjs/color-mode')) {
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

    addImports(
      Object.entries(publicComposables).flatMap(([file, exports]) =>
        exports.map(name => ({ name, from: resolve(`./runtime/composables/${file}`) }))
      )
    )

    if (options.eslint) {
      const eslintOptions = typeof options.eslint === 'object' ? options.eslint : {}
      if (!hasNuxtModule('@nuxt/eslint') || !await tryResolveModule('eslint-plugin-better-tailwindcss', directoryToURL(nuxt.options.rootDir))) {
        logger.warn('Nuxt UI `eslint` needs the `@nuxt/eslint` module and `eslint-plugin-better-tailwindcss`.')
      } else if (await hasOwnESLintSetup([nuxt.options.rootDir, nuxt.options.workspaceDir])) {
        // A second instance of the plugin makes ESLint fail, so leave the app's config alone
        logger.warn('Nuxt UI `eslint` is skipped: your `eslint.config` already registers `eslint-plugin-better-tailwindcss`, remove it to use this config.')
      } else {
        // The stylesheet listed in `css` that imports Tailwind CSS, not the one it may delegate to
        let entryPoint = eslintOptions.entryPoint && await resolvePath(eslintOptions.entryPoint)
        for (const entry of entryPoint ? [] : nuxt.options.css) {
          const path = typeof entry === 'string' && await resolvePath(entry)
          if (path && /@import\s+["']tailwindcss["']/.test(await readFile(path, 'utf-8').catch(() => ''))) {
            entryPoint = path
            break
          }
        }
        if (!entryPoint) {
          logger.warn('Nuxt UI `eslint` needs a stylesheet in `css` that imports Tailwind CSS.')
        } else {
          // `ui.colors` is set at runtime in `app.config.ts`: read what each layer writes, the app's own last so it wins
          const colors: Record<string, string> = { ...nuxt.options.appConfig.ui?.colors as Record<string, string> }
          for (const layer of [...getLayerDirectories(nuxt)].reverse()) {
            const path = await findPath(join(layer.app, 'app.config'))
            if (path) {
              Object.assign(colors, readAppConfigColors(await readFile(path, 'utf-8')))
            }
          }
          // Through the package export, `./eslint.mjs` next to `src/module.ts` doesn't exist when the module is stubbed
          const config = await tryResolveModule(`${name}/eslint`, import.meta.url) ?? resolve('./eslint.mjs')
          // Declared by `@nuxt/eslint`, called again on `builder:generateApp` so the order of the modules doesn't matter
          nuxt.hook('eslint:config:addons' as any, (addons: { name: string, getConfigs: () => unknown }[]) => {
            addons.push({
              name: 'nuxt-ui',
              getConfigs: () => ({
                imports: [{ from: config, name: 'default', as: 'nuxtUI' }],
                configs: [`...nuxtUI(${JSON.stringify({ ...eslintOptions, colors: { ...colors, ...eslintOptions.colors }, entryPoint })})`]
              })
            })
          })
        }
      }
    }

    addTemplates(options, nuxt, resolve)
  }
})
