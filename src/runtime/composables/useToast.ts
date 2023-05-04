import type { ToastNotification } from '../types'
import { useState } from '#imports'

export function useToast () {
  const notifications = useState<ToastNotification[]>('notifications', () => [])

  function add (notification: Partial<ToastNotification>) {
    const body = {
      id: new Date().getTime().toString(),
      ...notification
    }

    const index = notifications.value.findIndex((n: ToastNotification) => n.id === body.id)
    if (index === -1) {
      notifications.value.push(body as ToastNotification)
    }

    return body
  }

  function remove (id: string) {
    notifications.value = notifications.value.filter((n: ToastNotification) => n.id !== id)
  }

  return {
    add,
    remove
  }
}
