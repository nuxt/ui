import { shallowRef } from 'vue'
import { modalInjectionKey } from '../composables/useModal'
import type { ModalState } from '../types/modal'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  const modalState = shallowRef<ModalState>({
    component: 'div',
    props: {}
  })

  nuxtApp.vueApp.provide(modalInjectionKey, modalState)
})
