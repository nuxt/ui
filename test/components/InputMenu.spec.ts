import { describe, it, expect } from 'vitest'
import InputMenu, { type InputMenuProps, type InputMenuSlots } from '../../src/runtime/components/InputMenu.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/input'

describe('InputMenu', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const colors = Object.keys(theme.variants.color) as any
  const variants = Object.keys(theme.variants.variant) as any

  const items = [{
    label: 'Backlog',
    icon: 'i-heroicons-question-mark-circle'
  }, {
    label: 'Todo',
    icon: 'i-heroicons-plus-circle'
  }, {
    label: 'In Progress',
    icon: 'i-heroicons-arrow-up-circle'
  }, {
    label: 'Done',
    icon: 'i-heroicons-check-circle'
  }, {
    label: 'Canceled',
    icon: 'i-heroicons-x-circle'
  }]

  const props = { open: true, portal: false, items }

  it.each([
    // Props
    ['with items', { props }],
    ['with modelValue', { props: { ...props, modelValue: items[0] } }],
    ['with defaultValue', { props: { ...props, defaultValue: items[0] } }],
    ['with id', { props: { ...props, id: 'id' } }],
    ['with name', { props: { ...props, name: 'name' } }],
    ['with placeholder', { props: { ...props, placeholder: 'Select a status' } }],
    ['with disabled', { props: { ...props, disabled: true } }],
    ['with required', { props: { ...props, required: true } }],
    ['with icon', { props: { ...props, icon: 'i-heroicons-magnifying-glass' } }],
    ['with leading and icon', { props: { ...props, leading: true, icon: 'i-heroicons-magnifying-glass' } }],
    ['with leadingIcon', { props: { ...props, leadingIcon: 'i-heroicons-magnifying-glass' } }],
    ['with trailing and icon', { props: { ...props, trailing: true, icon: 'i-heroicons-magnifying-glass' } }],
    ['with trailingIcon', { props: { ...props, trailingIcon: 'i-heroicons-magnifying-glass' } }],
    ['with loading', { props: { ...props, loading: true } }],
    ['with loadingIcon', { props: { ...props, loading: true, loadingIcon: 'i-heroicons-sparkles' } }],
    ['with trailingIcon', { props: { ...props, trailingIcon: 'i-heroicons-chevron-down' } }],
    ['with selectedIcon', { props: { ...props, selectedIcon: 'i-heroicons-check' } }],
    ['with arrow', { props: { ...props, arrow: true } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { ...props, size } }]),
    ...colors.map((color: string) => [`with color ${color}`, { props: { ...props, color } }]),
    ...variants.map((variant: string) => [`with variant ${variant}`, { props: { ...props, variant } }]),
    ['with as', { props: { ...props, as: 'section' } }],
    ['with class', { props: { ...props, class: 'absolute' } }],
    ['with ui', { props: { ...props, ui: { group: 'p-2' } } }],
    // Slots
    ['with leading slot', { slots: { leading: () => 'Leading slot' } }],
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with trailing slot', { slots: { trailing: () => 'Trailing slot' } }],
    ['with item slot', { props, slots: { item: () => 'Item slot' } }],
    ['with item-leading slot', { props, slots: { 'item-leading': () => 'Item leading slot' } }],
    ['with item-label slot', { props, slots: { 'item-label': () => 'Item label slot' } }],
    ['with item-trailing slot', { props, slots: { 'item-trailing': () => 'Item trailing slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: InputMenuProps<typeof items[number]>, slots?: Partial<InputMenuSlots<typeof items[number]>> }) => {
    const html = await ComponentRender(nameOrHtml, options, InputMenu)
    expect(html).toMatchSnapshot()
  })
})
