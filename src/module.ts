import { defu } from 'defu'
import { createResolver, defineNuxtModule, addComponentsDir, addImportsDir, addVitePlugin, installModule } from '@nuxt/kit'
import tailwindcss from '@tailwindcss/vite'
import type { DeepPartial } from './runtime/types'
import * as theme from './runtime/theme'

type UI = {
  primary?: string
  gray?: string
  [key: string]: any
} & DeepPartial<typeof theme>

declare module 'nuxt/schema' {
  interface AppConfigInput {
    ui?: UI
  }
}
declare module '@nuxt/schema' {
  interface AppConfigInput {
    ui?: UI
  }
}

export default defineNuxtModule({
  meta: {
    name: 'ui',
    configKey: 'ui',
    compatibility: {
      nuxt: '^3.10.0'
    }
  },
  async setup (_, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.alias['#ui'] = resolver.resolve('./runtime')

    nuxt.options.css.push(resolver.resolve('./runtime/main.css'))

    nuxt.options.appConfig.ui = defu(nuxt.options.appConfig.ui || {}, {
      primary: 'green',
      gray: 'cool',
      icons: {
        loading: 'i-heroicons-arrow-path-20-solid'
      }
    })

    await installModule('nuxt-icon')

    addVitePlugin(tailwindcss)

    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
      prefix: 'U',
      pathPrefix: false
    })

    addImportsDir(resolver.resolve('./runtime/composables'))
  }
})
