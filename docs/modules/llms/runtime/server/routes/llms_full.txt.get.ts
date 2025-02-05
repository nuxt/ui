import { joinURL, hasProtocol } from 'ufo'
import type { ModuleOptions } from '~~/modules/llms/module'
import { stringifyMarkdown } from '@nuxtjs/mdc/runtime'
import type { MDCRoot } from '@nuxtjs/mdc'

export default eventHandler(async (event) => {
  const options = useRuntimeConfig(event).llms as ModuleOptions

  const llms = []

  for (const section of options.sections) {
    // @ts-expect-error - typecheck does not derect server querryCollection
    const query = queryCollection(event, section.collection)
      .where('path', 'NOT LIKE', '%/.navigation')

    if (section.filters) {
      for (const filter of section.filters) {
        query.where(filter.field, filter.operator, filter.value)
      }
    }

    const docs = await query.all()

    for (const doc of docs) {
      let markdown = await stringifyMarkdown(decompressBody(doc.body, options), {})

      if (!markdown?.trim().startsWith('# ')) {
        markdown = `# ${doc.title}\n\n${markdown}`
      }
      llms.push(markdown)
    }
  }

  if (options.notes && options.notes.length) {
    llms.push(
      '## Notes',
      (options.notes || []).map(note => `- ${note}`).join('\n')
    )
  }

  setHeader(event, 'Content-Type', 'text/plain')
  return llms.join('\n\n')
})

// decompress utils is part of Content module and not exposed yet
// We can refactor this after exposing the utils
function decompressBody(body: any, options: ModuleOptions): MDCRoot {
  const linkProps = ['href', 'src', 'to']

  function decompressNode(input: any) {
    if (typeof input === 'string') {
      return {
        type: 'text',
        value: input
      }
    }

    const [tag, props, ...children] = input

    for (const prop of linkProps) {
      if (props[prop] && !hasProtocol(props[prop])) {
        props[prop] = joinURL(options.domain, props[prop])
      }
    }

    return {
      type: 'element',
      tag,
      props,
      children: children.map(decompressNode)
    }
  }

  return {
    type: 'root',
    children: body.value.map(decompressNode)
  }
}
