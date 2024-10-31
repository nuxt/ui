import { describe, it, expect, test } from 'vitest'
import Accordion, { type AccordionProps, type AccordionSlots } from '../../src/runtime/components/Accordion.vue'
import ComponentRender from '../component-render'
import { expectSlotProps } from '../utils/types'

describe('Accordion', () => {
  const items = [{
    label: 'Getting Started',
    icon: 'i-heroicons-information-circle',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
  }, {
    label: 'Installation',
    icon: 'i-heroicons-arrow-down-tray',
    disabled: true,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
  }, {
    label: 'Theming',
    icon: 'i-heroicons-eye-dropper',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
  }, {
    label: 'Layouts',
    icon: 'i-heroicons-rectangle-group',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
  }, {
    label: 'Components',
    icon: 'i-heroicons-square-3-stack-3d',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
  }, {
    label: 'Utilities',
    icon: 'i-heroicons-wrench-screwdriver',
    trailingIcon: 'i-heroicons-sun',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.',
    slot: 'custom'
  }]

  const props = { items }

  it.each([
    // Props
    ['with items', { props }],
    ['with modelValue', { props: { ...props, modelValue: '1' } }],
    ['with defaultValue', { props: { ...props, defaultValue: '1' } }],
    ['with labelKey', { props: { ...props, labelKey: 'icon' } }],
    ['with as', { props: { ...props, as: 'section' } }],
    ['with type', { props: { ...props, type: 'multiple' as const } }],
    ['with disabled', { props: { ...props, disabled: true } }],
    ['with collapsible', { props: { ...props, collapsible: false } }],
    ['with trailingIcon', { props: { ...props, trailingIcon: 'i-heroicons-plus' } }],
    ['with class', { props: { ...props, class: 'w-96' } }],
    ['with ui', { props: { ...props, ui: { item: 'border-[var(--ui-border-accented)]' } } }],
    // Slots
    ['with leading slot', { props: { ...props, modelValue: '1' }, slots: { leading: () => 'Leading slot' } }],
    ['with default slot', { props: { ...props, modelValue: '1' }, slots: { default: () => 'Default slot' } }],
    ['with trailing slot', { props: { ...props, modelValue: '1' }, slots: { trailing: () => 'Trailing slot' } }],
    ['with content slot', { props: { ...props, modelValue: '1' }, slots: { content: () => 'Content slot' } }],
    ['with body slot', { props: { ...props, modelValue: '1' }, slots: { body: () => 'Body slot' } }],
    ['with custom slot', { props: { ...props, modelValue: '5' }, slots: { custom: () => 'Custom slot' } }],
    ['with custom body slot', { props: { ...props, modelValue: '5' }, slots: { 'custom-body': () => 'Custom body slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: AccordionProps<typeof items>, slots?: Partial<AccordionSlots<typeof items>> }) => {
    const html = await ComponentRender(nameOrHtml, options, Accordion)
    expect(html).toMatchSnapshot()
  })

  test('should have the correct types', () => {
    // normal
    const test1 = () => Accordion({
      items: [{ label: 'foo', value: 'bar' }]
    })

    expectSlotProps('leading', test1).toEqualTypeOf<{ item: { label: string, value: string }, index: number, open: boolean }>()
    expectSlotProps('default', test1).toEqualTypeOf<{ item: { label: string, value: string }, index: number, open: boolean }>()
    expectSlotProps('trailing', test1).toEqualTypeOf<{ item: { label: string, value: string }, index: number, open: boolean }>()
    expectSlotProps('content', test1).toEqualTypeOf<{ item: { label: string, value: string }, index: number, open: boolean }>()
    expectSlotProps('body', test1).toEqualTypeOf<{ item: { label: string, value: string }, index: number, open: boolean }>()

    // custom + mixed
    const test2 = () => Accordion({
      items: [{ label: 'foo', value: 'bar', custom: 'nice' }, { label: 'baz' }, { label: 'foo', value: 'bar', custom: 1 }]
    })

    expectSlotProps('leading', test2).toEqualTypeOf<{ item: { label: string, value?: string, custom?: string | number }, index: number, open: boolean }>()
    expectSlotProps('default', test2).toEqualTypeOf<{ item: { label: string, value?: string, custom?: string | number }, index: number, open: boolean }>()
    expectSlotProps('trailing', test2).toEqualTypeOf<{ item: { label: string, value?: string, custom?: string | number }, index: number, open: boolean }>()
    expectSlotProps('content', test2).toEqualTypeOf<{ item: { label: string, value?: string, custom?: string | number }, index: number, open: boolean }>()
    expectSlotProps('body', test2).toEqualTypeOf<{ item: { label: string, value?: string, custom?: string | number }, index: number, open: boolean }>()

    // custom  + internal const
    const test3 = () => Accordion({
      items: [{ slot: 'foo', label: 'foo', value: 'bar' } as const, { slot: 'baz' } as const]
    })

    expectSlotProps('content', test3).toEqualTypeOf<{ item: { slot: 'foo' | 'baz', label?: 'foo', value?: 'bar' }, index: number, open: boolean }>()
    expectSlotProps('foo', test3).toEqualTypeOf<{ item: { slot: 'foo', label: 'foo', value: 'bar' }, index: number, open: boolean }>()
    expectSlotProps('baz', test3).toEqualTypeOf<{ item: { slot: 'baz', label?: undefined, value?: undefined }, index: number, open: boolean }>()
    expectSlotProps('foo-body', test3).toEqualTypeOf<{ item: { slot: 'foo', label: 'foo', value: 'bar' }, index: number, open: boolean }>()
    expectSlotProps('baz-body', test3).toEqualTypeOf<{ item: { slot: 'baz', label?: undefined, value?: undefined }, index: number, open: boolean }>()

    // custom  + external const
    const test6 = () => Accordion({
      items: [{ slot: 'foo', label: 'foo', value: 'bar' }, { slot: 'salut', value: '' }] as const
    })

    expectSlotProps('content', test6).toEqualTypeOf<{ item: { slot: 'salut' | 'foo', value: '' | 'bar', label?: 'foo' }, index: number, open: boolean }>()
    expectSlotProps('foo', test6).toEqualTypeOf<{ item: { slot: 'foo', label: 'foo', value: 'bar' }, index: number, open: boolean }>()
    expectSlotProps('salut', test6).toEqualTypeOf<{ item: { slot: 'salut', value: '' }, index: number, open: boolean }>()
    expectSlotProps('foo-body', test6).toEqualTypeOf<{ item: { slot: 'foo', label: 'foo', value: 'bar' }, index: number, open: boolean }>()
    expectSlotProps('salut-body', test6).toEqualTypeOf<{ item: { slot: 'salut', value: '' }, index: number, open: boolean }>()
  })
})
