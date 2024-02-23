import { describe, it, expect } from 'vitest'
import { UDropdown } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Dropdown', () => {
  it.each([
    ['basic case', {}],
    ['with items', { props: { open: true, items: [{ label: 'label1' }, { label: 'label2' }] } }],
    ['with open', { props: { open: true, items: [{ label: 'label1' }, { label: 'label2' }] } }],
    ['with close', { props: { open: false, items: [{ label: 'label1' }, { label: 'label2' }] } }],
    ['with hover mode', { props: { open: true, items: [{ label: 'label1' }, { label: 'label2' }], mode: 'hover' } }],
    ['with disabled', { props: { disabled: true, items: [{ label: 'label1' }, { label: 'label2' }] } }],
    ['with default slot', { slots: { default: () => 'Default slot' }, props: { open: true, items: [{ label: 'label1' }, { label: 'label2', slot: 'label 2 slot' }] } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UDropdown.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UDropdown)
    expect(html).toMatchSnapshot()
  })
})
