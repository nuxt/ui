import { nanoid } from 'nanoid'
import { Ref } from 'vue'
import { defineNuxtPlugin, useState } from '#app'
import { ToastNotification, ToastPlugin } from '../../types'

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
    success ({ title, description }: { title?: string, description?: string } = {}) {
      addNotification({
        type: 'success',
        title,
        description,
        timeout: 4000
      })
    },
    error ({ title = 'An error occurred!', description }: { title?: string, description?: string } = {}) {
      addNotification({
        type: 'error',
        title,
        description,
        timeout: 4000
      })
    }
  })
})

declare module '#app' {
  interface NuxtApp {
    $toast: ToastPlugin
  }
}
