import './main.css'
import type { App } from 'vue'
import basePlugin from '@nuxt/ui/vue-plugin'

const componentModules = import.meta.glob('../../../src/runtime/components/*.vue', { eager: true }) as Record<string, { default: any }>

const components: Record<string, any> = {}
for (const [path, mod] of Object.entries(componentModules)) {
  const name = `U${path.match(/([^/]+)\.vue$/)?.[1]}`
  components[name] = mod.default
}

export function install(app: App) {
  app.use(basePlugin)
  for (const [name, component] of Object.entries(components)) {
    app.component(name, component)
  }
}

export default { install }

export { useToast } from '../../../src/runtime/composables/useToast'
export { useOverlay } from '../../../src/runtime/composables/useOverlay'
export { defineShortcuts, extractShortcuts } from '../../../src/runtime/composables/defineShortcuts'
