import type { ToastNotification } from '../types'
import { useState } from '#imports'

export function useToast () {
  const notifications = useState<ToastNotification[]>('notifications', () => [])

  function addNotification (notification: Partial<ToastNotification>) {
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

  function removeNotification (id: string) {
    notifications.value = notifications.value.filter((n: ToastNotification) => n.id !== id)
  }

  const success = (notification: Partial<ToastNotification> = {}) => addNotification({ type: 'success', ...notification })

  const info = (notification: Partial<ToastNotification> = {}) => addNotification({ type: 'info', ...notification })

  const warning = (notification: Partial<ToastNotification> = {}) => addNotification({ type: 'warning', ...notification })

  const error = (notification: Partial<ToastNotification>) => addNotification({ type: 'error', title: 'An error occurred!', ...notification })

  return {
    addNotification,
    removeNotification,
    success,
    info,
    warning,
    error
  }
}
