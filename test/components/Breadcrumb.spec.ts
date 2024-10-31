import { describe, it, expect, test } from 'vitest'
import Breadcrumb, { type BreadcrumbProps, type BreadcrumbSlots } from '../../src/runtime/components/Breadcrumb.vue'
import ComponentRender from '../component-render'
import { expectSlotProps } from '../utils/types'

describe('Breadcrumb', () => {
  const items = [{
    label: 'Home',
    avatar: {
      src: 'https://github.com/benjamincanac.png'
    },
    to: '/'
  }, {
    label: 'Components',
    icon: 'i-heroicons-cube-transparent',
    disabled: true
  }, {
    label: 'Breadcrumb',
    to: '/components/breadcrumb',
    icon: 'i-heroicons-link',
    slot: 'custom'
  }]

  const props = { items }

  it.each([
    // Props
    ['with items', { props }],
    ['with labelKey', { props: { ...props, labelKey: 'icon' } }],
    ['with separatorIcon', { props: { ...props, separatorIcon: 'i-heroicons-minus' } }],
    ['with class', { props: { ...props, class: 'w-48' } }],
    ['with ui', { props: { ...props, ui: { link: 'font-bold' } } }],
    // Slots
    ['with item slot', { props, slots: { item: () => 'Item slot' } }],
    ['with item-leading slot', { props, slots: { 'item-leading': () => 'Item leading slot' } }],
    ['with item-label slot', { props, slots: { 'item-label': () => 'Item label slot' } }],
    ['with item-trailing slot', { props, slots: { 'item-trailing': () => 'Item trailing slot' } }],
    ['with custom slot', { props, slots: { custom: () => 'Custom slot' } }],
    ['with separator slot', { props, slots: { separator: () => '/' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: BreadcrumbProps<typeof items>, slots?: Partial<BreadcrumbSlots<typeof items[number]>> }) => {
    const html = await ComponentRender(nameOrHtml, options, Breadcrumb)
    expect(html).toMatchSnapshot()
  })

  test('should have the correct types', () => {
    // normal
    const test1 = () => Breadcrumb({
      items: [{ label: 'foo', value: 'bar' }]
    })

    expectSlotProps('item', test1).toEqualTypeOf<{ item: { label: string, value: string }, index: number, active?: boolean }>()
    expectSlotProps('item-leading', test1).toEqualTypeOf<{ item: { label: string, value: string }, index: number, active?: boolean }>()
    expectSlotProps('item-trailing', test1).toEqualTypeOf<{ item: { label: string, value: string }, index: number, active?: boolean }>()

    // custom + mixed
    const test2 = () => Breadcrumb({
      items: [{ label: 'foo', value: 'bar', custom: 'nice' }, { label: 'baz' }, { label: 'foo', value: 'bar', custom: 1 }]
    })

    expectSlotProps('item', test2).toEqualTypeOf<{ item: { label: string, value?: string, custom?: string | number }, index: number, active?: boolean }>()
    expectSlotProps('item-leading', test2).toEqualTypeOf<{ item: { label: string, value?: string, custom?: string | number }, index: number, active?: boolean }>()
    expectSlotProps('item-trailing', test2).toEqualTypeOf<{ item: { label: string, value?: string, custom?: string | number }, index: number, active?: boolean }>()

    // custom  + internal const
    const test3 = () => Breadcrumb({
      items: [{ slot: 'foo', label: 'foo', value: 'bar' } as const, { slot: 'baz' } as const]
    })

    expectSlotProps('item', test3).toEqualTypeOf<{ item: { slot: 'foo' | 'baz', label?: 'foo', value?: 'bar' }, index: number, active?: boolean }>()
    expectSlotProps('foo', test3).toEqualTypeOf<{ item: { slot: 'foo', label: 'foo', value: 'bar' }, index: number, active?: boolean }>()
    expectSlotProps('baz', test3).toEqualTypeOf<{ item: { slot: 'baz', label?: undefined, value?: undefined }, index: number, active?: boolean }>()

    // custom  + external const
    const test6 = () => Breadcrumb({
      items: [{ slot: 'foo', label: 'foo', value: 'bar' }, { slot: 'salut', value: '' }] as const
    })

    expectSlotProps('item', test6).toEqualTypeOf<{ item: { slot: 'salut' | 'foo', value: '' | 'bar', label?: 'foo' }, index: number, active?: boolean }>()
    expectSlotProps('foo', test6).toEqualTypeOf<{ item: { slot: 'foo', label: 'foo', value: 'bar' }, index: number, active?: boolean }>()
    expectSlotProps('salut', test6).toEqualTypeOf<{ item: { slot: 'salut', value: '' }, index: number, active?: boolean }>()
  })
})
