export const useContentSource = () => {
  const route = useRoute()
  const router = useRouter()
  const config = useRuntimeConfig().public

  const branches = computed(() => [{
    id: 'dev',
    name: 'dev',
    icon: 'i-heroicons-cube',
    suffix: 'dev',
    label: 'Edge',
    disabled: route.path.startsWith('/dev'),
    click: () => select({ name: 'dev' })
  }, {
    id: 'main',
    name: 'main',
    icon: 'i-heroicons-cube',
    suffix: 'latest',
    label: `v${config.version}`,
    disabled: !route.path.startsWith('/dev'),
    click: () => select({ name: 'main' })
  }])

  const branch = computed(() => branches.value.find(b => b.name === (route.path.startsWith('/dev') ? 'dev' : 'main')))

  function select (branch) {
    if (branch.name === 'dev') {
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
    branch,
    select
  }
}
