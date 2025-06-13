import { describe, it, expect } from 'vitest'
import theme from '#build/ui/input'
import InputTags, { type InputTagsProps, type InputTagsSlots } from '../../src/runtime/components/InputTags.vue'
import ComponentRender from '../component-render'

describe('InputTags', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const variants = Object.keys(theme.variants.variant) as any

  it.each([
    // Props
    ['with modelValue', { props: { modelValue: ['test'] } }],
    ['with defaultValue', { props: { defaultValue: ['test'] } }],
    ['with id', { props: { id: 'id' } }],
    ['with name', { props: { name: 'name' } }],
    ['with placeholder', { props: { placeholder: 'Search...' } }],
    ['with disabled', { props: { disabled: true } }],
    ['with required', { props: { required: true } }],
    ['with icon', { props: { icon: 'i-lucide-search' } }],
    ['with trailing and icon', { props: { trailing: true, icon: 'i-lucide-arrow-right' } }],
    ['with trailingIcon', { props: { trailingIcon: 'i-lucide-arrow-right' } }],
    ['with loading', { props: { loading: true } }],
    ['with loading trailing', { props: { loading: true, trailing: true } }],
    ['with loadingIcon', { props: { loading: true, loadingIcon: 'i-lucide-loader' } }],
    ['with ariaLabel', { attrs: { 'aria-label': 'Aria label' } }],
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: '' } }],
    ['with ui', { props: { ui: {} } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { size } }]),
    ...variants.map((variant: string) => [`with primary variant ${variant}`, { props: { variant } }]),
    ...variants.map((variant: string) => [`with neutral variant ${variant}`, { props: { variant, color: 'neutral' } }]),
    // Slots
    ['with leading slot', { slots: { leading: () => 'Leading slot' } }],
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with trailing slot', { slots: { trailing: () => 'Trailing slot' } }],
    ['with item-text slot', { slots: { ['item-text']: () => 'Item Text slot' } }],
    ['with item-delete slot', { slots: { ['item-delete']: () => 'Item Delete slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: InputTagsProps, slots?: Partial<InputTagsSlots>, attrs?: Record<string, unknown> }) => {
    const html = await ComponentRender(nameOrHtml, options, InputTags)
    expect(html).toMatchSnapshot()
  })
})
