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

  const module = useCookie('nuxt-ui-module', { default: () => 'ui' })
  const modules = computed(() => [{
    label: 'nuxt/ui',
    value: 'ui',
    suffix: '@nuxt/ui',
    onSelect: () => module.value = 'ui'
  }, {
    label: 'nuxt/ui-pro',
    value: 'ui-pro',
    suffix: '@nuxt/ui-pro',
    onSelect: () => module.value = 'ui-pro'
  }].map(m => ({ ...m, active: module.value === m.value })))

  return {
    framework,
    frameworks,
    module,
    modules
  }
}

export const useSharedData = createSharedComposable(_useSharedData)
