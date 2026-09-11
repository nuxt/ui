declare module '#build/app.config' {
  import type { AppConfig } from '@nuxt/schema'

  const _default: AppConfig
  export default _default
}

declare module '#build/ui-stylex-atlas' {
  const atlas: Record<string, string[]>
  export default atlas
}

declare module '#build/ui-stylex-app-config' {
  const compiled: Record<string, unknown> | null
  export default compiled
}

declare module '#build/ui-stylex-merge' {
  export function mergeStylexClasses<T>(classes: T): T
}
