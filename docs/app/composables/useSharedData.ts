import { createSharedComposable } from '@vueuse/core'

function _useSharedData() {
  const framework = useCookie('nuxt-ui-framework', { default: () => 'nuxt' })
  const frameworks = computed(() => [{
    label: 'Nuxt',
    icon: 'i-logos-nuxt-icon',
    value: 'nuxt',
    onSelect: () => framework.value = 'nuxt'
  }, {
    label: 'Vue',
    icon: 'i-logos-vue',
    value: 'vue',
    onSelect: () => framework.value = 'vue'
  }].map(f => ({ ...f, active: framework.value === f.value })))

  return {
    framework,
    frameworks
  }
}

export const useSharedData = createSharedComposable(_useSharedData)
