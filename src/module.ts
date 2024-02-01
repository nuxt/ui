import { defineNuxtModule, installModule, addComponentsDir, addImportsDir, createResolver, addPlugin } from '@nuxt/kit'
import defaultColors from 'tailwindcss/colors.js'
import type { CollectionNames, IconsPluginOptions } from '@egoist/tailwindcss-icons'
import { name, version } from '../package.json'
import createTemplates from './templates'
import * as config from './runtime/ui.config'
import type { DeepPartial, Strategy } from './runtime/types/utils'
import installTailwind from './tailwind'

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

declare module 'nuxt/schema' {
  interface AppConfigInput {
    // @ts-ignore
    ui?: UI
  }
}
declare module '@nuxt/schema' {
  interface AppConfigInput {
    // @ts-ignore
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
  /**
   * Disables the global css styles added by the module.
   */
  disableGlobalStyles?: boolean
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
    safelistColors: ['primary'],
    disableGlobalStyles: false
  },
  async setup (options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // Transpile runtime
    const runtimeDir = resolve('./runtime')
    nuxt.options.build.transpile.push(runtimeDir)
    nuxt.options.build.transpile.push('@popperjs/core', '@headlessui/vue')

    nuxt.options.alias['#ui'] = runtimeDir

    if (!options.disableGlobalStyles) {
      nuxt.options.css.push(resolve(runtimeDir, 'ui.css'))
    }

    createTemplates(nuxt)

    // Modules

    await installModule('nuxt-icon')
    await installModule('@nuxtjs/color-mode', { classSuffix: '' })
    await installTailwind(options, nuxt)

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
