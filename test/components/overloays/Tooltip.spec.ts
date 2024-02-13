import { describe, it, expect } from 'vitest'
import { UTooltip } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Tooltip', () => {
  it.each([
    ['basic case', {}],
    ['with text', { text: 'My tooltip' }],
    ['with prevent', { prevent: true }],
    ['with shortcuts', { shortcuts: ['Cmd+k', 'Cmd+S'] }],
    ['with openDelay', { openDelay: 500 }],
    ['with closeDelay', { closeDelay: 300 }],
    ['with popper', { popper: { key: { id: '1' }, placement: 'bottom', arrow: true } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Tooltip.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, UTooltip)
    expect(html).toMatchSnapshot()
  })
})
