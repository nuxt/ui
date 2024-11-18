import { describe, it, expect } from 'vitest'
import ColorPicker, { type ColorPickerProps, type ColorPickerSlots } from '../../src/runtime/components/ColorPicker.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/color-picker'

describe('ColorPicker', () => {
  const sizes = Object.keys(theme.variants.size) as any

  it.each([
    // Props
    ['with inline', { props: { inline: true } }],
    ['with disabled', { props: { disabled: true } }],
    ['with as', { props: { as: 'div' } }],
    ['with class', { props: { class: 'w-96' } }],
    ['with ui', { props: { ui: { root: 'w-96' } } }],
    ...sizes.map((size: string) => [`with size ${size}`]),
    // Slots
    ['with trigger slot', { slots: { trigger: () => 'Trigger' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: ColorPickerProps, slots?: Partial<ColorPickerSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, ColorPicker)
    expect(html).toMatchSnapshot()
  })
})
