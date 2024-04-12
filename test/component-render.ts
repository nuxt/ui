import path from 'node:path'
import { mountSuspended } from '@nuxt/test-utils/runtime'

export default async function (nameOrHtml: string, options: any, component: any) {
  let html: string
  const name = component.__file ? path.parse(component.__file).name : undefined
  if (options === undefined) {
    const app = {
      template: nameOrHtml,
      components: { [`U${name}`]: component }
    }
    const result = await mountSuspended(app)
    html = result.html()
  } else {
    const cResult = await mountSuspended(component, options)
    html = cResult.html()
  }
  return html
}
