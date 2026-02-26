import path from 'node:path'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { it, expect } from 'vitest'

type MountSuspendedOptions<T> = Parameters<typeof mountSuspended<T>>[1]

async function componentRender<T>(nameOrHtml: string, options: MountSuspendedOptions<T>, component: T) {
  let html: string
  const name = component && typeof component === 'object' && '__file' in component && typeof component.__file === 'string'
    ? path.parse(component.__file).name
    : undefined
  if (options === undefined) {
    const app = {
      template: nameOrHtml,
      components: { [`U${name}`]: component }
    }
    const result = await mountSuspended(app)
    html = result.html()
  } else {
    const cResult = await mountSuspended<T>(component, options)
    html = cResult.html()
  }
  return html
}

function renderEach<T>(component: T, cases: ReadonlyArray<[string, MountSuspendedOptions<T>]>) {
  return it.each(cases)('renders %s correctly', async (nameOrHtml: string, options) => {
    const html = await componentRender<T>(nameOrHtml, options, component)
    expect(html).toMatchSnapshot()
  })
}

export { componentRender as default, componentRender, renderEach }
