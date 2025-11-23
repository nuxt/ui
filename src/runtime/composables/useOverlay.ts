import type { Component } from 'vue'
import { reactive, markRaw, shallowReactive } from 'vue'
import { createSharedComposable } from '@vueuse/core'
import type { ComponentProps, ComponentEmit } from 'vue-component-type-helpers'
import { kebabCase } from 'scule'

/**
 * Workaround for TypeScript limitation with overloaded functions in conditional types.
 *
 * TypeScript's conditional types infer from the last overload only when matching overloaded functions.
 * These utilities extract the union of all event names and their corresponding arguments from ComponentEmit<T>'s overloads.
 *
 * @see https://github.com/microsoft/TypeScript/issues/32164
 */
type OverloadUnion<T> = T extends {
  (...args: infer A1): any
  (...args: infer A2): any
  (...args: infer A3): any
  (...args: infer A4): any
} ? A1[0] | A2[0] | A3[0] | A4[0] : T extends {
  (...args: infer A1): any
  (...args: infer A2): any
  (...args: infer A3): any
} ? A1[0] | A2[0] | A3[0] : T extends {
  (...args: infer A1): any
  (...args: infer A2): any
} ? A1[0] | A2[0] : T extends (...args: infer A1) => any ? A1[0] : never

type OverloadArgs<T, K> = T extends {
  (event: K, ...args: infer A1): any
  (...args: any[]): any
  (...args: any[]): any
  (...args: any[]): any
} ? A1 : T extends {
    (event: K, ...args: infer A1): any
    (...args: any[]): any
    (...args: any[]): any
  } ? A1 : T extends {
      (event: K, ...args: infer A1): any
      (...args: any[]): any
    } ? A1 : T extends (event: K, ...args: infer A1) => any ? A1 : never

type EmitKeys<T> = OverloadUnion<ComponentEmit<T>>
type EmitArgs<T, K> = OverloadArgs<ComponentEmit<T>, K>

/**
 * This is a workaround for a design limitation in TypeScript.
 *
 * Conditional types only match the last function overload, not a union of all possible
 * parameter types. This workaround forces TypeScript to properly extract the 'close'
 * event argument type from component emits with multiple event signatures.
 *
 * @see https://github.com/microsoft/TypeScript/issues/32164
 */
type CloseEventArgType<T> = T extends {
  (event: 'close', arg_0: infer Arg, ...args: any[]): void
  (...args: any[]): void
  (...args: any[]): void
  (...args: any[]): void
  (...args: any[]): void
  (...args: any[]): void
  (...args: any[]): void
  (...args: any[]): void
  (...args: any[]): void
  (...args: any[]): void
  (...args: any[]): void
  (...args: any[]): void
  (...args: any[]): void
  (...args: any[]): void
  (...args: any[]): void
  (...args: any[]): void
  (...args: any[]): void
} ? Arg : never
export type OverlayOptions<OverlayAttrs = Record<string, any>> = {
  defaultOpen?: boolean
  props?: Partial<OverlayAttrs>
  destroyOnClose?: boolean
}

interface ManagedOverlayOptionsPrivate<T extends Component> {
  component?: T
  id: symbol
  isMounted: boolean
  isOpen: boolean
  emits?: Record<string, (...args: any[]) => unknown>
  originalProps?: ComponentProps<T>
  resolvePromise?: (value: any) => void
}
export type Overlay = OverlayOptions<Component> & ManagedOverlayOptionsPrivate<Component>

type OverlayInstance<T extends Component> = Omit<ManagedOverlayOptionsPrivate<T>, 'component' | 'emits'> & {
  id: symbol
  open: (props?: ComponentProps<T>) => OpenedOverlay<T>
  close: (value?: any) => void
  patch: (props: Partial<ComponentProps<T>>) => void
  on<K extends EmitKeys<T>>(event: K, callback: (...args: EmitArgs<T, K>) => void): void
}

type OpenedOverlay<T extends Component> = Omit<OverlayInstance<T>, 'open' | 'close' | 'onClose' | 'patch' | 'modelValue' | 'resolvePromise' | 'on'> & {
  result: Promise<CloseEventArgType<ComponentEmit<T>>>
} & Promise<CloseEventArgType<ComponentEmit<T>>>

