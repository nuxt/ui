import { describe, it, expect } from 'vitest'
import { USelect } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Select', () => {
  it.each([
    ['basic case', {}],
    ['with custom id', { props: { id: 'mySelect' }, options: {} }],
    ['with custom name', { props: { name: 'mySelectInput' }, options: {} }],
    ['with placeholder', { props: { placeholder: 'Select an option' }, options: {} }],
    ['with disabled', { props: { disabled: true }, options: {} }],
    ['with icon', { props: { icon: 'i-heroicons-academic-cap' }, options: {} }],
    ['with loading icon', { props: { loadingIcon: 'i-heroicons-adjustments-horizontal' }, options: {} }],
    ['with leading icon', { props: { leadingIcon: 'i-heroicons-adjustments-vertical' }, options: {} }],
    ['with trailing icon', { props: { trailingIcon: 'i-heroicons-archive-box' }, options: {} }],
    ['with trailing', { props: { trailing: true }, options: {} }],
    ['with leading', { props: { leading: true }, options: {} }],
    ['with loading', { props: { loading: true }, options: {} }],
    ['with padded', { props: { padded: false }, options: {} }],
    ['with custom size', { props: { size: 'lg' }, options: {} }],
    ['with custom color', { props: { color: 'blue' }, options: {} }],
    ['with custom variant', { props: { variant: 'outlined' }, options: {} }],
    ['with custom options', { props: { options: [{ value: 'opt1', label: 'Option 1' }, { value: 'opt2', label: 'Option 2' }] }, options: {} }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Select.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, USelect)
    expect(html).toMatchSnapshot()
  })
})
