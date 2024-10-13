import type { ComponentMeta } from 'vue-component-meta'
import { extendServerRpc, onDevToolsInitialized } from '@nuxt/devtools-kit'
import * as theme from '../theme'
import type { ModuleOptions } from '../module'
import { upperFirst, camelCase, kebabCase } from 'scule'
import type { DevtoolsMeta } from './extendComponentMeta'

export type Component = {
  slug: string
  label: string
  slots: Record<string, string>
  variants: Record<string, any>
  defaultVariants: Record<string, any>
  meta?: ComponentMeta & { devtools: DevtoolsMeta<any> }
}

export interface ServerFunctions {
  getComponents: () => Promise<Array<Omit<Component, 'meta'>>>
}

export interface ClientFunctions {

}

export function setupDevtoolsClient(options: ModuleOptions) {
  onDevToolsInitialized(async () => {
    const _rpc = extendServerRpc<ClientFunctions, ServerFunctions>('nuxt/ui/devtools', {
      async getComponents() {
        return Object.keys(theme).map((name) => {
          const slug = kebabCase(name)
          const camelName = camelCase(name)
          const label = options.prefix + upperFirst(camelCase(slug))
          const template = typeof (theme as any)[camelName] === 'function' ? (theme as any)[camelName](options) : theme

          return {
            slug,
            label,
            slots: Array.isArray(template.slots) ? template.slots.join(' ') : template.slots,
            variants: template.variants,
            defaultVariants: template.defaultVariants
          }
        })
      }
    })
  })
}
