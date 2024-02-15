import { describe, it, expect } from 'vitest'
import { UCommandPalette } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'
import ui from '../../../src/runtime/ui.config/navigation/commandPalette'

describe('CommandPalette', () => {
  it.each([
    ['basic case', { props: { ui: { emptyState: ui.emptyState.wrapper, input: { wrapper: ui.input.wrapper, padding: ui.input.padding, icon: { padding: ui.input.icon.padding } } } } }],
    ['with placeholder', { props: { placeholder: 'Emptystate placeholder', ui: { emptyState: ui.emptyState.wrapper, input: { wrapper: ui.input.wrapper, padding: ui.input.padding, icon: { padding: ui.input.icon.padding } } } } }],
    ['with multiple', { props: { multiple: true, ui: { emptyState: ui.emptyState.wrapper, input: { wrapper: ui.input.wrapper, padding: ui.input.padding, icon: { padding: ui.input.icon.padding } } } } }],
    ['with nullable', { props: { nullable: true, ui: { emptyState: ui.emptyState.wrapper, input: { wrapper: ui.input.wrapper, padding: ui.input.padding, icon: { padding: ui.input.icon.padding } } } } }],
    ['with searchable', { props: { icon: 'i-heroicons-academic-cap', searchable: false, ui: { emptyState: ui.emptyState.wrapper, input: { wrapper: ui.input.wrapper, padding: ui.input.padding, icon: { padding: ui.input.icon.padding } } } } }],
    ['with loading', { props: { loading: true, ui: { emptyState: ui.emptyState.wrapper, input: { wrapper: ui.input.wrapper, padding: ui.input.padding, icon: { padding: ui.input.icon.padding } } } } }],
    ['with groups', { props: { groups: [{ key: '1', label: 'Group 1', commands: [{ label: 'Command 1' }] }], ui: { group: { wrapper: ui.group.wrapper, command: { base: ui.group.command.base, selectedIcon: { base: ui.group.command.selectedIcon.base } } }, emptyState: ui.emptyState.wrapper, input: { wrapper: ui.input.wrapper, padding: ui.input.padding, icon: { padding: ui.input.icon.padding } } } } }],
    ['with icon', { props: { icon: 'i-heroicons-arrow-up-on-square-stack', ui: { emptyState: ui.emptyState.wrapper, input: { wrapper: ui.input.wrapper, padding: ui.input.padding, icon: { padding: ui.input.icon.padding } } } } }],
    ['with loading icon', { props: { loading: true, loadingIcon: 'i-heroicons-arrows-up-down-solid', ui: { emptyState: ui.emptyState.wrapper, input: { wrapper: ui.input.wrapper, padding: ui.input.padding, icon: { padding: ui.input.icon.padding } } } } }],
    ['with icon', { props: { icon: 'i-heroicons-arrow-up-on-square-stack', ui: { emptyState: ui.emptyState.wrapper, input: { wrapper: ui.input.wrapper, padding: ui.input.padding, icon: { padding: ui.input.icon.padding } } } } }],
    ['with selected icon', { props: { selectedIcon: 'i-heroicons-check', groups: [{ key: '1', label: 'Group 1', commands: [{ label: 'Command 1' }] }], ui: { group: { wrapper: ui.group.wrapper, command: { base: ui.group.command.base, selectedIcon: { base: ui.group.command.selectedIcon.base } } }, emptyState: ui.emptyState.wrapper, input: { wrapper: ui.input.wrapper, padding: ui.input.padding, icon: { padding: ui.input.icon.padding } } } } }],
    ['with close button', { props: { closeButton: { label: 'close button' }, ui: { default: { closeButton: ui.default.closeButton }, emptyState: ui.emptyState.wrapper, input: { wrapper: ui.input.wrapper, padding: ui.input.padding, icon: { padding: ui.input.icon.padding }, closeButton: { padding: ui.input.closeButton.padding } } } } }],
    ['with emptystate', { props: { emptyState: { icon: 'i-heroicons-academic-cap', label: 'Emptystate label', queryLabel: 'Emptystate queryLabel' }, ui: { emptyState: ui.emptyState.wrapper, input: { wrapper: ui.input.wrapper, padding: ui.input.padding, icon: { padding: ui.input.icon.padding } } } } }],
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
