import { useClipboard } from '@vueuse/core'
import type { ToastNotification } from '../types/toast'
import { useToast } from './useToast'

export function useCopyToClipboard (options: Partial<ToastNotification> = {}) {
  const { copy: copyToClipboard, isSupported } = useClipboard()
  const toast = useToast()

  function copy (text: string, success: { title?: string, description?: string } = {}, failure: { title?: string, description?: string } = {}) {
    if (!isSupported) {
      return
    }

    copyToClipboard(text).then(() => {
      if (!success.title && !success.description) {
        return
      }

      toast.success({ ...success, ...options })
    }, function (e) {
      toast.error({
        ...failure,
        description: failure.description || e.message,
        ...options
      })
    })
  }

  return {
    copy
  }
}
