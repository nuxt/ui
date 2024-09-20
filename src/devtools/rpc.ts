import type { ComponentMeta } from 'vue-component-meta'
import { extendServerRpc, onDevToolsInitialized } from '@nuxt/devtools-kit'
import * as theme from '../theme'
import type { ModuleOptions } from '../module'
import { upperFirst, camelCase } from 'scule'

export type Component = {
  slug: string
  label: string
  props: ComponentMeta['props']
  slots: Record<string, string>
  variants: Record<string, any>
}

export interface ServerFunctions {
  getComponents: () => Promise<Array<Pick<Component, 'slug' | 'label'>>>
}

export interface ClientFunctions {

}

export function setupDevtoolsClient(options: ModuleOptions) {
  onDevToolsInitialized(async () => {
    const _rpc = extendServerRpc<ClientFunctions, ServerFunctions>('nuxt/ui/devtools', {
      async getComponents() {
        return Object.keys(theme).map(slug => ({
          slug,
          label: options.prefix + upperFirst(camelCase(slug)),
          slots: theme[slug]?.slots,
          variants: theme[slug]?.variants
        }))
      }
    })
  })
}
