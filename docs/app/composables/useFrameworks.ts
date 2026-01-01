export function useFrameworks() {
  const framework = useCookie('nuxt-ui-framework', { default: () => 'nuxt' })
  const { track } = useAnalytics()

  function setFramework(value: 'nuxt' | 'vue') {
    framework.value = value
    track('Framework Switched', { framework: value })
  }

  const frameworks = computed(() => [{
    label: 'Nuxt',
    icon: 'i-simple-icons-nuxtdotjs',
    value: 'nuxt',
    onSelect: () => setFramework('nuxt')
  }, {
    label: 'Vue',
    icon: 'i-simple-icons-vuedotjs',
    value: 'vue',
    onSelect: () => setFramework('vue')
  }].map(f => ({ ...f, active: framework.value === f.value })))

  return {
    framework,
    frameworks
  }
}
