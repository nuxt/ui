import { shallowRef } from 'vue'
import { defineNuxtPlugin } from '#imports'
// FIXME: https://github.com/nuxt/module-builder/issues/141#issuecomment-2078248248
import type {} from '#app'
import { slideoverInjectionKey, type SlideoverState } from '../composables/useSlideover'

export default defineNuxtPlugin((nuxtApp) => {
  const slideoverState = shallowRef<SlideoverState>({
    component: 'div',
    props: {}
  })

  nuxtApp.vueApp.provide(slideoverInjectionKey, slideoverState)
})
