import { useClipboard } from '@vueuse/core'
import { useToast } from './useToast'

export function useCopyToClipboard () {
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

      toast.success(success)
    }, function (e) {
      toast.error({
        ...failure,
        description: failure.description || e.message
      })
    })
  }

  return {
    copy
  }
}
