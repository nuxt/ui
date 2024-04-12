import { describe, it, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import Input, { type InputProps } from '../../src/runtime/components/Input.vue'
import ComponentRender from '../component-render'

describe('Input', () => {
  it.each([
    ['basic case', {}],
    ['with name', { props: { name: 'username' } }],
    ['with type', { props: { type: 'password' } }],
    ['with placeholder', { props: { placeholder: 'Enter your username' } }],
    ['with disabled', { props: { disabled: true } }],
    ['with required', { props: { required: true } }],
    ['with icon', { props: { icon: 'i-heroicons-magnifying-glass' } }],
    ['with leading and icon', { props: { leading: true, icon: 'i-heroicons-magnifying-glass' } }],
    ['with leadingIcon', { props: { leadingIcon: 'i-heroicons-magnifying-glass' } }],
    ['with trailing and icon', { props: { trailing: true, icon: 'i-heroicons-magnifying-glass' } }],
    ['with trailingIcon', { props: { trailingIcon: 'i-heroicons-magnifying-glass' } }],
    ['with loading', { props: { loading: true } }],
    ['with loadingIcon', { props: { loading: true, loadingIcon: 'i-heroicons-sparkles' } }],
    ['with size 2xs', { props: { size: '2xs' as const } }],
    ['with size xs', { props: { size: 'xs' as const } }],
    ['with size sm', { props: { size: 'sm' as const } }],
    ['with size md', { props: { size: 'md' as const } }],
    ['with size lg', { props: { size: 'lg' as const } }],
    ['with size xl', { props: { size: 'xl' as const } }],
    ['with color', { props: { color: 'red' as const } }],
    ['with variant', { props: { variant: 'outline' as const } }],
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with leading slot', { slots: { leading: () => 'Leading slot' } }],
    ['with trailing slot', { slots: { trailing: () => 'Trailing slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: InputProps, slots?: any }) => {
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
