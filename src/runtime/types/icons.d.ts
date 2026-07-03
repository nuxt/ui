declare module 'virtual:nuxt-ui-icons' {
  // Registers the icons Nuxt UI bundles at build time through the passed `addIcon`. Generated
  // by the `nuxt:ui:icons` build plugin (via `@nuxt/icon`) and called by `runtime/vue/plugins/icons`.
  export function init(addIcon: typeof import('@iconify/vue').addIcon): void
}
