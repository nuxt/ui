import { describe, it, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import Textarea, { type TextareaProps } from '../../src/runtime/components/Textarea.vue'
import ComponentRender from '../component-render'

describe('Textarea', () => {
  it.each([
    ['basic case', {}],
    ['with id', { props: { id: 'exampleId' } }],
    ['with name', { props: { name: 'exampleName' } }],
    ['with placeholder', { props: { placeholder: 'examplePlaceholder' } }],
    ['with required', { props: { required: true } }],
    ['with disabled', { props: { disabled: true } }],
    ['with rows', { props: { rows: 5 } }],
    ['with size', { props: { size: 'sm' as const } }],
    ['with color', { props: { color: 'blue' as const } }],
    ['with size 2xs', { props: { size: '2xs' as const } }],
    ['with size xs', { props: { size: 'xs' as const } }],
    ['with size sm', { props: { size: 'sm' as const } }],
    ['with size md', { props: { size: 'md' as const } }],
    ['with size lg', { props: { size: 'lg' as const } }],
    ['with size xl', { props: { size: 'xl' as const } }],
    ['with variant', { props: { variant: 'outline' as const } }],
    ['with default slot', { slots: { default: () => 'Default slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: TextareaProps, slots?: any }) => {
    const html = await ComponentRender(nameOrHtml, options, Textarea)
    expect(html).toMatchSnapshot()
  })

  it.each([
    ['with .trim modifier', { props: { modelModifiers: { trim: true } } }, { input: 'input  ', expected: 'input' }],
    ['with .number modifier', { props: { modelModifiers: { number: true } } }, { input: '42', expected: 42 }],
    ['with .lazy modifier', { props: { modelModifiers: { lazy: true } } }, { input: 'input', expected: 'input' }]
  ])('%s works', async (_nameOrHtml: string, options: { props?: any, slots?: any }, spec: { input: any, expected: any }) => {
    const wrapper = await mount(Textarea, {
      ...options
    })

    const input = wrapper.find('textarea')
    await input.setValue(spec.input)

    expect(wrapper.emitted()).toMatchObject({ 'update:modelValue': [[spec.expected]] })
  })

  test('with .lazy modifier updates on change only', async () => {
    const wrapper = mount(Textarea, {
      props: {
        modelModifiers: { lazy: true }
      }
    })

    const input = wrapper.find('textarea')
    await input.trigger('update')
    expect(wrapper.emitted()).toMatchObject({ })

    await input.trigger('change')
    expect(wrapper.emitted()).toMatchObject({ 'update:modelValue': [['']] })
  })
})
