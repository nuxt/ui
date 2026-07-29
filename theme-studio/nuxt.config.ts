/**
 * Theme Studio layer — the live theme-editing engine, controls and presets,
 * extracted from the docs so any Nuxt UI app can extend it. The consuming
 * app must also import `@nuxt/ui-theme-studio/theme.css` from its Tailwind
 * entry file: the gated shadow/border machinery redefines `@theme` tokens,
 * which only exists at CSS build time.
 */
export default defineNuxtConfig({
  // the studio's components lean on @vueuse auto-imports (useClipboard,
  // useLocalStorage, …) — registered here so consumers need no setup
  modules: ['@vueuse/nuxt'],

  runtimeConfig: {
    public: {
      themeStudio: {
        // Namespace for every localStorage key the studio owns. Override it
        // per app (and per user, if you scope it) so two Nuxt UI apps on one
        // origin don't clobber each other's theme. `[\w-]` only.
        storageKey: 'nuxt-ui'
      }
    }
  }
})
