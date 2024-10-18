import { fileURLToPath } from 'node:url'

import { join } from 'pathe'
import { createUnplugin } from 'unplugin'
import AutoImport from 'unplugin-auto-import'
import { defu } from 'defu'
import tailwind from '@tailwindcss/vite'
import { resolvePathSync } from 'mlly'

import { defaultOptions, resolveColors } from './defaults'
import type { ModuleOptions } from './module'

import TemplatePlugin from './plugins/templates'
import PluginsPlugin from './plugins/plugins'
import AppConfigPlugin from './plugins/app-config'
import ComponentImportPlugin from './plugins/components'

export interface NuxtUIOptions extends Omit<ModuleOptions, 'fonts'> {}

export const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))

// TODO: Types for app config
export const NuxtUIPlugin = createUnplugin<NuxtUIOptions>((_options = {}, meta) => {
  const options = defu(_options, { fonts: false }, defaultOptions)

  options.theme = options.theme || {}
  options.theme.colors = resolveColors(options.theme.colors)

  const appConfig: Record<string, any> = {}

  const stubPath = resolvePathSync(join(runtimeDir, 'vue/stubs'))
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
