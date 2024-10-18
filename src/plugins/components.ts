import { join } from 'pathe'
import type { UnpluginContextMeta } from 'unplugin'
import { globSync } from 'tinyglobby'
import AutoImportComponents from 'unplugin-vue-components'

import { runtimeDir, type NuxtUIOptions } from '../unplugin'

export default function ComponentImportPlugin(framework: UnpluginContextMeta['framework'], options: NuxtUIOptions & { prefix: NonNullable<NuxtUIOptions['prefix']> }) {
  // TODO: document that Make sure you also add components.d.ts to your tsconfig.json under include.
  const components = globSync('**/*.vue', { cwd: join(runtimeDir, 'components') })
  const componentNames = new Set(components.map(c => `${options.prefix}${c.replace(/\.vue$/, '')}`))
  return AutoImportComponents[framework]({
    dts: true,
    resolvers: [
      (componentName) => {
        if (componentName === 'NuxtLink') {
          return { name: 'default', from: join(runtimeDir, 'vue/components/nuxt-link') }
        }
        if (componentNames.has(componentName))
          return { name: 'default', from: join(runtimeDir, 'components', `${componentName.slice(options.prefix.length)}.vue`) }
      }
    ]
  })
}
