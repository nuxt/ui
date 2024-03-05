import { defu } from 'defu'
import { createResolver, defineNuxtModule, addComponentsDir, addImportsDir, installModule } from '@nuxt/kit'

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

    nuxt.options.appConfig.ui = defu(nuxt.options.appConfig.ui || {}, {
      primary: 'green',
      gray: 'cool',
      icons: {
        loading: 'i-heroicons-arrow-path-20-solid'
      }
    })

    await installModule('nuxt-icon')
    await installModule('@nuxtjs/tailwindcss', {
      exposeConfig: true,
      config: {
        darkMode: 'class',
        content: {
          files: [
            resolver.resolve('./runtime/components/**/*.{vue,mjs,ts}')
          ]
        }
      }
    })

    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
      prefix: 'U',
      pathPrefix: false
    })

    addImportsDir(resolver.resolve('./runtime/composables'))
  }
})
