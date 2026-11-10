import { install } from 'temporal-polyfill-lite/shim'

// Reka UI reads the global `Temporal` and ships no implementation, and Node and some browsers have none yet.
// The date components import this file, so apps that don't use them never load the polyfill.
// `false` keeps an implementation that is already there: a native one, or a polyfill the app loaded first.
install(false)
