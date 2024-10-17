import { ref, inject } from 'vue'
import type { ShallowRef, Component, InjectionKey } from 'vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import { createSharedComposable } from '@vueuse/core'
import type { SlideoverProps } from '../types'

export interface SlideoverState {
  component: Component | string
  props: SlideoverProps
}

export const slideoverInjectionKey: InjectionKey<ShallowRef<SlideoverState>> = Symbol('nuxt-ui.slideover')

function _useSlideover() {
  const slideoverState = inject(slideoverInjectionKey)

  const isOpen = ref(false)

  function open<T extends Component>(component: T, props?: SlideoverProps & ComponentProps<T>) {
    if (!slideoverState) {
      throw new Error('useSlideover() is called without provider')
    }

    slideoverState.value = {
      component,
      props: props ?? {}
    }

    isOpen.value = true
  }

  async function close() {
    if (!slideoverState) return

    isOpen.value = false
  }

  function reset() {
    if (!slideoverState) return

    slideoverState.value = {
      component: 'div',
      props: {}
    }
  }

  /**
   * Allows updating the slideover props
   */
  function patch<T extends Component = Record<string, never>>(props: Partial<SlideoverState & ComponentProps<T>>) {
    if (!slideoverState) return

    slideoverState.value = {
      ...slideoverState.value,
      props: {
        ...slideoverState.value.props,
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

export const useSlideover = createSharedComposable(_useSlideover)
