import { shallowRef } from 'vue'
import { defineNuxtPlugin } from '#imports'
import { modalInjectionKey, type ModalState } from '../composables/useModal'

export default defineNuxtPlugin((nuxtApp) => {
  const modalState = shallowRef<ModalState>({
    component: 'div',
    props: {}
  })
  nuxtApp.vueApp.provide(modalInjectionKey, modalState)
})
