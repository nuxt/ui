import { describe, it, expect } from 'vitest'
import { UCommandPalette } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('CommandPalette', () => {
  it.each([
    ['basic case', {}],
    ['with placeholder', { props: { placeholder: 'Emptystate placeholder' } }],
    ['with multiple', { props: { multiple: true } }],
    ['with nullable', { props: { nullable: true } }],
    ['with searchable', { props: { icon: 'i-heroicons-academic-cap', searchable: false } }],
    ['with loading', { props: { loading: true } }],
    ['with groups', { props: { groups: [{ key: '1', label: 'Group 1', commands: [{ label: 'Command 1' }] }] } }],
    ['with icon', { props: { icon: 'i-heroicons-arrow-up-on-square-stack' } }],
    ['with loading icon', { props: { loading: true, loadingIcon: 'i-heroicons-arrows-up-down-solid' } }],
    ['with icon', { props: { icon: 'i-heroicons-arrow-up-on-square-stack' } }],
    ['with selected icon', { props: { selectedIcon: 'i-heroicons-check', groups: [{ key: '1', label: 'Group 1', commands: [{ label: 'Command 1' }] }] } }],
    ['with close button', { props: { closeButton: { label: 'close button' } } }],
    ['with emptystate', { props: { emptyState: { icon: 'i-heroicons-academic-cap', label: 'Emptystate label', queryLabel: 'Emptystate queryLabel' } } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UCommandPalette.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UCommandPalette)
    expect(html).toMatchSnapshot()
  })
})
