import { defineNuxtPlugin } from '#app'
import { ClipboardPlugin } from '../types/clipboard'

export default defineNuxtPlugin((nuxtApp) => {
  function copy (text: string, success: { title?: string, description?: string } = {}, failure: { title?: string, description?: string } = {}) {
    if (!navigator?.clipboard) {
      return
    }

    navigator.clipboard.writeText(text).then(() => {
      if (!success.title && !success.description) {
        return
      }

      nuxtApp.$toast.success(success)
    }, function (e) {
      nuxtApp.$toast.error({
        ...failure,
        description: failure.description || e.message
      })
    })
  }

  nuxtApp.provide('clipboard', {
    copy
  })
})

declare module '#app' {
  interface NuxtApp {
    $clipboard: ClipboardPlugin
  }
}
