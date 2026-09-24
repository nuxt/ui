import { describe, it, expect, test } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import ColorPicker from '../../src/runtime/components/ColorPicker.vue'
import theme from '#build/ui/color-picker'

describe('ColorPicker', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const formats = [
    ['hex', '#00C16A'],
    ['rgb', 'rgb(0 193 106)'],
    ['hsl', 'hsl(153 100% 37.8%)'],
    ['cmyk', 'cmyk(100% 0% 45.08% 24.31%)'],
    ['lab', 'lab(68.88% -60.41% 32.55%)'],
    ['lch', 'lch(68.83 65.58 151.01)'],
    ['hwb', 'hwb(152.95 0% 24.31%)'],
  ]
  const alphaFormats = [
    ['hex', '#00C16A80'],
    ['rgb', 'rgb(0 193 106 / 50%)'],
    ['hsl', 'hsl(153 100% 37.8% / 50%)'],
    ['cmyk', 'cmyk(100% 0% 45.08% 24.31% / 50%)'],
    ['lab', 'lab(68.88% -60.41% 32.55% / 50%)'],
    ['lch', 'lch(68.83 65.58 151.01 / 50%)'],
    ['hwb', 'hwb(152.95 0% 24.31% / 50%)'],
  ]

  renderEach(ColorPicker, [
    // Props
    ['with disabled', { props: { disabled: true } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { size } }]),
    ...formats.map(format => [`with format ${format[0]}`, { props: { format: format[0], defaultValue: format[1] } }]),
    ...alphaFormats.map(format => [`with format having alpha channel ${format[0]}`, { props: { format: format[0], defaultValue: format[1], alphaTrack: true } }]),
    ['with decimals', { props: { decimals: 2 } }],
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'w-96' } }],
    ['with ui', { props: { ui: { picker: 'gap-8' } } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(ColorPicker)

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  describe('emits', () => {
    test('update:modelValue event', async () => {
      const wrapper = await mountSuspended(ColorPicker)
      await wrapper.setValue('#00C16A')

      expect(wrapper.emitted()).toMatchObject({ 'update:modelValue': [['#00C16A']] })
    })
  })
})
