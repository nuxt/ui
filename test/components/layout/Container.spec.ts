import { describe, it, expect } from 'vitest'
import { UContainer } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Container', () => {
  it.each([
    ['basic case', {}],
    ['with as', { as: 'article' }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Container.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, UContainer)
    expect(html).toMatchSnapshot()
  })
})
