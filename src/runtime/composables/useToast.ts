import { useState } from '#imports'
import type { ToastProps } from '../types'

export interface Toast extends Omit<ToastProps, 'defaultOpen'> {
  id: string | number
  click?: (toast: Toast) => void
}

export function useToast() {
  const toasts = useState<Toast[]>('toasts', () => [])

  function add(toast: Partial<Toast>): Toast {
    const body = {
      id: new Date().getTime().toString(),
      open: true,
      ...toast
    }

    const index = toasts.value.findIndex((t: Toast) => t.id === body.id)
    if (index === -1) {
      toasts.value.push(body)
    }

    toasts.value = toasts.value.slice(-5)

    return body
  }

  function update(id: string | number, toast: Omit<Partial<Toast>, 'id'>) {
    const index = toasts.value.findIndex((t: Toast) => t.id === id)
    if (index !== -1) {
      toasts.value[index] = {
        ...toasts.value[index] as Toast,
        ...toast
      }
    }
  }

  function remove(id: string | number) {
    const index = toasts.value.findIndex((t: Toast) => t.id === id)
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

  return {
    toasts,
    add,
    update,
    remove,
    clear
  }
}
