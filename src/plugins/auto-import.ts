import { defu } from 'defu'
import { join } from 'pathe'
import type { UnpluginContextMeta, UnpluginOptions } from 'unplugin'
import AutoImport from 'unplugin-auto-import'
import type { Options as AutoImportOptions } from 'unplugin-auto-import/types'
import type { NuxtUIOptions } from '../unplugin'
import { runtimeDir } from '../unplugin'
import { publicComposables } from '../imports'

/**
 * This plugin adds all the Nuxt UI composables as auto-imports.
 */
export default function AutoImportPlugin(options: NuxtUIOptions, meta: UnpluginContextMeta): UnpluginOptions {
  if (options.autoImport === false) {
    return { name: 'nuxt:ui:auto-import' }
  }

  const pluginOptions = defu(options.autoImport, <AutoImportOptions>{
    dts: options.dts ?? true,
    imports: [
      ...Object.entries(publicComposables).map(([file, names]) => ({
        from: join(runtimeDir, 'composables', file),
        imports: names
      }))
    ],
    dirs: [join(runtimeDir, 'vue/composables')]
  })

  return AutoImport.raw(pluginOptions, meta) as UnpluginOptions
}
