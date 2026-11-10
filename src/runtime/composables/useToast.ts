import type { Ref, InjectionKey } from 'vue'
import { ref, nextTick, inject } from 'vue'
import { useState, useAppConfig } from '#imports'
import type { ToastProps, ToastEmits } from '../components/Toast.vue'
import type { EmitsToProps } from '../types/utils'

export const toastMaxInjectionKey: InjectionKey<Ref<number | undefined>> = Symbol('nuxt-ui.toast-max')

export interface Toast extends Omit<ToastProps, 'defaultOpen'>, EmitsToProps<ToastEmits> {
  id: string | number
  onClick?: (toast: Toast) => void
  /** @internal */
  _duplicate?: number
  /** @internal */
  _updated?: boolean
  /** @internal */
  _animatedAt?: number
}

export type ToastPromiseState = string | Omit<Partial<Toast>, 'id'>

export interface ToastPromiseOptions<T> {
  /**
   * The toast displayed while the promise is pending. It shows `appConfig.ui.icons.loading` and stays open until the promise settles.
   */
  loading?: string | Partial<Toast>
  /**
   * The toast displayed when the promise resolves. The toast closes when omitted.
   */
  success?: ToastPromiseState | ((data: T) => ToastPromiseState)
  /**
   * The toast displayed when the promise rejects. The toast closes when omitted.
   */
  error?: ToastPromiseState | ((error: unknown) => ToastPromiseState)
}

// Matches the slide-in and pulse animation durations in the `toaster` theme.
const ANIMATION_DURATION = 200

export function useToast() {
  const toasts = useState<Toast[]>('toasts', () => [])
  const max = inject(toastMaxInjectionKey, undefined)
  const appConfig = useAppConfig()

  const running = ref(false)
  const queue: Toast[] = []

  const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

  function mergeDuplicate(index: number, toast: Toast) {
    const existing = toasts.value[index] as Toast
    const now = Date.now()
    // The pulse replaces the slide-in, and two pulses in the same tick cancel each other out, so skip it while the toast is still animating.
    const animating = now - (existing._animatedAt || 0) < ANIMATION_DURATION

    toasts.value[index] = {
      ...existing,
      ...toast,
      _duplicate: animating ? existing._duplicate : (existing._duplicate || 0) + 1,
      _animatedAt: animating ? existing._animatedAt : now
    }
  }

  async function processQueue() {
    if (running.value || queue.length === 0) {
      return
    }

    running.value = true

    while (queue.length > 0) {
      await nextTick()

      const toast = queue.shift()!
      const maxValue = max?.value ?? 5
      if (maxValue <= 0) {
        if (toasts.value.length) {
          toasts.value = []
        }
        continue
      }

      // Dedupe at display time so duplicate ids merge no matter which `useToast()` instance queued them.
      const existingIndex = toasts.value.findIndex((t: Toast) => t.id === toast.id)
      if (existingIndex !== -1) {
        mergeDuplicate(existingIndex, toast)
        continue
      }

      toasts.value = [...toasts.value, { ...toast, _animatedAt: Date.now() }].slice(-maxValue)
    }

    running.value = false
  }

  function add(toast: Partial<Toast>): Toast {
    const body = {
      id: generateId(),
      open: true,
      ...toast
    } as Toast

    const existingIndex = toasts.value.findIndex((t: Toast) => t.id === body.id)
    if (existingIndex !== -1) {
      mergeDuplicate(existingIndex, body)

      return body
    }

    queue.push(body)

    processQueue()

    return body
  }

  function update(id: string | number, toast: Omit<Partial<Toast>, 'id'>) {
    const index = toasts.value.findIndex((t: Toast) => t.id === id)
    if (index !== -1) {
      toasts.value[index] = {
        ...toasts.value[index] as Toast,
        ...toast,
        duration: toast.duration,
        open: true,
        _updated: true
      }

      nextTick(() => {
        const i = toasts.value.findIndex((t: Toast) => t.id === id)
        if (i !== -1 && toasts.value[i]!._updated) {
          toasts.value[i] = {
            ...toasts.value[i] as Toast,
            _updated: undefined
          }
        }
      })
    }
  }

  function remove(id: string | number) {
    const index = toasts.value.findIndex((t: Toast) => t.id === id)
    if (index !== -1 && toasts.value[index]!._updated) {
      return
    }

    if (index !== -1) {
      toasts.value[index] = {
        ...toasts.value[index] as Toast,
        open: false
      }
    }

    setTimeout(() => {
      toasts.value = toasts.value.filter((t: Toast) => t.id !== id)
    }, 200)
  }

  function clear() {
    toasts.value = []
  }

  function promise<T>(promise: Promise<T>, options: ToastPromiseOptions<T>): Promise<T> {
    const loading = resolveState(options.loading)
    const icon = loading.ui?.icon
    const toast = add({
      icon: appConfig.ui.icons.loading,
      duration: 0,
      ...loading,
      ui: { ...loading.ui, icon: typeof icon === 'function' ? (defaults: string) => ['animate-spin', icon(defaults)] : ['animate-spin', icon] }
    })

    function close() {
      // The toast is still waiting in the queue when the promise settles in the same tick.
      const index = queue.findIndex(t => t.id === toast.id)
      if (index !== -1) {
        queue.splice(index, 1)
      } else {
        remove(toast.id)
      }
    }

    function settle(state: ToastPromiseOptions<T>['success' | 'error'], value: any) {
      if (state === undefined) {
        close()
        return
      }

      let resolved: Partial<Toast>
      try {
        resolved = resolveState(typeof state === 'function' ? state(value) : state)
      } catch (error) {
        // Don't leave the loading toast open forever, the error still surfaces as an unhandled rejection.
        close()
        throw error
      }

      // Reset what the loading state set, a field the settled state doesn't pass would otherwise keep its loading value.
      const body = { icon: undefined, duration: undefined, ui: loading.ui, ...resolved }

      const queued = queue.find(t => t.id === toast.id)
      if (queued) {
        Object.assign(queued, body)
        return
      }

      // Skip a toast that was dismissed while loading.
      if (toasts.value.find(t => t.id === toast.id)?.open) {
        update(toast.id, body)
      }
    }

    promise.then(value => settle(options.success, value), error => settle(options.error, error))

    return promise
  }

  return {
    toasts,
    add,
    update,
    remove,
    clear,
    promise
  }
}

function resolveState(state?: ToastPromiseState): Partial<Toast> {
  return typeof state === 'string' ? { title: state } : { ...state }
}
