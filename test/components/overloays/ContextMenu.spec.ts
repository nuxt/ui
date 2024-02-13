import { describe, it, expect } from 'vitest'
import { UContextMenu } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('ContextMenu', () => {
  it.each([
    ['basic case', {}],
    ['with virtualElement', { virtualElement: { label: 'test' } }],
    ['with popper', { popper: { key: { id: '1' }, locked: 'false', arrow: true } }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof ContextMenu.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, UContextMenu)

    expect(html).toMatchSnapshot()
  })
})
