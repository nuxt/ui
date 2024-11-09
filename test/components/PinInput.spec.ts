import { describe, it, expect } from 'vitest'
import PinInput, { type PinInputProps } from '../../src/runtime/components/PinInput.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/pin-input'

describe('PinInput', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const variants = Object.keys(theme.variants.variant) as any

  it.each([
    // Props
    ['with as', { props: { as: 'div' } }],
    ['with modelValue', { props: { modelValue: [] } }],
    ['with defaultValue', { props: { defaultValue: ['1'] } }],
    ['with type', { props: { type: 'text' } }],
    ['with placeholder', { props: { placeholder: '*' } }],
    ['with length', { props: { length: 6 } }],
    ['with disabled', { props: { disabled: true } }],
    ['with required', { props: { required: true } }],
    ['with otp', { props: { otp: true } }],
    ['with id', { props: { id: 'pin-input-id' } }],
    ['with name', { props: { name: 'pin-input' } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { size } }]),
    ...variants.map((variant: string) => [`with primary variant ${variant}`, { props: { variant } }]),
    ...variants.map((variant: string) => [`with neutral variant ${variant}`, { props: { variant, color: 'neutral' } }]),
    ['with highlight', { props: { highlight: true } }],
    ['with class', { props: { class: '' } }],
    ['with ui', { props: { ui: {} } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: PinInputProps }) => {
    const html = await ComponentRender(nameOrHtml, options, PinInput)
    expect(html).toMatchSnapshot()
  })
})
