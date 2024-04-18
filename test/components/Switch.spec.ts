import { describe, it, expect } from 'vitest'
import Switch, { type SwitchProps, type SwitchSlots } from '../../src/runtime/components/Switch.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/switch'

describe('Switch', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const colors = Object.keys(theme.variants.color) as any

  it.each([
    // Props
    ['with as', { props: { as: 'section' } }],
    ['with defaultValue', { props: { defaultValue: true } }],
    ['with id', { props: { id: 'custom-id' } }],
    ['with name', { props: { name: 'custom-name' } }],
    ['with value', { props: { value: 'custom-value' } }],
    ['with disabled', { props: { disabled: true } }],
    ['with checkedIcon', { props: { checkedIcon: 'i-heroicons-check-20-solid', defaultValue: true } }],
    ['with uncheckedIcon', { props: { uncheckedIcon: 'i-heroicons-x-mark-20-solid' } }],
    ['with loading', { props: { loading: true } }],
    ['with loadingIcon', { props: { loading: true, loadingIcon: 'i-heroicons-sparkles' } }],
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
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: SwitchProps, slots?: Partial<SwitchSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, Switch)
    expect(html).toMatchSnapshot()
  })
})
