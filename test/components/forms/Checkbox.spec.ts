import { describe, it, expect } from 'vitest'
import { UCheckbox } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Checkbox', () => {
  it.each([
    ['basic case', {}],
    ['with custom id', { props: { id: 'custom-id' } }],
    ['with custom value', { props: { value: 'custom-value' } }],
    ['with custom name', { props: { name: 'custom-name' } }],
    ['disabled set to true', { props: { disabled: true } }],
    ['indeterminate set to true', { props: { indeterminate: true } }],
    ['with help text', { props: { help: 'Help text' } }],
    ['with label', { props: { label: 'Label' } }],
    ['required set to true', { props: { required: true } }],
    ['with custom color', { props: { color: 'blue' } }],
    ['with custom input class', { props: { inputClass: 'custom-input-class' } }],
    ['with custom class', { props: { class: 'custom-class' } }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Checkbox.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, UCheckbox)
    expect(html).toMatchSnapshot()
  })
})
