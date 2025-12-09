export function useFrameworks() {
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
    onSelect: () => framework.value = 'vue'
  }].map(f => ({ ...f, active: framework.value === f.value })))

  return {
    framework,
    frameworks
  }
}
