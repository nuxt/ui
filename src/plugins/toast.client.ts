import { nanoid } from 'nanoid'
import { Ref } from 'vue'
import { Notification } from '../types'
import { defineNuxtPlugin, useState } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const notifications: Ref<Notification[]> = useState('notifications', () => [])

  function addNotification (notification: Partial<Notification>) {
    const body = {
      id: nanoid(),
      ...notification
    }

    const index = notifications.value.findIndex((n: Notification) => n.id === body.id)
    if (index === -1) {
      notifications.value.push(body as Notification)
    }

    return body
  }

  function removeNotification (id: string) {
    notifications.value = notifications.value.filter((n: Notification) => n.id !== id)
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
    $toast: object
  }
}
