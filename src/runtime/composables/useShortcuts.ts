import { createSharedComposable, useActiveElement } from '@vueuse/core'
import { ref, computed, onMounted } from 'vue'
import type {} from '@vueuse/shared'

export const _useShortcuts = () => {
  const macOS = computed(() => process.client && navigator && navigator.userAgent && navigator.userAgent.match(/Macintosh;/))

  const metaSymbol = ref(' ')

  const activeElement = useActiveElement()
  const usingInput = computed(() => {
    const usingInput = !!(activeElement.value?.tagName === 'INPUT' || activeElement.value?.tagName === 'TEXTAREA' || activeElement.value?.contentEditable === 'true')

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
