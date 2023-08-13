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

  const branch = computed(() => branches.find(b => b.name === (route.path.startsWith('/dev') ? 'dev' : 'main')))

  const prefix = computed(() => `/${branch.value.name}`)

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
