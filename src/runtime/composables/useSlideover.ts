import { inject } from 'vue'
import type { ShallowRef, Component, InjectionKey } from 'vue'
import { createSharedComposable } from '@vueuse/core'
import type { ComponentProps } from '../types/component'
import type { Slideover, SlideoverInstance } from '../types/slideover'

export const slidOverInjectionKey: InjectionKey<ShallowRef<SlideoverInstance<any>[]>> = Symbol('nuxt-ui.slideover')

function _useSlideover () {
  const slideoverInstances = inject(slidOverInjectionKey)

  function open<T extends Component> (component: T, props?: Slideover & ComponentProps<T>) {
    if (!slideoverInstances) {
      throw new Error('useSlideover() is called without provider')
    }

    const instance = createInstance(component, props)

    slideoverInstances.value = [
      ...slideoverInstances.value,
      instance
    ]

    return instance
  }

  function close (id: number) {
    const slideoverInstance = slideoverInstances.value.find((slideover) => slideover.id === id)

    if (!slideoverInstance) return

    slideoverInstance.isOpen = false

    slideoverInstances.value = [
      ...slideoverInstances.value.filter((slideover) => slideover.id !== id),
      slideoverInstance
    ]
  }

  function remove (id: number) {
    slideoverInstances.value = slideoverInstances.value.filter((slideover) => slideover.id !== id)
  }

  /**
   * Allows updating the slideover props
   */
  function patch<T extends Component = {}> (id: number, props: Partial<Slideover & ComponentProps<T>>) {
    const slideoverInstance = slideoverInstances.value.find((slideover) => slideover.id === id)

    if (!slideoverInstance) return

    slideoverInstances.value = [
      ...slideoverInstances.value.filter((slideover) => slideover.id !== id),
      {
        ...slideoverInstance,
        props: {
          ...slideoverInstance.props,
          ...props
        }
      }
    ]
  }

  function createInstance<T extends Component> (component: T, props?: Slideover & ComponentProps<T>): SlideoverInstance<ComponentProps<T>> {
    // Random short id
    const id = Math.floor(Math.random() * 1000000)

    return {
        id,
        isOpen: true,
        component,
        props: {
          ...props,
          onClose () {
            props?.onClose?.()
            close(id)
          }
        },
        patch: (props) => patch(id, props),
        close: () => close(id)
      }
}

  return {
    open,
    close,
    remove,
    patch
  }
}

export const useSlideover = createSharedComposable(_useSlideover)
