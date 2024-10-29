import { describe, it, expect, test } from 'vitest'
import CommandPalette, { type CommandPaletteProps } from '../../src/runtime/components/CommandPalette.vue'
import ComponentRender from '../component-render'
import { expectSlotProps } from '../utils/types'

describe('CommandPalette', () => {
  const groups = [{
    id: 'actions',
    items: [{
      label: 'Add new file',
      suffix: 'Create a new file in the current directory or workspace.',
      icon: 'i-heroicons-document-plus',
      kbds: ['meta', 'N']
    }, {
      label: 'Add new folder',
      suffix: 'Create a new folder in the current directory or workspace.',
      icon: 'i-heroicons-folder-plus',
      kbds: ['meta', 'F']
    }, {
      label: 'Add hashtag',
      suffix: 'Add a hashtag to the current item.',
      icon: 'i-heroicons-hashtag',
      kbds: ['meta', 'H']
    }, {
      label: 'Add label',
      suffix: 'Add a label to the current item.',
      icon: 'i-heroicons-tag',
      kbds: ['meta', 'L'],
      slot: 'custom'
    }]
  }, {
    id: 'labels',
    label: 'Labels',
    items: [{
      label: 'bug',
      chip: {
        color: 'error'
      }
    }, {
      label: 'feature',
      chip: {
        color: 'success'
      }
    }, {
      label: 'enhancement',
      chip: {
        color: 'info'
      }
    }]
  }, {
    id: 'users',
    label: 'Users',
    items: [{
      label: 'benjamincanac',
      avatar: {
        src: 'https://github.com/benjamincanac.png'
      }
    }]
  }]

  const props = { groups }

  it.each([
    // Props
    ['with groups', { props }],
    ['without results', {}],
    ['with modelValue', { props: { ...props, modelValue: groups[2].items[0] } }],
    ['with defaultValue', { props: { ...props, defaultValue: groups[2].items[0] } }],
    ['with labelKey', { props: { ...props, labelKey: 'icon' } }],
    ['with placeholder', { props: { ...props, placeholder: 'Search...' } }],
    ['with disabled', { props: { ...props, disabled: true } }],
    ['with icon', { props: { ...props, icon: 'i-heroicons-command-line' } }],
    ['with loading', { props: { ...props, loading: true } }],
    ['with loadingIcon', { props: { ...props, loading: true, loadingIcon: 'i-heroicons-sparkles' } }],
    ['with selectedIcon', { props: { ...props, selectedIcon: 'i-heroicons-check-badge', modelValue: groups[2].items[0] } }],
    ['with close', { props: { ...props, close: true } }],
    ['with closeIcon', { props: { ...props, close: true, closeIcon: 'i-heroicons-trash' } }],
    ['with as', { props: { ...props, as: 'section' } }],
    ['with class', { props: { ...props, class: 'divide-[var(--ui-border-accented)]' } }],
    ['with ui', { props: { ...props, ui: { input: '[&>input]:h-10' } } }],
    // Slots
    ['with empty slot', { props, slots: { empty: () => 'Empty slot' } }],
    ['with item slot', { props, slots: { item: () => 'Item slot' } }],
    ['with item-leading slot', { props, slots: { 'item-leading': () => 'Item leading slot' } }],
    ['with item-label slot', { props, slots: { 'item-label': () => 'Item label slot' } }],
    ['with item-trailing slot', { props, slots: { 'item-trailing': () => 'Item trailing slot' } }],
    ['with custom slot', { props, slots: { custom: () => 'Custom slot' } }],
    ['with close slot', { props: { ...props, close: true }, slots: { close: () => 'Close slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: CommandPaletteProps<typeof groups[number], typeof groups[number]['items'][number]>, slots?: Partial<any> }) => {
    const html = await ComponentRender(nameOrHtml, options, CommandPalette)
    expect(html).toMatchSnapshot()
  })

  test('should have the correct types', () => {
    // normal
    expectSlotProps('item', () => CommandPalette({
      groups: [{ id: 'foo', items: [{ label: 'foo', value: 'bar' }] }]
    })).toEqualTypeOf<{ item: { label: string, value: string }, index: number }>()

    // groups
    expectSlotProps('item', () => CommandPalette({
      groups: [{ id: 'foo', items: [{ label: 'foo', value: 'bar' }] }, { id: 'bar', items: [{ label: 'foo', value: 'bar' }] }]
    })).toEqualTypeOf<{ item: { label: string, value: string }, index: number }>()

    // custom
    expectSlotProps('item', () => CommandPalette({
      groups: [{ id: 'foo', items: [{ label: 'foo', value: 'bar', custom: 'nice' }] }]
    })).toEqualTypeOf<{ item: { label: string, value: string, custom: string }, index: number }>()

    // custom + groups
    expectSlotProps('item', () => CommandPalette({
      groups: [{ id: 'foo', items: [{ label: 'foo', value: 'bar', custom1: 1 }] }, { id: 'bar', items: [{ label: 'foo', value: 'bar', custom2: 2 }] }]
    })).toEqualTypeOf<{ item: { label: string, value: string, custom1: number } | { label: string, value: string, custom2: number }, index: number }>()
  })
})
