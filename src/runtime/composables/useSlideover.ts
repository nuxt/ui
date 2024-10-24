import { ref, inject } from 'vue'
import type { ShallowRef, Component, InjectionKey } from 'vue'
import { createSharedComposable } from '@vueuse/core'
import type { ComponentProps } from '../types/component'
import type { Slideover, SlideoverState } from '../types/slideover'

export const slidOverInjectionKey: InjectionKey<ShallowRef<SlideoverState>> = Symbol('nuxt-ui.slideover')

function _useSlideover() {
  const slideoverState = inject(slidOverInjectionKey)

  const isOpen = ref(false)

  function open<T extends Component>(component: T, props?: Slideover & ComponentProps<T>) {
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
    slideoverState.value = {
      component: 'div',
      props: {}
    }
  }

  /**
   * Allows updating the slideover props
   */
  function patch<T extends Component = {}>(props: Partial<Slideover & ComponentProps<T>>) {
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
