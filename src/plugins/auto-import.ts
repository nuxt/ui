import { join } from 'pathe'
import type { UnpluginContextMeta, UnpluginOptions } from 'unplugin'
import { defu } from 'defu'

import { runtimeDir } from '../unplugin'
import type { NuxtUIOptions } from '../unplugin'
import AutoImport from 'unplugin-auto-import'
import type { Options as AutoImportOptions } from 'unplugin-auto-import/types'

/**
 * This plugin adds all the Nuxt UI composables as auto-imports.
 */
export default function AutoImportPlugin(options: NuxtUIOptions, meta: UnpluginContextMeta): UnpluginOptions {
  const pluginOptions = defu(options.autoImport, <AutoImportOptions>{
    dts: options.dts ?? true,
    dirs: [join(runtimeDir, 'composables'), join(runtimeDir, 'vue/composables')]
  })

  return AutoImport.raw(pluginOptions, meta) as UnpluginOptions
}
