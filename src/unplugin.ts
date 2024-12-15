import { fileURLToPath } from 'node:url'

import { join } from 'pathe'
import { createUnplugin } from 'unplugin'
import AutoImport from 'unplugin-auto-import'
import { defu } from 'defu'
import tailwind from '@tailwindcss/vite'
import type colors from 'tailwindcss/colors'

import type * as ui from '#build/ui'

import { defaultOptions, getDefaultUiConfig, resolveColors } from './defaults'
import type { ModuleOptions } from './module'
import type icons from './theme/icons'

import TemplatePlugin from './plugins/templates'
import PluginsPlugin from './plugins/plugins'
import AppConfigPlugin from './plugins/app-config'
import ComponentImportPlugin from './plugins/components'
import NuxtEnvironmentPlugin from './plugins/nuxt-environment'

import type { DeepPartial } from './runtime/types/utils'

type NeutralColor = 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone'
type Color = Exclude<keyof typeof colors, 'inherit' | 'current' | 'transparent' | 'black' | 'white' | NeutralColor> | (string & {})

type AppConfigUI = {
  // TODO: add type hinting for colors from `options.theme.colors`
  colors?: Record<string, Color> & { neutral?: NeutralColor }
  icons?: Partial<typeof icons>
} & DeepPartial<typeof ui>

export interface NuxtUIOptions extends Omit<ModuleOptions, 'fonts' | 'colorMode'> {
  /** Whether to generate declaration files for auto-imported components. */
  dts?: boolean
  ui?: AppConfigUI
  /**
   * Enable or disable `@vueuse/core` color-mode integration
   * @defaultValue `true`
   */
  colorMode?: boolean
}

export const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))

export const NuxtUIPlugin = createUnplugin<NuxtUIOptions | undefined>((_options = {}, meta) => {
  const options = defu(_options, { fonts: false, devtools: { enabled: false } }, defaultOptions)

  options.theme = options.theme || {}
  options.theme.colors = resolveColors(options.theme.colors)

  const appConfig = defu({ ui: options.ui }, { ui: getDefaultUiConfig(options.theme.colors) })

  return [
    NuxtEnvironmentPlugin(),
    ...ComponentImportPlugin(meta.framework, options),
    AutoImport[meta.framework]({ dts: options.dts ?? true, dirs: [join(runtimeDir, 'composables')] }),
    tailwind(),
    PluginsPlugin(options),
    TemplatePlugin(options, appConfig),
    AppConfigPlugin(options, appConfig)
  ]
})
