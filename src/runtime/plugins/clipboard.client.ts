import { defineNuxtPlugin } from '#app'
import { useClipboard } from '@vueuse/core'
import { ClipboardPlugin } from '../types'

export default defineNuxtPlugin((nuxtApp) => {
  const { copy: copyToClipboard, isSupported } = useClipboard()

  function copy (text: string, success: { title?: string, description?: string } = {}, failure: { title?: string, description?: string } = {}) {
    if (!isSupported) {
      return
    }

    copyToClipboard(text).then(() => {
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
