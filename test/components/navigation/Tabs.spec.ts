import { describe, it, expect } from 'vitest'
import { UTabs } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Tabs', () => {
  it.each([
    ['basic case', {}],
    // ['with orientation', { orientation: 'vertical' }],
    // ['with defaultIndex', { defaultIndex: 2 }],
    // ['with items', { items: [{ label: 'Item 1' }, { label: 'Item 2' }] }],
    // ['with unmount', { unmount: true }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Tabs.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, UTabs)
    expect(html).toMatchSnapshot()
  })
})
