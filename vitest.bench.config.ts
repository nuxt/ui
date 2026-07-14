import { defineConfig } from 'vitest/config'
import codspeedPlugin from '@codspeed/vitest-plugin'

// Dedicated configuration for CodSpeed performance benchmarks.
// Benchmarks target pure utility functions and therefore do not require the
// Nuxt or happy-dom environments used by the component/unit test suites.
export default defineConfig({
  plugins: [codspeedPlugin()],
  // Avoid resolving the root tsconfig.json which extends the generated
  // `.nuxt/tsconfig.json`. The benchmarks target framework-agnostic utility
  // functions, so no project-specific compiler options are required.
  esbuild: {
    tsconfigRaw: {}
  },
  test: {
    include: ['bench/**/*.bench.ts']
  }
})
