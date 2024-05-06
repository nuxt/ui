import { describe, it, expect } from 'vitest'
import Checkbox, { type CheckboxProps, type CheckboxSlots } from '../../src/runtime/components/Checkbox.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/checkbox'

describe('Checkbox', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const colors = Object.keys(theme.variants.color) as any

  it.each([
    // Props
    ['with defaultValue', { props: { defaultValue: true } }],
    ['with id', { props: { id: 'id' } }],
    ['with name', { props: { name: 'name' } }],
    ['with value', { props: { value: 'value' } }],
    ['with disabled', { props: { disabled: true } }],
    ['with icon', { props: { icon: 'i-heroicons-heart' } }],
    ['with indeterminate', { props: { indeterminate: true } }],
    ['with indeterminateIcon', { props: { indeterminate: true, icon: 'i-heroicons-trash' } }],
    ['with label', { props: { label: 'Label' } }],
    ['with required', { props: { label: 'Label', required: true } }],
    ['with description', { props: { label: 'Label', description: 'Description' } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { size } }]),
    ...colors.map((color: string) => [`with color ${color}`, { props: { color } }]),
    ['with class', { props: { class: 'inline-flex' } }],
    ['with ui', { props: { ui: { wrapper: 'ms-4' } } }],
    // Slots
    ['with label slot', { slots: { label: () => 'Label slot' } }],
    ['with description slot', { slots: { label: () => 'Description slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: CheckboxProps, slots?: Partial<CheckboxSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, Checkbox)
    expect(html).toMatchSnapshot()
  })
})
