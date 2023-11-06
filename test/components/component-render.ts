import { mountSuspended } from 'nuxt-vitest/utils'
import path from 'path'

export default async function (nameOrHtml: string, options: any, component: any) {
  let html
  const name = path.parse(component.__file).name
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
