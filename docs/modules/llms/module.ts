import { addPrerenderRoutes, addServerScanDir, createResolver, defineNuxtModule, useLogger } from '@nuxt/kit'
import type { SQLOperator } from '@nuxt/content'

export interface ModuleOptions {
  domain: string
  sections: Array<{
    title: string
    collection: string
    description?: string
    filters?: Array<{
      field: string
      operator: SQLOperator
      value?: string
    }>
  }>
  title?: string
  description?: string
  notes?: string[]
}

export default defineNuxtModule({
  meta: {
    name: 'llms',
    configKey: 'llms'
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const logger = useLogger('llms')

    nuxt.options.runtimeConfig.llms = {
      domain: options.domain,
      title: options.title,
      description: options.description,
      notes: options.notes,
      sections: options.sections || [{ title: 'Docs', collection: 'content' }]
    }

    if (!options.domain) {
      logger.warn('Please provide a domain for the LLMs module. LLMS docs require a domain to be set.')
    }

    addServerScanDir(resolve('runtime/server'))

    addPrerenderRoutes('/llms.txt')
    addPrerenderRoutes('/llms_full.txt')
  }
})
