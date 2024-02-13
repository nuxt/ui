import { describe, it, expect } from 'vitest'
import { UPopover } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Popover', () => {
  it.each([
    ['basic case', {}],
    ['with mode', { mode: 'click' }],
    ['with open', { open: true }],
    ['with disabled', { disabled: true }],
    ['with openDelay', { openDelay: 100 }],
    ['with closeDelay', { closeDelay: 200 }],
    ['with overlay', { overlay: true }],
    ['with popper', { popper: { key: { id: '1' }, locked: false, arrow: true } }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Popover.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, UPopover)
    expect(html).toMatchSnapshot()
  })
})
