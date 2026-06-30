declare module 'virtual:nuxt-ui-icons' {
  // The icons Nuxt UI bundles at build time, keyed by their `{collection}:{name}`. Generated
  // by the `nuxt:ui:icons` build plugin and registered by `runtime/vue/plugins/icons`.
  export const icons: Record<string, NonNullable<Parameters<typeof import('@iconify/vue').addIcon>[1]>>
}
