import { createResolver, defineNuxtModule, useNuxt } from '@nuxt/kit'
import { watch } from 'chokidar'
import { debounce } from 'perfect-debounce'

/**
 * This is an internal module aiming to make the DX of developing Nuxt UI better.
 */
export default defineNuxtModule({
  meta: {
    name: '@nuxt/ui-dev'
  },
  setup() {
    const nuxt = useNuxt()
    const resolver = createResolver(import.meta.url)
    const watcher = watch(resolver.resolve('../../src/theme'))

    const generateApp = debounce(() => nuxt.hooks.callHook('builder:generateApp'))

    watcher.on('all', generateApp)
    nuxt.hook('close', () => watcher.close())
  }
})
