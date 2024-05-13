import { describe, it, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import Input, { type InputProps, type InputSlots } from '../../src/runtime/components/Input.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/input'

describe('Input', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const colors = Object.keys(theme.variants.color) as any
  const variants = Object.keys(theme.variants.variant) as any

  it.each([
    // Props
    ['with id', { props: { id: 'id' } }],
    ['with name', { props: { name: 'name' } }],
    ['with type', { props: { type: 'password' } }],
    ['with placeholder', { props: { placeholder: 'Search...' } }],
    ['with disabled', { props: { disabled: true } }],
    ['with required', { props: { required: true } }],
    ['with icon', { props: { icon: 'i-heroicons-magnifying-glass' } }],
    ['with leading and icon', { props: { leading: true, icon: 'i-heroicons-magnifying-glass' } }],
    ['with leadingIcon', { props: { leadingIcon: 'i-heroicons-magnifying-glass' } }],
    ['with trailing and icon', { props: { trailing: true, icon: 'i-heroicons-magnifying-glass' } }],
    ['with trailingIcon', { props: { trailingIcon: 'i-heroicons-magnifying-glass' } }],
    ['with loading', { props: { loading: true } }],
    ['with loadingIcon', { props: { loading: true, loadingIcon: 'i-heroicons-sparkles' } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { size } }]),
    ...colors.map((color: string) => [`with color ${color}`, { props: { color } }]),
    ...variants.map((variant: string) => [`with variant ${variant}`, { props: { variant } }]),
    ['with class', { props: { class: 'absolute' } }],
    ['with ui', { props: { ui: { base: 'rounded-full' } } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with leading slot', { slots: { leading: () => 'Leading slot' } }],
    ['with trailing slot', { slots: { trailing: () => 'Trailing slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: InputProps, slots?: Partial<InputSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, Input)
    expect(html).toMatchSnapshot()
  })

  it.each([
    ['with .trim modifier', { props: { modelModifiers: { trim: true } } }, { input: 'input  ', expected: 'input' }],
    ['with .number modifier', { props: { modelModifiers: { number: true } } }, { input: '42', expected: 42 }],
    ['with .lazy modifier', { props: { modelModifiers: { lazy: true } } }, { input: 'input', expected: 'input' }]
  ])('%s works', async (_nameOrHtml: string, options: { props?: any, slots?: any }, spec: { input: any, expected: any }) => {
    const wrapper = mount(Input, {
      ...options
    })

    const input = wrapper.find('input')
    await input.setValue(spec.input)

    expect(wrapper.emitted()).toMatchObject({ 'update:modelValue': [[spec.expected]] })
  })

  test('with .lazy modifier updates on change only', async () => {
    const wrapper = mount(Input, {
      props: {
        modelModifiers: { lazy: true }
      }
    })

    const input = wrapper.find('input')
    await input.trigger('update')
    expect(wrapper.emitted()).toMatchObject({ })

    await input.trigger('change')
    expect(wrapper.emitted()).toMatchObject({ 'update:modelValue': [['']] })
  })
})
