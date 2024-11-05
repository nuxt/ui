import { createRequire } from 'node:module'
import { defineNuxtModule, installModule, addComponentsDir, addImportsDir, createResolver, addPlugin } from '@nuxt/kit'
import { name, version } from '../package.json'
import createTemplates from './templates'
import type * as config from './runtime/ui.config'
import type { DeepPartial, Strategy } from './runtime/types'
import installTailwind from './tailwind'

const _require = createRequire(import.meta.url)
const defaultColors = _require('tailwindcss/colors.js')

delete defaultColors.lightBlue
delete defaultColors.warmGray
delete defaultColors.trueGray
delete defaultColors.coolGray
delete defaultColors.blueGray

type UI = {
  primary?: string
  gray?: string
  colors?: string[]
  strategy?: Strategy
  [key: string]: any
} & DeepPartial<typeof config, string | number | boolean>

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
      nuxt: '>=3.10.0'
    }
  },
  defaults: {
    prefix: 'U',
    safelistColors: ['primary'],
    disableGlobalStyles: false
  },
  async setup(options, nuxt) {
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

    await installModule('@nuxt/icon')
    await installModule('@nuxtjs/color-mode', { classSuffix: '' })
    await installTailwind(options, nuxt, resolve)

    // Plugins

    addPlugin({
      src: resolve(runtimeDir, 'plugins', 'colors')
    })

    addPlugin({
      src: resolve(runtimeDir, 'plugins', 'modals')
    })

    addPlugin({
      src: resolve(runtimeDir, 'plugins', 'slideovers')
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
