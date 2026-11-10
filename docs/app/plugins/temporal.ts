import { install } from 'temporal-polyfill-lite/calendars-full/shim'
import { defineNuxtPlugin } from '#imports'

// The Hebrew calendar example needs the full build, Nuxt UI only loads the ISO and Gregorian one.
install(false)

export default defineNuxtPlugin(() => {})
