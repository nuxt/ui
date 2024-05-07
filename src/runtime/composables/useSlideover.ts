import { inject } from 'vue'
import type { ShallowRef, Component, InjectionKey } from 'vue'
import { createSharedComposable } from '@vueuse/core'
import type { ComponentProps } from '../types/component'
import type { Slideover, SlideoverState } from '../types/slideover'

export const slidOverInjectionKey: InjectionKey<ShallowRef<SlideoverState[]>> = Symbol('nuxt-ui.slideover')

function _useSlideover () {
  const slideovers = inject(slidOverInjectionKey)

  function open<T extends Component> (component: T, props?: Slideover & ComponentProps<T>) {
    if (!slideovers) {
      throw new Error('useSlideover() is called without provider')
    }
    
    const instance = createInstance(component, props)

    slideovers.value = [
      ...slideovers.value,
      instance.state
    ]

    return instance
  }

  async function close (id: number) {
    const slideoverState = slideovers.value.find((slideover) => slideover.id === id)
    
    if (!slideoverState) return

    slideoverState.isOpen = false
    
    slideovers.value = [
      ...slideovers.value.filter((slideover) => slideover.id !== id),
      {
        ...slideoverState,        
        isOpen: false      
      }
    ]
  }

  function reset (id: number) {     
    slideovers.value = slideovers.value.filter((slideover) => slideover.id !== id)    
  }

  /**
   * Allows updating the slideover props
   */
  function patch<T extends Component = {}> (id: number, props: Partial<Slideover & ComponentProps<T>>) {
    const slideoverState = slideovers.value.find((slideover) => slideover.id === id)

    if (!slideoverState) return

    slideovers.value = [
      ...slideovers.value.filter((slideover) => slideover.id !== id),
      {
        ...slideoverState,
        ...props
      }
    ]
  }

  function createInstance<T extends Component> (component: T, props?: Slideover & ComponentProps<T>) {
    // Random short id
    const id = Math.floor(Math.random() * 1000000)

    return {
      state: {
        id,
        isOpen: true,
        component,
        props: props ?? {}
      },
      reset: () => {
        console.log('reset instance')
      },
      close: () => close(id),    
      patch: (props: Partial<Slideover & ComponentProps<T>>) => patch(id, props)
    
  }
}

  return {
    open,
    close,
    reset,
    patch
    
  }
}

export const useSlideover = createSharedComposable(_useSlideover)
