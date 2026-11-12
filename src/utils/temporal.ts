import type { ModuleOptions } from '../module'

/**
 * The `temporal-polyfill-lite` entry the `temporal` option loads, `undefined` when it's off.
 */
export function getTemporalShim(temporal: ModuleOptions['temporal']) {
  if (temporal === false) {
    return
  }

  return temporal === 'full' ? 'temporal-polyfill-lite/calendars-full/shim' : 'temporal-polyfill-lite/shim'
}

/**
 * Installs the polyfill when `Temporal` is missing, keeping a native one or one the app loaded first.
 * The import is dynamic, so runtimes with a native `Temporal` never fetch it.
 */
export function genTemporalInstall(shim: string) {
  return `if (!globalThis.Temporal) {
  const { install } = await import(${JSON.stringify(shim)})
  install(false)
}`
}
