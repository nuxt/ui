import { describe, it, expect } from 'vitest'
import ColorPicker, { type ColorPickerProps } from '../../src/runtime/components/ColorPicker.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/color-picker'

describe('ColorPicker', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const formats = [
    ['hex', '#00C16A'],
    ['rgb', 'rgb(0, 193, 106)'],
    ['hsl', 'hsl(153, 100%, 37.8%)'],
    ['hwb', 'hwb(150, 0%, 24%)']
  ]

  it.each([
    // Props
    ['with disabled', { props: { disabled: true } }],
    ['with as', { props: { as: 'div' } }],
    ['with class', { props: { class: 'w-96' } }],
    ['with ui', { props: { ui: { root: 'w-96' } } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { size } }]),
    ...formats.map(format => [`with format ${format[0]}`, { props: { format: format[0], defaultValue: format[1] } }])
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: ColorPickerProps }) => {
    const html = await ComponentRender(nameOrHtml, options, ColorPicker)
    expect(html).toMatchSnapshot()
  })
})
