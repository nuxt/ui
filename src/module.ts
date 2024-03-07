import { defu } from 'defu'
import { createResolver, defineNuxtModule, addComponentsDir, addImportsDir, addVitePlugin, addPlugin, installModule } from '@nuxt/kit'
import tailwindcss from '@tailwindcss/vite'
import createTemplates from './templates'
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

    nuxt.options.appConfig.ui = defu(nuxt.options.appConfig.ui || {}, {
      primary: 'green',
      gray: 'cool',
      icons: {
        search: 'i-heroicons-magnifying-glass-20-solid',
        close: 'i-heroicons-x-mark-20-solid',
        check: 'i-heroicons-check-20-solid',
        loading: 'i-heroicons-arrow-path-20-solid',
        empty: 'i-heroicons-circle-stack-20-solid'
      }
    })

    addVitePlugin(tailwindcss)

    createTemplates(nuxt)

    await installModule('nuxt-icon')
    // await installModule('@nuxtjs/color-mode', { classSuffix: '' })

    addPlugin({
      src: resolver.resolve('./runtime/plugins/index')
    })

    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
      prefix: 'U',
      pathPrefix: false
    })

    addImportsDir(resolver.resolve('./runtime/composables'))
  }
})
