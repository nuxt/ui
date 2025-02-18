import type { Component } from 'vue'
import { createSharedComposable } from '@vueuse/core'
import type { ComponentProps } from 'vue-component-type-helpers'

export type OverlayOptions<OverlayAttrs = Record<string, any>> = {
  defaultOpen?: boolean
  props?: OverlayAttrs
  destroyOnClose?: boolean
}

type ManagedOverlayOptionsPrivate<T extends Component> = {
  component?: T
  id: symbol
  isMounted: boolean
  modelValue: boolean
  resolvePromise?: (value: unknown) => void
}
export type Overlay = OverlayOptions<Component> & ManagedOverlayOptionsPrivate<Component>

interface OverlayInstance<T> {
  open: (props?: ComponentProps<T>) => Promise<any>
  close: (value?: any) => void
  patch: (props: Partial<ComponentProps<T>>) => void
}

function _useOverlay() {
  const overlays = shallowReactive<Overlay[]>([])

  const create = <T extends Component>(component: T, _options?: OverlayOptions<ComponentProps<T>>): OverlayInstance<T> => {
    const { props: props, defaultOpen, destroyOnClose } = _options || {}

    const options = reactive<Overlay>({
      id: Symbol(import.meta.dev ? 'useOverlay' : ''),
      modelValue: !!defaultOpen,
      component: markRaw(component!),
      isMounted: !!defaultOpen,
      destroyOnClose: !!destroyOnClose,
      props: props || {}
    })

    overlays.push(options)

    return {
      open: <T extends Component>(props?: ComponentProps<T>) => open(options.id, props),
      close: value => close(options.id, value),
      patch: <T extends Component>(props: Partial<ComponentProps<T>>) => patch(options.id, props)
    }
  }

  const open = <T extends Component>(id: symbol, props?: ComponentProps<T>): Promise<any> => {
    const overlay = getOverlay(id)

    // If props are provided, update the overlay's props
    if (props) {
      patch(overlay.id, props)
    }

    overlay.modelValue = true
    overlay.isMounted = true

    // Return a new promise that will be resolved when close is called
    return new Promise((resolve) => {
      overlay.resolvePromise = resolve
    })
  }

  const close = (id: symbol, value?: any): void => {
    const overlay = getOverlay(id)

    overlay.modelValue = false

    // Resolve the promise if it exists
    if (overlay.resolvePromise) {
      overlay.resolvePromise(value)
      overlay.resolvePromise = undefined
    }
  }

  const unMount = (id: symbol): void => {
    const overlay = getOverlay(id)

    overlay.isMounted = false

    if (overlay.destroyOnClose) {
      const index = overlays.findIndex(overlay => overlay.id === id)
      overlays.splice(index, 1)
    }
  }

  const patch = <T extends Component>(id: symbol, props: Partial<ComponentProps<T>>): void => {
    const overlay = getOverlay(id)

    Object.entries(props!).forEach(([key, value]) => {
      (overlay.props as any)[key] = value
    })
  }

  const getOverlay = (id: symbol): Overlay => {
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
