import { shallowRef } from 'vue'
import { defineNuxtPlugin } from '#imports'
// FIXME: https://github.com/nuxt/module-builder/issues/141#issuecomment-2078248248
import type {} from '#app'
import { modalInjectionKey, type ModalState } from '../composables/useModal'

export default defineNuxtPlugin((nuxtApp) => {
  const modalState = shallowRef<ModalState>({
    component: 'div',
    props: {}
  })
  nuxtApp.vueApp.provide(modalInjectionKey, modalState)
})
