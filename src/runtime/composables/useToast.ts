import type { Notification } from '../types'
import { useState } from '#imports'

export function useToast () {
  const notifications = useState<Notification[]>('notifications', () => [])

  function add (notification: Partial<Notification>) {
    const body = {
      id: new Date().getTime().toString(),
      ...notification
    }

    const index = notifications.value.findIndex((n: Notification) => n.id === body.id)
    if (index === -1) {
      notifications.value.push(body as Notification)
    }

    return body
  }

  function remove (id: string) {
    notifications.value = notifications.value.filter((n: Notification) => n.id !== id)
  }

  return {
    add,
    remove
  }
}
