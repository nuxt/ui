import type { Nuxt } from '@nuxt/schema'

import type { NuxtUIOptions } from '../unplugin'

import { getTemplates } from '../templates'
import type { UnpluginOptions } from 'unplugin'

export default function TemplatePlugin(options: NuxtUIOptions, appConfig?: Record<string, any>) {
  const templates = collectTemplates(options, appConfig)
  const templateKeys = new Set(templates.map(t => `#build/${t.filename}`))

  return {
    name: 'nuxt:ui:templates',
    resolveId(id) {
      if (templateKeys.has(id + '.ts')) {
        return id.replace('#build/', 'virtual:nuxt-ui-templates/') + '.ts'
      }
    },
    loadInclude: id => templateKeys.has(id.replace('virtual:nuxt-ui-templates/', '#build/')),
    load(id) {
      id = id.replace('virtual:nuxt-ui-templates/', '#build/')
      return templates.find(t => `#build/${t.filename}` === id)!.getContents!({} as any)
    }
  } satisfies UnpluginOptions
}

function collectTemplates(options: NuxtUIOptions, appConfig?: Record<string, any>) {
  const fakeNuxt = { options: { appConfig } }
  return getTemplates(options, fakeNuxt as Nuxt)
}
