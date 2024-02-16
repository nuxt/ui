import { describe, it, expect } from 'vitest'
import { UCommandPalette } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'
import uiCommandpalette from '../../../src/runtime/ui.config/navigation/commandPalette'

describe('CommandPalette', () => {
  it.each([
    ['basic case', { props: { ui: uiCommandpalette } }],
    ['with placeholder', { props: { placeholder: 'Emptystate placeholder', ui: uiCommandpalette } }],
    ['with multiple', { props: { multiple: true, ui: uiCommandpalette } }],
    ['with nullable', { props: { nullable: true, ui: uiCommandpalette } }],
    ['with searchable', { props: { icon: 'i-heroicons-academic-cap', searchable: false, ui: uiCommandpalette } }],
    ['with loading', { props: { loading: true, ui: uiCommandpalette } }],
    ['with groups', { props: { groups: [{ key: '1', label: 'Group 1', commands: [{ label: 'Command 1' }] }], ui: uiCommandpalette } }],
    ['with icon', { props: { icon: 'i-heroicons-arrow-up-on-square-stack', ui: uiCommandpalette } }],
    ['with loading icon', { props: { loading: true, loadingIcon: 'i-heroicons-arrows-up-down-solid', ui: uiCommandpalette } }],
    ['with icon', { props: { icon: 'i-heroicons-arrow-up-on-square-stack', ui: uiCommandpalette } }],
    ['with selected icon', { props: { selectedIcon: 'i-heroicons-check', groups: [{ key: '1', label: 'Group 1', commands: [{ label: 'Command 1' }] }], ui: uiCommandpalette } }],
    ['with close button', { props: { closeButton: { label: 'close button' }, ui: uiCommandpalette } }],
    ['with emptystate', { props: { emptyState: { icon: 'i-heroicons-academic-cap', label: 'Emptystate label', queryLabel: 'Emptystate queryLabel' }, ui: uiCommandpalette } }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof CommandPalette.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UCommandPalette)
    expect(html).toMatchSnapshot()
  })
})
