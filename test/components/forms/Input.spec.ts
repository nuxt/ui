import { describe, it, expect } from 'vitest'
import { UInput } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Input', () => {
  it.each([
    ['basic case', {}],
    ['with custom name and placeholder', { props: { name: 'username', placeholder: 'Enter your username' } }],
    ['with value', { props: { value: 'JohnDoe' } }],
    ['with disabled', { props: { disabled: true } }],
    ['with readonly', { props: { readonly: true } }],
    ['with autofocus', { props: { autofocus: true } }],
    ['with required', { props: { required: true } }],
    ['with custom class', { props: { class: 'custom-class' } }],
    ['with custom style', { props: { style: { color: 'red', fontSize: '16px' } } }],
    ['with custom type', { props: { type: 'password' } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Input.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, UInput)
    expect(html).toMatchSnapshot()
  })
})
