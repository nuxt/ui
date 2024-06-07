import { shallowRef } from 'vue'
import { defineNuxtPlugin } from '#imports'
import { slideoverInjectionKey, type SlideoverState } from '../composables/useSlideover'

export default defineNuxtPlugin((nuxtApp) => {
  const slideoverState = shallowRef<SlideoverState>({
    component: 'div',
    props: {}
  })

  nuxtApp.vueApp.provide(slideoverInjectionKey, slideoverState)
})
