import { describe, it, expect } from 'vitest'
import { UCommandPalette } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('CommandPalette', () => {
  it.each([
    ['basic case', {}],
    ['with by', { by: 'name' }],
    ['with multiple', { multiple: true }],
    ['with nullable', { nullable: true }],
    ['with searchable', { searchable: false }],
    ['with loading', { loading: true }],
    ['with groups', { groups: [{ key: '1', label: 'Group 1', commands: [{ label: 'Command 1' }] }] }],
    ['with icon', { icon: 'i-heroicons-academic-cap' }],
    ['with loadingIcon', { loadingIcon: 'i-heroicons-arrows-up-down-solid' }],
    ['with selectedIcon', { selectedIcon: 'i-heroicons-arrow-small-down-20-solid' }],
    ['with closeButton', { closeButton: { label: 'Close' } }],
    ['with emptyState', { emptyState: { icon: 'i-heroicons-exclamation-circle', label: 'No results found', queryLabel: 'No results for' } }],
    ['with placeholder', { placeholder: 'Search here' }],
    ['with groupAttribute', { groupAttribute: 'category' }],
    ['with commandAttribute', { commandAttribute: 'title' }],
    ['with autoselect', { autoselect: false }],
    ['with autoclear', { autoclear: false }],
    ['with debounce', { debounce: 300 }],
    ['with fuse', { fuse: { threshold: 0.6 } }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof CommandPalette.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, UCommandPalette)
    expect(html).toMatchSnapshot()
  })
})
