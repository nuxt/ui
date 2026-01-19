import type { NuxtUIOptions } from '../unplugin'

export type RouterMode = 'vue-router' | 'inertia' | 'none'

export function resolveRouterMode(options: NuxtUIOptions): RouterMode {
  if (options.router === false || typeof options.router === 'function') {
    return 'none'
  }

  if (options.router === 'inertia') {
    return 'inertia'
  }

  // we still handle deprecated inertia option
  if (options.router === undefined && options.inertia === true) {
    return 'inertia'
  }

  return 'vue-router'
}
