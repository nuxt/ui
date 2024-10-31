import { describe, it, expect, test } from 'vitest'
import Tabs, { type TabsProps, type TabsSlots } from '../../src/runtime/components/Tabs.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/tabs'
import { expectSlotProps } from '../utils/types'

describe('Tabs', () => {
  const variants = Object.keys(theme.variants.variant) as any
  const sizes = Object.keys(theme.variants.size) as any

  const items = [{
    label: 'Tab1',
    avatar: {
      src: 'https://github.com/benjamincanac.png'
    },
    content: 'This is the content shown for Tab1'
  }, {
    label: 'Tab2',
    icon: 'i-heroicons-user',
    content: 'And, this is the content for Tab2'
  }, {
    label: 'Tab3',
    icon: 'i-heroicons-bell',
    content: 'Finally, this is the content for Tab3',
    slot: 'custom'
  }]

  const props = { items }

  it.each([
    // Props
    ['with items', { props }],
    ['with labelKey', { props: { ...props, labelKey: 'icon' } }],
    ['with modelValue', { props: { ...props, modelValue: '1' } }],
    ['with defaultValue', { props: { ...props, defaultValue: '1' } }],
    ['with orientation vertical', { props: { ...props, orientation: 'vertical' as const } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { ...props, size } }]),
    ...variants.map((variant: string) => [`with primary variant ${variant}`, { props: { ...props, variant } }]),
    ...variants.map((variant: string) => [`with neutral variant ${variant}`, { props: { ...props, variant, color: 'neutral' } }]),
    ['without content', { props: { ...props, content: false } }],
    ['with class', { props: { ...props, class: 'w-96' } }],
    ['with ui', { props: { ...props, ui: { content: 'w-full ring ring-[var(--ui-border)]' } } }],
    // Slots
    ['with leading slot', { props, slots: { leading: () => 'Leading slot' } }],
    ['with default slot', { props, slots: { default: () => 'Default slot' } }],
    ['with trailing slot', { props, slots: { trailing: () => 'Trailing slot' } }],
    ['with content slot', { props, slots: { content: () => 'Content slot' } }],
    ['with custom slot', { props, slots: { custom: () => 'Custom slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: TabsProps<typeof items>, slots?: Partial<TabsSlots<typeof items>> }) => {
    const html = await ComponentRender(nameOrHtml, options, Tabs)
    expect(html).toMatchSnapshot()
  })

  test('should have the correct types', () => {
    // normal
    const test1 = () => Tabs({
      items: [{ label: 'foo', value: 'bar' }]
    })

    expectSlotProps('content', test1).toEqualTypeOf<{ item: { label: string, value: string }, index: number }>()
    expectSlotProps('default', test1).toEqualTypeOf<{ item: { label: string, value: string }, index: number }>()
    expectSlotProps('leading', test1).toEqualTypeOf<{ item: { label: string, value: string }, index: number }>()
    expectSlotProps('trailing', test1).toEqualTypeOf<{ item: { label: string, value: string }, index: number }>()

    // custom + mixed
    const test2 = () => Tabs({
      items: [{ label: 'foo', value: 'bar', custom: 'nice' }, { label: 'baz' }, { label: 'foo', value: 'bar', custom: 1 }]
    })

    expectSlotProps('content', test2).toEqualTypeOf<{ item: { label: string, value?: string, custom?: string | number }, index: number }>()
    expectSlotProps('default', test2).toEqualTypeOf<{ item: { label: string, value?: string, custom?: string | number }, index: number }>()
    expectSlotProps('leading', test2).toEqualTypeOf<{ item: { label: string, value?: string, custom?: string | number }, index: number }>()
    expectSlotProps('trailing', test2).toEqualTypeOf<{ item: { label: string, value?: string, custom?: string | number }, index: number }>()

    // custom  + internal const
    const test3 = () => Tabs({
      items: [{ slot: 'foo', label: 'foo', value: 'bar' } as const, { slot: 'baz' } as const]
    })

    expectSlotProps('content', test3).toEqualTypeOf<{ item: { slot: 'foo' | 'baz', label?: 'foo', value?: 'bar' }, index: number }>()
    expectSlotProps('foo', test3).toEqualTypeOf<{ item: { slot: 'foo', label: 'foo', value: 'bar' }, index: number }>()
    expectSlotProps('baz', test3).toEqualTypeOf<{ item: { slot: 'baz', label?: undefined, value?: undefined }, index: number }>()

    // custom  + external const
    const test6 = () => Tabs({
      items: [{ slot: 'foo', label: 'foo', value: 'bar' }, { slot: 'salut', value: '' }] as const
    })

    expectSlotProps('content', test6).toEqualTypeOf<{ item: { slot: 'salut' | 'foo', value: '' | 'bar', label?: 'foo' }, index: number }>()
    expectSlotProps('foo', test6).toEqualTypeOf<{ item: { slot: 'foo', label: 'foo', value: 'bar' }, index: number }>()
    expectSlotProps('salut', test6).toEqualTypeOf<{ item: { slot: 'salut', value: '' }, index: number }>()
  })
})
