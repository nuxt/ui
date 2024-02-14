import { describe, it, expect } from 'vitest'
import { UDropdown } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Dropdown', () => {
  it.each([
    ['basic case', {}],
    ['with items', { props: { open: true, items: [{ label: 'label1' }, { label: 'label2' }], ui: { item: { base: 'group flex items-center gap-1.5 w-full' } } } }],
    ['with open', { props: { open: true, items: [{ label: 'label1' }, { label: 'label2' }], ui: { item: { base: 'group flex items-center gap-1.5 w-full' } } } }],
    ['with close', { props: { open: false, items: [{ label: 'label1' }, { label: 'label2' }], ui: { item: { base: 'group flex items-center gap-1.5 w-full' } } } }],
    ['with hover mode', { props: { open: true, items: [{ label: 'label1' }, { label: 'label2' }], mode: 'hover', ui: { item: { base: 'group flex items-center gap-1.5 w-full' } } } }],
    ['width disabled', { props: { disabled: true, items: [{ label: 'label1' }, { label: 'label2' }], ui: { item: { base: 'group flex items-center gap-1.5 w-full' } } } }],
    ['width slot', { slots: { default: 'Open slot' }, props: { open: true, items: [{ label: 'label1' }, { label: 'label2', slot: 'label 2 slot' }], ui: { item: { base: 'group flex items-center gap-1.5 w-full' } } } }],
    ['width item slot', { props: { open: true, items: [{ label: 'label1', slot: 'label 1 slot', icon: 'i-heroicons-academic-cap' }, { label: 'label2', slot: 'label 2 slot' }], ui: { item: { base: 'group flex items-center gap-1.5 w-full' } } } }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Dropdown.props>) => {

    const html = await ComponentRender(nameOrHtml, options, UDropdown)
    expect(html).toMatchSnapshot()
  })
})
