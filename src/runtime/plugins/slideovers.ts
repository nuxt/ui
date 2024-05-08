import { defineNuxtPlugin } from '#imports'
import { shallowRef } from 'vue'
import { slidOverInjectionKey } from '../composables/useSlideover'
import type { SlideoverInstance } from '../types/slideover'

export default defineNuxtPlugin((nuxtApp) => {
  const slideoverInstances = shallowRef<SlideoverInstance[]>([])

  nuxtApp.vueApp.provide(slidOverInjectionKey, slideoverInstances)
})
