import { defineNuxtPlugin, useState } from '#app'
import type { ToastNotification } from '../types'

export default defineNuxtPlugin(() => {
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

  return {
    provide: {
      toast: {
        addNotification,
        removeNotification,
        success (notification: Partial<ToastNotification> = {}) {
          return addNotification({ type: 'success', ...notification })
        },
        info (notification: Partial<ToastNotification> = {}) {
          return addNotification({ type: 'info', ...notification })
        },
        warning (notification: Partial<ToastNotification> = {}) {
          return addNotification({ type: 'warning', ...notification })
        },
        error (notification: Partial<ToastNotification>) {
          return addNotification({ type: 'error', title: 'An error occurred!', ...notification })
        }
      }
    }
  }
})
