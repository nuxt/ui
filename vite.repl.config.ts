// This Vite config builds a single-file ESM bundle that can be loaded by the Vue REPL.
// The REPL expects a plain ES module URL and already provides its own Vue runtime.
// Our goal here is to:
// - Compile our .vue Single File Components into JavaScript (via @vitejs/plugin-vue)
// - Stub/alias Nuxt-only virtual imports so the code can run outside Nuxt
// - Produce dist/repl-esm/index.js that you can host and reference in an import map
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'pathe'
import { defineConfig } from 'vite'

const rootDir = dirname(fileURLToPath(import.meta.url))
const r = (...p: string[]) => join(rootDir, ...p)

export default defineConfig({
  // Plugins run in order.
  // - emptyTheme(): treats all `#build/ui/*` imports as an empty theme object.
  // - vue(): compiles .vue files.
  plugins: [emptyTheme(), vue()],
  resolve: {
    alias: [
      // Nuxt auto-imports (`#imports`) don't exist in a plain Vite build.
      // Point them to a small stub that provides minimal replacements used by our components.
      { find: '#imports', replacement: r('src/runtime/vue/stubs.ts') },

      // The library uses `useAppConfig()` which reads from `#build/app.config` in Nuxt.
      // For REPL builds, we provide a tiny `app.config.ts` with the few values our examples need.
      { find: '#build/app.config', replacement: r('src/repl/app.config.ts') },

      // Some components import an image component via a virtual module.
      // In the REPL, we alias it to a simple <img> wrapper.
      { find: '#build/ui-image-component', replacement: r('src/repl/image-component.ts') }
    ]
  },
  build: {
    lib: {
      // A small, curated entry that re-exports only the components and utilities
      // we want to expose in the REPL (see src/repl/index.ts).
      entry: r('src/repl/index.ts'),
      // We only need ESM for the Vue REPL.
      formats: ['es'],
      // Create an easy-to-reference file name.
      fileName: () => 'index.js',
      // UMD name is unused for ESM, but Vite requires a name in lib mode.
      name: 'NuxtUiRepl'
    },
    // Output folder for the REPL bundle.
    outDir: r('dist/repl-esm'),
    // Clean the folder before each build.
    emptyOutDir: true,
    rollupOptions: {
      // IMPORTANT: Do not bundle Vue. The Vue REPL provides its own Vue runtime.
      // Marking it external keeps our bundle lightweight and avoids version conflicts.
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' }
      }
    }
  }
})

// Simplest possible theme handling for REPL builds:
// We do NOT expose theme customization and we don't run Nuxt's code generator.
// Map ALL `#build/ui/*` imports to a single virtual module returning an empty theme
// object with the minimal shape expected by components that call tv(theme).
// This eliminates the need for any files under src/repl/theme.
export function emptyTheme() {
  const VIRTUAL_ID = '\0nuxt-ui-empty-theme'
  const THEME_CODE = 'export default { base: "", variants: {} }\n'
  return {
    name: 'nuxt-ui:repl-empty-theme',
    resolveId(id: string) {
      if (/^#build\/ui\//.test(id)) return VIRTUAL_ID
      return null
    },
    load(id: string) {
      if (id === VIRTUAL_ID) return THEME_CODE
      return null
    }
  }
}
