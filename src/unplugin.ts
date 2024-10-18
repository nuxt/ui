import { fileURLToPath } from 'node:url'

import { join } from 'pathe'
import { createUnplugin } from 'unplugin'
import AutoImport from 'unplugin-auto-import'
import { defu } from 'defu'
import tailwind from '@tailwindcss/vite'
import { resolvePathSync } from 'mlly'
import type colors from 'tailwindcss/colors'

import { defaultOptions, getDefaultUiConfig, resolveColors } from './defaults'
import type { ModuleOptions } from './module'
import type icons from './theme/icons'

import TemplatePlugin from './plugins/templates'
import PluginsPlugin from './plugins/plugins'
import AppConfigPlugin from './plugins/app-config'
import ComponentImportPlugin from './plugins/components'

type NeutralColor = 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone'
type Color = Exclude<keyof typeof colors, 'inherit' | 'current' | 'transparent' | 'black' | 'white' | NeutralColor> | (string & {})

interface AppConfigUI {
  // TODO: add type hinting for colors from `options.theme.colors`
  colors?: Record<string, Color> & { neutral?: NeutralColor }
  icons?: Partial<typeof icons>
  [key: string]: unknown
}

export interface NuxtUIOptions extends Omit<ModuleOptions, 'fonts' | 'colorMode'> {
  ui?: AppConfigUI
  /**
   * Enable or disable `@vueuse/core` color-mode integration
   * @defaultValue `true`
   */
  colorMode?: boolean
}

export const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))

export const NuxtUIPlugin = createUnplugin<NuxtUIOptions>((_options = {}, meta) => {
  const options = defu(_options, { fonts: false }, defaultOptions)

  options.theme = options.theme || {}
  options.theme.colors = resolveColors(options.theme.colors)

  const appConfig = defu({ ui: options.ui }, { ui: getDefaultUiConfig(options.theme.colors) })

  const stubPath = resolvePathSync(join(runtimeDir, 'vue/stubs'), { extensions: ['.ts', '.mjs', '.js'] })
  return [
    {
      name: 'nuxt:ui',
      resolveId(id) {
        // this is implemented here rather than in a vite `config` hook for cross-builder support
        if (id === '#imports') {
          return stubPath
        }
      }
    },
    ComponentImportPlugin(meta.framework, options),
    AutoImport[meta.framework]({ dirs: [join(runtimeDir, 'composables')] }),
    tailwind(),
    PluginsPlugin(options),
    TemplatePlugin(options, appConfig),
    AppConfigPlugin(options, appConfig)
  ]
})
