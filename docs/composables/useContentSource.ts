import type { NavItem, ParsedContent } from '@nuxt/content/dist/runtime/types'

export const useContentSource = () => {
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

  const branch = useCookie('branch', { default: () => 'main' })

  const prefix = computed(() => {
    const b = branches.find((b) => b.name === branch.value) || branches[0]

    return `/${b.name}`
  })

  function removePrefixFromNavigation (navigation: NavItem[]): NavItem[] {
    return navigation.map((link) => {
      const { _path, children, ...rest } = link

      return {
        ...rest,
        _path: _path.replace(prefix.value, ''),
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
        _path: _path.replace(prefix.value, '')
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
