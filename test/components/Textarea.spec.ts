import { describe, it, expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import Textarea, { type TextareaProps, type TextareaSlots } from '../../src/runtime/components/Textarea.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/textarea'

describe('Textarea', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const colors = Object.keys(theme.variants.color) as any
  const variants = Object.keys(theme.variants.variant) as any

  it.each([
    // Props
    ['with id', { props: { id: 'exampleId' } }],
    ['with name', { props: { name: 'exampleName' } }],
    ['with placeholder', { props: { placeholder: 'examplePlaceholder' } }],
    ['with required', { props: { required: true } }],
    ['with disabled', { props: { disabled: true } }],
    ['with rows', { props: { rows: 5 } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { size } }]),
    ...colors.map((color: string) => [`with color ${color}`, { props: { color } }]),
    ...variants.map((variant: string) => [`with variant ${variant}`, { props: { variant } }]),
    ['with class', { props: { class: 'w-48' } }],
    ['with ui', { props: { ui: { wrapper: 'ms-4' } } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: TextareaProps, slots?: Partial<TextareaSlots> }) => {
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
