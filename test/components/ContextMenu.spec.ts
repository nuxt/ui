import { describe, it, expect, test } from 'vitest'
import ContextMenu, { type ContextMenuProps, type ContextMenuSlots } from '../../src/runtime/components/ContextMenu.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/context-menu'
import { expectSlotProps } from '../utils/types'

// FIXME: Can't force open state
describe('ContextMenu', () => {
  const sizes = Object.keys(theme.variants.size) as any

  const items = [
    [{
      label: 'Appearance',
      children: [{
        label: 'System',
        icon: 'i-heroicons-computer-desktop'
      }, {
        label: 'Light',
        icon: 'i-heroicons-sun'
      }, {
        label: 'Dark',
        icon: 'i-heroicons-moon'
      }]
    }],
    [{
      label: 'Show Sidebar',
      kbds: ['meta', 'S']
    }, {
      label: 'Show Toolbar',
      kbds: ['shift', 'meta', 'D']
    }, {
      label: 'Collapse Pinned Tabs',
      disabled: true
    }], [{
      label: 'Refresh the Page'
    }, {
      label: 'Clear Cookies and Refresh'
    }, {
      label: 'Clear Cache and Refresh'
    }, {
      type: 'separator' as const
    }, {
      label: 'Developer',
      children: [[{
        label: 'View Source',
        kbds: ['option', 'meta', 'U']
      }, {
        label: 'Developer Tools',
        kbds: ['option', 'meta', 'I']
      }], [{
        label: 'Inspect Elements',
        kbds: ['option', 'meta', 'C']
      }], [{
        label: 'JavaScript Console',
        kbds: ['option', 'meta', 'J'],
        slot: 'custom'
      }]]
    }]
  ]

  const props = { portal: false, items }

  it.each([
    // Props
    ['with items', { props }],
    ['with labelKey', { props: { ...props, labelKey: 'icon' } }],
    ['with disabled', { props: { ...props, disabled: true } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { ...props, size } }]),
    ['with class', { props: { ...props, class: 'min-w-96' } }],
    ['with ui', { props: { ...props, ui: { itemLeadingIcon: 'size-4' } } }],
    // Slots
    ['with default slot', { props, slots: { default: () => 'Default slot' } }],
    ['with item slot', { props, slots: { item: () => 'Item slot' } }],
    ['with item-leading slot', { props, slots: { 'item-leading': () => 'Item leading slot' } }],
    ['with item-label slot', { props, slots: { 'item-label': () => 'Item label slot' } }],
    ['with item-trailing slot', { props, slots: { 'item-trailing': () => 'Item trailing slot' } }],
    ['with custom slot', { props, slots: { custom: () => 'Custom slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: ContextMenuProps<typeof items[number][number]>, slots?: Partial<ContextMenuSlots<any>> }) => {
    const html = await ComponentRender(nameOrHtml, options, ContextMenu)
    expect(html).toMatchSnapshot()
  })

  test('should have the correct types', () => {
    // normal
    expectSlotProps('item', () => ContextMenu({
      items: [{ label: 'foo', value: 'bar' }]
    })).toEqualTypeOf<{ item: { label: string, value: string }, index: number, active?: boolean }>()

    // groups
    expectSlotProps('item', () => ContextMenu({
      items: [[{ label: 'foo', value: 'bar' }]]
    })).toEqualTypeOf<{ item: { label: string, value: string }, index: number, active?: boolean }>()

    // custom
    expectSlotProps('item', () => ContextMenu({
      items: [{ label: 'foo', value: 'bar', custom: 'nice' }]
    })).toEqualTypeOf<{ item: { label: string, value: string, custom: string }, index: number, active?: boolean }>()

    // custom + groups
    expectSlotProps('item', () => ContextMenu({
      items: [[{ label: 'foo', value: 'bar', custom: 'nice' }]]
    })).toEqualTypeOf<{ item: { label: string, value: string, custom: string }, index: number, active?: boolean }>()

    // custom + groups + mixed
    expectSlotProps('item', () => ContextMenu({
      items: [[{ label: 'foo', value: 'bar', custom1: 'nice', super: '' }], [{ super: 2, label: 'foo', value: 'bar', custom2: 2 }]]
    })).toEqualTypeOf<{ item: { label: string, value: string, super: string | number, custom1?: string, custom2?: number }, index: number, active?: boolean }>()
  })
})