function warnOnListeningEmitsFromProps(props?: Record<string, any>) {
  const emitRegex = /^on([A-Z][a-zA-Z]*)$/
  const listeningEmits = Object.keys(props || {}).reduce<string[]>((acc, propName) => {
    if (emitRegex.test(propName)) {
      acc.push(propName.match(emitRegex)![1]!)
    }
    return acc
  }, [])

  if (listeningEmits.length > 0) {
    listeningEmits.forEach(emit => console.warn(`[@nuxt/ui] Usage of on${emit} as prop is deprecated. Please consider using on('${kebabCase(emit)}', callback) instead.`))
  }
}

function _useOverlay() {
  const overlays = shallowReactive<Overlay[]>([])

  const create = <T extends Component>(component: T, _options?: OverlayOptions<ComponentProps<T>>): OverlayInstance<T> => {
    const { props, defaultOpen, destroyOnClose } = _options || {}

    warnOnListeningEmitsFromProps(props)

    const id = Symbol(import.meta.dev ? 'useOverlay' : '')

    const options = reactive<Overlay>({
      id,
      isOpen: !!defaultOpen,
      component: markRaw(component!),
      isMounted: !!defaultOpen,
      destroyOnClose: !!destroyOnClose,
      originalProps: props || {},
      emits: {
        close: (value: unknown) => close(id, value)
      },
      props: { ...props }
    })

    overlays.push(options)

    return {
      ...options,
      open: <T extends Component>(props?: ComponentProps<T>) => open(options.id, props),
      close: value => close(options.id, value),
      patch: <T extends Component>(props: Partial<ComponentProps<T>>) => patch(options.id, props),
      on: <T extends Component, K extends EmitKeys<T>>(event: K, callback: (...args: EmitArgs<T, K>) => void): void => on(options.id, event, callback)
    }
  }

  const open = <T extends Component>(id: symbol, props?: ComponentProps<T>): OpenedOverlay<T> => {
    const overlay = getOverlay(id)

    // If props are provided, merge them with the original props, otherwise use the original props
    if (props) {
      overlay.props = { ...overlay.originalProps, ...props }
    } else {
      overlay.props = { ...overlay.originalProps }
    }

    overlay.isOpen = true
    overlay.isMounted = true
    const result = new Promise<any>(resolve => overlay.resolvePromise = resolve)

    return Object.assign(result, {
      id,
      isMounted: overlay.isMounted,
      isOpen: overlay.isOpen,
      result
    })
  }

  const close = (id: symbol, value?: any): void => {
    const overlay = getOverlay(id)

    overlay.isOpen = false

    // Resolve the promise if it exists
    if (overlay.resolvePromise) {
      overlay.resolvePromise(value)
      overlay.resolvePromise = undefined
    }
  }

  const closeAll = (): void => {
    overlays.forEach(overlay => close(overlay.id))
  }

  const unmount = (id: symbol): void => {
    const overlay = getOverlay(id)

    overlay.isMounted = false

    if (overlay.destroyOnClose) {
      const index = overlays.findIndex(overlay => overlay.id === id)
      overlays.splice(index, 1)
    }
  }

  const patch = <T extends Component>(id: symbol, props: Partial<ComponentProps<T>>): void => {
    const overlay = getOverlay(id)

    overlay.props = { ...overlay.props, ...props }
  }

  const getOverlay = (id: symbol): Overlay => {
    const overlay = overlays.find(overlay => overlay.id === id)

    if (!overlay) {
      throw new Error('Overlay not found')
    }

    return overlay
  }

  const isOpen = (id: symbol): boolean => {
    const overlay = getOverlay(id)

    return overlay.isOpen
  }

  function on<T extends Component, K extends EmitKeys<T>>(
    id: symbol,
    event: K,
    callback: (...args: EmitArgs<T, K>) => void
  ): void {
    const overlay = getOverlay(id)

    if (!overlay.emits) overlay.emits = {}
    overlay.emits[event as string] = callback
  }

  return {
    overlays,
    create,
    on,
    open,
    close,
    closeAll,
    patch,
    unmount,
    isOpen
  }
}

export const useOverlay = /* @__PURE__ */ createSharedComposable(_useOverlay)
