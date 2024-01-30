import pkg from '@nuxt/ui-pro/package.json'

export const useContentSource = () => {
  const route = useRoute()
  const router = useRouter()
  const config = useRuntimeConfig().public

  const branches = computed(() => [{
    id: 'main',
    name: 'main',
    label: 'nuxt/ui',
    icon: 'i-heroicons-cube',
    suffix: `v${config.version}`,
    click: () => select({ name: 'main' })
  }, {
    id: 'dev',
    name: 'dev',
    label: 'nuxt/ui-edge',
    icon: 'i-heroicons-cube-transparent',
    suffix: 'dev',
    click: () => select({ name: 'dev' })
  }, {
    id: 'pro',
    name: 'pro',
    label: 'nuxt/ui-pro',
    icon: 'i-heroicons-cube',
    suffix: `v${pkg.version.split('-')[0]}`,
    click: () => select({ name: 'pro' })
  }, {
    id: 'pro-edge',
    name: 'pro-edge',
    label: 'nuxt/ui-pro-edge',
    icon: 'i-heroicons-cube-transparent',
    suffix: 'dev',
    disabled: true,
    click: () => select({ name: 'pro-dev' })
  }])

  const branch = computed(() => branches.value.find(b => b.name === (route.path.startsWith('/dev') ? 'dev' : route.path.startsWith('/pro') ? 'pro' : 'main')))

  function select (b) {
    if (b.name === branch.value.name) {
      return
    }

    if (b.name === 'pro') {
      router.push('/pro/getting-started')
      return
    }

    if (branch.value.name === 'pro') {
      if (b.name === 'dev') {
        router.push('/dev/getting-started')
      } else {
        router.push('/getting-started')
      }

      return
    }

    if (b.name === 'dev') {
      if (route.path.startsWith('/dev')) {
        return
      }

      router.push(`/dev${route.path}`)
    } else {
      router.push(route.path.replace('/dev', ''))
    }
  }

  return {
    branches,
    branch
  }
}
