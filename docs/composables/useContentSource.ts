export const useContentSource = () => {
  const route = useRoute()
  const config = useRuntimeConfig().public

  const branches = computed(() => [{
    id: 'main',
    name: 'main',
    label: 'nuxt/ui',
    icon: 'i-heroicons-cube',
    suffix: `v${config.version}`,
    to: '/getting-started'
  }, {
    id: 'dev',
    name: 'dev',
    label: 'nuxt/ui-edge',
    icon: 'i-heroicons-cube-transparent',
    suffix: 'dev',
    to: '/dev/getting-started'
  }, {
    id: 'pro',
    name: 'pro',
    label: 'nuxt/ui-pro',
    icon: 'i-heroicons-cube',
    suffix: `v${config.proVersion}`,
    to: '/pro/getting-started'
  }, {
    id: 'pro-edge',
    name: 'pro-edge',
    label: 'nuxt/ui-pro-edge',
    icon: 'i-heroicons-cube-transparent',
    suffix: 'dev',
    disabled: true
  }])

  const branch = computed(() => branches.value.find(b => b.name === (route.path.startsWith('/dev') ? 'dev' : route.path.startsWith('/pro') ? 'pro' : 'main')))

  return {
    branches,
    branch
  }
}
