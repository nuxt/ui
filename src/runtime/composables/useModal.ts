import { ref, inject } from 'vue'
import type { ShallowRef, Component, InjectionKey } from 'vue'
import { createSharedComposable } from '@vueuse/core'
import { mergeConfig } from '../utils'
import type { Strategy } from '../types'
// @ts-expect-error
import appConfig from '#build/app.config'
import { modal } from '#ui/ui.config'

export interface ModalState {
  component: Component | string
  props: ModalProps
}

export const modalInjectionKey: InjectionKey<ShallowRef<ModalState>> = Symbol('nuxt-ui.modal')

const config = mergeConfig<typeof modal>(appConfig.ui.strategy, appConfig.ui.modal, modal)

interface ModalProps {
  appear?: boolean,
  overlay?: boolean,
  transition?: boolean,
  preventClose?: boolean,
  fullscreen?: boolean,
  class?: string | Object | string[]
  ui?: Partial<typeof config> & { strategy?: Strategy }
  onClose?: () => void
  onClosePrevented?: () => void
  'onUpdate:modelValue'?: (value: boolean) => void
}

function _useModal () {
  const modalState = inject(modalInjectionKey)
  
  const isOpen = ref(false)

  function reveal (component: Component, props: ModalProps = {}) {
    modalState.value = {
      component,
      props
    }
    isOpen.value = true
  }

  function close () {
    isOpen.value = false
    modalState.value = {
      component: 'div',
      props: {}
    }
  }


  return {
    isOpen,
    reveal,
    close
  }
}

export const useModal = createSharedComposable(_useModal)