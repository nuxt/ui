import { ref, inject } from 'vue'
import type { ShallowRef, Component, InjectionKey } from 'vue'
import { createSharedComposable } from '@vueuse/core'
import type { ComponentProps } from '../types/component'
import type { Modal, ModalState } from '../types/modal'

export const modalInjectionKey: InjectionKey<ShallowRef<ModalState>> = Symbol('nuxt-ui.modal')

function _useModal() {
  const modalState = inject(modalInjectionKey)

  const isOpen = ref(false)

  function open<T extends Component>(component: T, props?: Modal & ComponentProps<T>) {
    if (!modalState) {
      throw new Error('useModal() is called without provider')
    }

    modalState.value = {
      component,
      props: props ?? {}
    }

    isOpen.value = true
  }

  async function close() {
    if (!modalState) return

    isOpen.value = false
  }

  function reset() {
    modalState.value = {
      component: 'div',
      props: {}
    }
  }

  /**
   * Allows updating the modal props
   */
  function patch<T extends Component = {}>(props: Partial<Modal & ComponentProps<T>>) {
    if (!modalState) return

    modalState.value = {
      ...modalState.value,
      props: {
        ...modalState.value.props,
        ...props
      }
    }
  }

  return {
    open,
    close,
    reset,
    patch,
    isOpen
  }
}

export const useModal = createSharedComposable(_useModal)
