import type { ComponentMeta } from 'vue-component-meta'
import { extendServerRpc, onDevToolsInitialized } from '@nuxt/devtools-kit'
import * as theme from '../theme'
import type { ModuleOptions } from '../module'
import { upperFirst, camelCase, kebabCase } from 'scule'
import defu from 'defu'

export type Component = {
  slug: string
  label: string
  slots: Record<string, string>
  variants: Record<string, any>
  defaultVariants: Record<string, any>
  meta: ComponentMeta & Record<string, any>
}

export type DevtoolsMeta<T> = {
  devtools: {
    defaultProps: T
  }
}

export interface ServerFunctions {
  getComponents: () => Promise<Array<Component>>
}

export interface ClientFunctions {

}

export function setupDevtoolsClient(options: ModuleOptions) {
  onDevToolsInitialized(async () => {
    const _rpc = extendServerRpc<ClientFunctions, ServerFunctions>('nuxt/ui/devtools', {
      async getComponents() {
        // TODO: Properly configure the host
        const resp = await fetch('http://localhost:3000/__ui_devtools__/api/component-meta')
        const devtoolsComponentMeta = await resp.json()

        return await Promise.all(Object.keys(theme).map(async (name) => {
          const slug = kebabCase(name)
          const label = options.prefix + upperFirst(camelCase(slug))

          const devtoolsMeta: any = Object.entries(devtoolsComponentMeta).find(([key]) => {
            const fileName = key.split('/')[key.split('/').length - 1]

            return fileName && slug === kebabCase(fileName.replace(/\..*/, ''))
          })

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
              meta: defu(data?.meta, devtoolsMeta.devtools)
            }
          })
        }))
      }
    })
  })
}
