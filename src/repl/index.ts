// ESM entry for Vue REPL usage
// Expose a curated set of Vue-compatible components and utilities.

// Vue overrides live under runtime/vue/components
// Generated top-level component exports
export * from './components.generated'

// Minimal composables often used in examples
export { useAppConfig } from '../runtime/vue/composables/useAppConfig'

// Types re-export for TS users in REPL-like setups (optional)
export type * from '../runtime/types'
