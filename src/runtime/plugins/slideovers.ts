import { shallowRef } from 'vue'
import { slidOverInjectionKey } from '../composables/useSlideover'
import type { SlideoverState } from '../types/slideover'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  const slideoverState = shallowRef<SlideoverState>({
    component: 'div',
    props: {}
  })

  nuxtApp.vueApp.provide(slidOverInjectionKey, slideoverState)
})
