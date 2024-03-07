import { defu } from 'defu'
import { createResolver, defineNuxtModule, addComponentsDir, addImportsDir, addVitePlugin, addPlugin, installModule } from '@nuxt/kit'
import tailwindcss from '@tailwindcss/vite'
import createTemplates from './templates'

export interface ModuleOptions {
  colors: string[]
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'ui',
    configKey: 'ui',
    compatibility: {
      nuxt: '^3.10.0'
    }
  },
  defaults: {
    colors: ['primary', 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchia', 'pink', 'rose']
  },
  async setup (options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    nuxt.options.alias['#ui'] = resolve('./runtime')

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

    createTemplates(options, nuxt)

    await installModule('nuxt-icon')
    // await installModule('@nuxtjs/color-mode', { classSuffix: '' })

    addPlugin({
      src: resolve('./runtime/plugins/index')
    })

    addComponentsDir({
      path: resolve('./runtime/components'),
      prefix: 'U',
      pathPrefix: false
    })

    addImportsDir(resolve('./runtime/composables'))
  }
})
