import { nanoid } from 'nanoid'
import { Ref } from 'vue'
import { defineNuxtPlugin, useState } from '#app'
import { ToastNotification, ToastPlugin } from '../types/toast'

export default defineNuxtPlugin((nuxtApp) => {
  const notifications: Ref<ToastNotification[]> = useState('notifications', () => [])

  function addNotification (notification: Partial<ToastNotification>) {
    const body = {
      id: nanoid(),
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

  nuxtApp.provide('toast', {
    addNotification,
    removeNotification,
    success ({ title, description, timeout }: { title?: string, description?: string, timeout?: number } = {}) {
      addNotification({
        type: 'success',
        title,
        description,
        timeout
      })
    },
    error ({ title = 'An error occurred!', description, timeout }: { title?: string, description?: string, timeout?: number } = {}) {
      addNotification({
        type: 'error',
        title,
        description,
        timeout
      })
    }
  })
})

declare module '#app' {
  interface NuxtApp {
    $toast: ToastPlugin
  }
}
