import { describe, it, expect } from 'vitest'
import RadioGroup, { type RadioGroupProps, type RadioGroupSlots } from '../../src/runtime/components/RadioGroup.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/radio-group'

describe('RadioGroup', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const colors = Object.keys(theme.variants.color) as any

  const options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' }
  ]

  it.each([
    ['with options', { props: { options } }],
    ['with defaultValue', { props: { options, defaultValue: '1' } }],
    ['with disabled', { props: { options, disabled: true } }],
    ['with description', { props: { options: options.map((opt, count) => ({ ...opt, description: `Description ${count}` })) } }],
    ['with required', { props: { options, legend: 'Legend', required: true } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { options, size } }]),
    ...colors.map((color: string) => [`with color ${color}`, { props: { options, color } }]),
    ['with class', { props: { options, class: 'absolute' } }],
    ['with ui', { props: { ui: { options, wrapper: 'ms-4' } } }],
    ['with orientation', { props: { options, orientation: 'horizontal' } }],
    // Slots
    ['with legend slot', { props: { options }, slots: { label: () => 'Legend slot' } }],
    ['with label slot', { props: { options }, slots: { label: () => 'Label slot' } }],
    ['with description slot', { slots: { label: () => 'Description slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: RadioGroupProps<any>, slots?: Partial<RadioGroupSlots<any>> }) => {
    const html = await ComponentRender(nameOrHtml, options, RadioGroup)
    expect(html).toMatchSnapshot()
  })
})
