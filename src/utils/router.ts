import type { NuxtUIOptions } from '../unplugin'

export type RouterMode = 'vue-router' | 'inertia' | 'none'

export function resolveRouterMode(options: NuxtUIOptions): RouterMode {
  if (options.router === false) {
    return 'none'
  }

  if (options.router === 'inertia') {
    return 'inertia'
  }

  return 'vue-router'
}
