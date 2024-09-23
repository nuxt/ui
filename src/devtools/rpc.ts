import type { ComponentMeta } from 'vue-component-meta'
import { extendServerRpc, onDevToolsInitialized } from '@nuxt/devtools-kit'
import * as theme from '../theme'
import type { ModuleOptions } from '../module'
import { upperFirst, camelCase } from 'scule'
import type { Nuxt } from '@nuxt/schema'

export type Component = {
  slug: string
  label: string
  slots: Record<string, string>
  variants: Record<string, any>
  defaultVariants: Record<string, any>
  meta: ComponentMeta
}

export interface ServerFunctions {
  getComponents: () => Promise<Array<Component>>
}

export interface ClientFunctions {

}

export function setupDevtoolsClient(options: ModuleOptions, nuxt: Nuxt) {
  onDevToolsInitialized(async () => {
    const _rpc = extendServerRpc<ClientFunctions, ServerFunctions>('nuxt/ui/devtools', {
      async getComponents() {
        return await Promise.all(Object.keys(theme).map(async (slug) => {
          const label = options.prefix + upperFirst(camelCase(slug))

          // TODO: Properly configure the host
          return fetch(`http://localhost:3000/api/component-meta/${label}.json`).then(async (resp) => {
            const template = typeof (theme as any)[slug] === 'function' ? (theme as any)[slug](options) : theme
            const data = await resp.json()
            return {
              slug,
              label,
              slots: Array.isArray(template.slots) ? template.slots.join(' ') : template.slots,
              variants: template.variants,
              defaultVariants: template.defaultVariants,
              meta: data?.meta
            }
          })
        }))
      }
    })
  })
}
