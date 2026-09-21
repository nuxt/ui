import { config } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import type { AxeCore } from 'vitest-axe'

function isInstalled(name: string) {
  return config.plugins.VueWrapper.installedPlugins.some(({ options }) => options?._name === name)
}

export function installVueWrapperAxePlugin() {
  const PLUGIN_NAME = 'vue-wrapper-axe-plugin'

  if (isInstalled(PLUGIN_NAME)) {
    return
  }

  config.plugins.VueWrapper.install((wrapper): VueWrapperAxe => {
    function attachIfDetached(element: Element) {
      if (document.body.contains(element)) {
        return () => {}
      }

      const parent = element.parentElement
      const nextSibling = element.nextSibling
      document.body.append(element)

      return () => {
        if (parent) {
          parent.insertBefore(element, nextSibling)
        } else {
          element.remove()
        }
      }
    }

    return {
      axe: async (options = {}) => {
        const cleanup = attachIfDetached(wrapper.element)
        return axe(wrapper.element, options).finally(cleanup)
      }
    }
  }, { name: PLUGIN_NAME })
}

interface VueWrapperAxe {
  axe: (options?: AxeCore.RunOptions) => Promise<AxeCore.AxeResults>
}

declare module '@vue/test-utils' {
  export interface VueWrapper extends VueWrapperAxe {}
}
