import pkg from '../../ui-pro2/package.json'

export function useModule() {
  const config = useRuntimeConfig().public

  const modules = [{
    label: 'nuxt/ui',
    icon: 'i-heroicons-cube-transparent',
    suffix: `v${config.version}`,
    value: 'ui'
    }, {
    label: 'nuxt/ui-pro',
    icon: 'i-heroicons-cube-transparent',
    suffix: `v${pkg.version.split('-')[0]}`,
    value: 'ui-pro'
  }]

  const module = useCookie<string>('module', { default: () => modules[0].value })

  return {
    module,
    modules
  }
}
