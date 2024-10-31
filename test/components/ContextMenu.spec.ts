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
    const test1 = () => ContextMenu({
      items: [{ label: 'foo', value: 'bar' }]
    })

    expectSlotProps('item', test1).toEqualTypeOf<{ item: { label: string, value: string }, index: number, active?: boolean }>()
    expectSlotProps('item-leading', test1).toEqualTypeOf<{ item: { label: string, value: string }, index: number, active?: boolean }>()
    expectSlotProps('item-trailing', test1).toEqualTypeOf<{ item: { label: string, value: string }, index: number, active?: boolean }>()

    // groups
    const test2 = () => ContextMenu({
      items: [[{ label: 'foo', value: 'bar' }]]
    })

    expectSlotProps('item', test2).toEqualTypeOf<{ item: { label: string, value: string }, index: number, active?: boolean }>()
    expectSlotProps('item-leading', test2).toEqualTypeOf<{ item: { label: string, value: string }, index: number, active?: boolean }>()
    expectSlotProps('item-trailing', test2).toEqualTypeOf<{ item: { label: string, value: string }, index: number, active?: boolean }>()

    // custom + mixed
    const test3 = () => ContextMenu({
      items: [{ label: 'foo', value: 'bar', custom: 'nice' }, { label: 'baz' }, { label: 'foo', value: 'bar', custom: 1 }]
    })

    expectSlotProps('item', test3).toEqualTypeOf<{ item: { label: string, value?: string, custom?: string | number }, index: number, active?: boolean }>()
    expectSlotProps('item-leading', test3).toEqualTypeOf<{ item: { label: string, value?: string, custom?: string | number }, index: number, active?: boolean }>()
    expectSlotProps('item-trailing', test3).toEqualTypeOf<{ item: { label: string, value?: string, custom?: string | number }, index: number, active?: boolean }>()

    // custom + groups + mixed
    const test4 = () => ContextMenu({
      items: [[{ label: 'foo', value: 'bar' }], [{ label: 'foo', value: 'bar', custom: 1 }], [{ custom: 'a', label: 'foo', value: 'bar' }]]
    })

    expectSlotProps('item', test4).toEqualTypeOf<{ item: { label: string, value: string, custom?: string | number }, index: number, active?: boolean }>()

    // custom + groups + internal const
    const test5 = () => ContextMenu({
      items: [[{ slot: 'foo', label: 'foo', value: 'bar' }] as const, [{ slot: 'baz' }] as const]
    })

    expectSlotProps('item', test5).toEqualTypeOf<{ item: { slot: 'foo' | 'baz', label?: 'foo', value?: 'bar' }, index: number, active?: boolean }>()
    expectSlotProps('foo', test5).toEqualTypeOf<{ item: { slot: 'foo', label: 'foo', value: 'bar' }, index: number, active?: boolean }>()
    expectSlotProps('baz', test5).toEqualTypeOf<{ item: { slot: 'baz' }, index: number, active?: boolean }>()

    // custom + groups + external const
    const test6 = () => ContextMenu({
      items: [[{ slot: 'foo', label: 'foo', value: 'bar' }], [{ slot: 'salut', value: '' }]] as const
    })

    expectSlotProps('item', test6).toEqualTypeOf<{ item: { slot: 'salut' | 'foo', value: '' | 'bar', label?: 'foo' }, index: number, active?: boolean }>()
    expectSlotProps('foo', test6).toEqualTypeOf<{ item: { slot: 'foo', label: 'foo', value: 'bar' }, index: number, active?: boolean }>()
    expectSlotProps('salut', test6).toEqualTypeOf<{ item: { slot: 'salut', value: '' }, index: number, active?: boolean }>()
  })
})
