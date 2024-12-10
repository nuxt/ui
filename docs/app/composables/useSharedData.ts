export function useSharedData() {
  const framework = useCookie('nuxt-ui-framework', { default: () => 'nuxt' })
  const frameworks = computed(() => [{
    label: 'Nuxt',
    icon: 'i-simple-icons-nuxtdotjs',
    value: 'nuxt',
    onSelect: () => framework.value = 'nuxt'
  }, {
    label: 'Vue',
    icon: 'i-simple-icons-vuedotjs',
    value: 'vue',
    disabled: module.value === 'ui-pro',
    onSelect: () => framework.value = 'vue'
  }].map(f => ({ ...f, active: framework.value === f.value })))

  const module = useCookie('nuxt-ui-module', { default: () => 'ui' })
  const modules = computed(() => [{
    label: 'UI',
    icon: 'i-lucide-box',
    value: 'ui',
    onSelect: () => module.value = 'ui'
  }, {
    label: 'UI Pro',
    icon: 'i-lucide-panels-top-left',
    value: 'ui-pro',
    disabled: framework.value === 'vue',
    onSelect: () => module.value = 'ui-pro'
  }].map(m => ({ ...m, active: module.value === m.value })))

  return {
    framework,
    frameworks,
    module,
    modules
  }
}
