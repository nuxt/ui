import { createSharedComposable, useActiveElement } from '@vueuse/core'
import { ref, computed, onMounted } from 'vue'
import type {} from '@vueuse/shared'

export const _useShortcuts = () => {
  const macOS = computed(() => import.meta.client && navigator && navigator.userAgent && navigator.userAgent.match(/Macintosh;/))

  const metaSymbol = ref(' ')

  const activeElement = useActiveElement()
  const usingInput = computed(() => {
    const tagName = activeElement.value?.tagName
    const contentEditable = activeElement.value?.contentEditable

    const usingInput = !!(tagName === 'INPUT' || tagName === 'TEXTAREA' || contentEditable === 'true' || contentEditable === 'plaintext-only')

    if (usingInput) {
      return ((activeElement.value as any)?.name as string) || true
    }

    return false
  })

  onMounted(() => {
    metaSymbol.value = macOS.value ? '⌘' : 'Ctrl'
  })

  return {
    macOS,
    metaSymbol,
    activeElement,
    usingInput
  }
}

export const useShortcuts = createSharedComposable(_useShortcuts)
