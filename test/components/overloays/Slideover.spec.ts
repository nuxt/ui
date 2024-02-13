import { describe, it, expect } from 'vitest'
import { USlideover } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Slideover', () => {
  it.each([
    ['basic case', {}],
    ['with appear', { appear: true }],
    ['with side', { side: 'left' }],
    ['with overlay', { overlay: false }],
    ['with transition', { transition: false }],
    ['with preventClose', { preventClose: true }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Slideover.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, USlideover)
    expect(html).toMatchSnapshot()
  })
})
