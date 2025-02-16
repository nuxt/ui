import type { Component } from 'vue'
import { createSharedComposable } from '@vueuse/core'
import type { ComponentProps } from 'vue-component-type-helpers'

// Allows for additional props to be passed to the overlay
type WithExtendableAttrs<T, Additional = Record<string, any>> = Partial<ComponentProps<T> | Additional>

export type ManagedOverlayOptions<OverlayAttrs = Record<string, any>> = {
  defaultOpen?: boolean
  attrs?: OverlayAttrs
  destroyOnClose?: boolean
}

type ManagedOverlayOptionsPrivate<T extends Component> = {
  component?: T
  id: symbol
  isMounted: boolean
  modelValue: boolean
  resolvePromise?: (value: unknown) => void
}
export type Overlay = ManagedOverlayOptions<Component> & ManagedOverlayOptionsPrivate<Component>

function _useOverlay() {
  const overlays: Overlay[] = shallowReactive([])

  const create = <T extends Component>(component: T, _options?: ManagedOverlayOptions<WithExtendableAttrs<T>>) => {
    const { attrs, defaultOpen, destroyOnClose } = _options || {}

    const options = reactive<Overlay>({
      id: Symbol(import.meta.dev ? 'useOverlay' : ''),
      modelValue: !!defaultOpen,
      component: markRaw(component!),
      isMounted: !!defaultOpen,
      destroyOnClose: !!destroyOnClose,
      attrs: attrs || {}
    })

    overlays.push(options)

    return {
      open: <T extends Component>(attrs?: WithExtendableAttrs<T>) => open(options.id, attrs),
      close: () => close(options.id),
      patch: <T extends Component>(attrs: WithExtendableAttrs<T>) => patch(options.id, attrs)
    }
  }

  const open = <T extends Component>(id: symbol, attrs?: WithExtendableAttrs<T>): Promise<any> => {
    const overlay = getOverlay(id)

    // If attrs are provided, update the overlay's attrs
    if (attrs) {
      patch(overlay.id, attrs)
    }

    overlay.modelValue = true
    overlay.isMounted = true

    // Return a new promise that will be resolved when close is called
    return new Promise((resolve) => {
      overlay.resolvePromise = resolve
    })
  }

  const close = (id: symbol, value?: any) => {
    const overlay = getOverlay(id)

    overlay.modelValue = false

    // Resolve the promise if it exists
    if (overlay.resolvePromise) {
      overlay.resolvePromise(value)
      overlay.resolvePromise = undefined
    }
  }

  const unMount = (id: symbol) => {
    const overlay = getOverlay(id)

    overlay.isMounted = false

    if (overlay.destroyOnClose) {
      const index = overlays.findIndex(overlay => overlay.id === id)
      overlays.splice(index, 1)
    }
  }

  const patch = <T extends Component>(id: symbol, attrs: ManagedOverlayOptions<T>['attrs']) => {
    const overlay = getOverlay(id)

    Object.entries(attrs!).forEach(([key, value]) => {
      (overlay.attrs as any)[key] = value
    })

    return attrs
  }

  const getOverlay = (id: symbol) => {
    const overlay = overlays.find(overlay => overlay.id === id)

    if (!overlay) {
      throw new Error('Overlay not found')
    }

    return overlay
  }

  return {
    overlays,
    open,
    close,
    create,
    patch,
    unMount
  }
}

export const useOverlay = createSharedComposable(_useOverlay)
