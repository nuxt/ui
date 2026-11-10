import temporal from '#build/ui/temporal'

// Reka UI reads the global `Temporal` and ships no implementation, and Node and some browsers have none yet.
// The date components import this file, so apps that don't use them never load the polyfill, and runtimes
// with a native `Temporal` (or one the app loaded) never fetch it.
if (temporal && !globalThis.Temporal) {
  const { install } = temporal === 'full'
    ? await import('temporal-polyfill-lite/calendars-full/shim')
    : await import('temporal-polyfill-lite/shim')
  install(false)
}
