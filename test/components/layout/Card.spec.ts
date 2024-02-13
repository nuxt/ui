import { describe, it, expect } from 'vitest'
import { UCard } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Card', () => {
  it.each([
    ['basic case', {}],
    ['with as', { as: 'li' }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Card.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, UCard)
    expect(html).toMatchSnapshot()
  })
})
