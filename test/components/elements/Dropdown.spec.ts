import { describe, it, expect } from 'vitest'
import { UDropdown } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Dropdown', () => {
  it.each([
    ['basic case', {}],
    ['with custom mode', { props: { mode: 'hover' } }],
    ['open set to true', { props: { open: true } }],
    ['disabled set to true', { props: { disabled: true } }],
    ['with custom openDelay', { props: { openDelay: 500 } }],
    ['with custom closeDelay', { props: { closeDelay: 500 } }],
    ['with custom class', { props: { class: 'custom-class' } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Dropdown.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, UDropdown)
    expect(html).toMatchSnapshot()
  })
})
