import { defineNuxtPlugin } from '#imports'
import { shallowRef } from 'vue'
import { modalInjectionKey } from '../composables/useModal'
import type { ModalState } from '../types/modal'

export default defineNuxtPlugin((nuxtApp) => {
  const modalState = shallowRef<ModalState>({
    component: 'div',
    props: {}
  })

  nuxtApp.vueApp.provide(modalInjectionKey, modalState)
})