import { describe, it, expect } from 'vitest'
import { URadio } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Radio', () => {
  it.each([
    ['basic case', {}],
    ['with custom id', { props: { id: 'custom-radio-id' } }],
    ['with value', { props: { value: 'option1' } }],
    ['with name', { props: { name: 'radioName' } }],
    ['with disabled', { props: { disabled: true } }],
    ['with help', { props: { help: 'Some help text' } }],
    ['with label', { props: { label: 'Radio Label' } }],
    ['with required', { props: { required: true } }],
    ['with custom color', { props: { color: 'blue' } }],
    ['with custom class', { props: { class: 'custom-class' } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Radio.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, URadio)
    expect(html).toMatchSnapshot()
  })
})
