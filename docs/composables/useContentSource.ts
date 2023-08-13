import type { NavItem, ParsedContent } from '@nuxt/content/dist/runtime/types'

export const useContentSource = () => {
  const route = useRoute()
  const config = useRuntimeConfig().public

  const branches = [{
    name: 'dev',
    icon: 'i-heroicons-cube',
    suffix: 'dev',
    label: 'Edge'
  }, {
    name: 'main',
    icon: 'i-heroicons-cube',
    suffix: 'latest',
    label: `v${config.version}`
  }]

  const branch = useCookie<string>('branch', { default: () => process.dev ? 'dev' : 'main' })

  if (route.path.startsWith('/dev') && branch.value !== 'dev') {
    branch.value = 'dev'
  } else if (route.path.startsWith('/main') && branch.value !== 'main') {
    branch.value = 'main'
  }

  const prefix = computed(() => {
    const b = branches.find((b) => b.name === branch.value) || branches[0]

    return `/${b.name}`
  })

  function removePrefixFromNavigation (navigation: NavItem[]): NavItem[] {
    return navigation.map((link) => {
      const { _path, children, ...rest } = link

      return {
        ...rest,
        _path: route.path.startsWith(prefix.value) ? _path : _path.replace(new RegExp(`^${prefix.value}`, 'g'), ''),
        children: children?.length ? removePrefixFromNavigation(children) : undefined
      }
    })
  }

  function removePrefixFromFiles (files: ParsedContent[]) {
    return files.map((file) => {
      if (!file) {
        return
      }

      const { _path, ...rest } = file

      return {
        ...rest,
        _path: route.path.startsWith(prefix.value) ? _path : _path.replace(new RegExp(`^${prefix.value}`, 'g'), '')
      }
    })
  }

  return {
    branches,
    branch,
    prefix,
    removePrefixFromNavigation,
    removePrefixFromFiles
  }
}
