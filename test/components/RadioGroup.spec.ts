import { describe, it, expect } from 'vitest'
import RadioGroup, { type RadioGroupProps, type RadioGroupSlots } from '../../src/runtime/components/RadioGroup.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/radio-group'

describe('RadioGroup', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const colors = Object.keys(theme.variants.color) as any

  const items = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' }
  ]

  it.each([
    ['with items', { props: { items } }],
    ['with defaultValue', { props: { items, defaultValue: '1' } }],
    ['with disabled', { props: { items, disabled: true } }],
    ['with description', { props: { items: items.map((opt, count) => ({ ...opt, description: `Description ${count}` })) } }],
    ['with required', { props: { items, legend: 'Legend', required: true } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { items, size } }]),
    ...colors.map((color: string) => [`with color ${color}`, { props: { items, color } }]),
    ['with class', { props: { items, class: 'absolute' } }],
    ['with ui', { props: { ui: { items, wrapper: 'ms-4' } } }],
    ['with orientation', { props: { items, orientation: 'horizontal' } }],
    // Slots
    ['with legend slot', { props: { items }, slots: { label: () => 'Legend slot' } }],
    ['with label slot', { props: { items }, slots: { label: () => 'Label slot' } }],
    ['with description slot', { props: { items }, slots: { label: () => 'Description slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: RadioGroupProps<any>, slots?: Partial<RadioGroupSlots<any>> }) => {
    const html = await ComponentRender(nameOrHtml, options, RadioGroup)
    expect(html).toMatchSnapshot()
  })
})
