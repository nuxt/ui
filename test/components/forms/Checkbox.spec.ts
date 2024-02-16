import { describe, it, expect } from 'vitest'
import { UCheckbox } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Checkbox', () => {
  it.each([
    ['basic case', {}],
    ['with label', { props: { label: 'Label' } }],
    ['with slot label', { slots: { label: 'Label slot' } }],
    ['with custom id', { props: { id: 'custom-id' } }],
    ['with custom value', { props: { value: 'custom-value' } }],
    ['with custom name', { props: { name: 'custom-name' } }],
    ['with disabled', { props: { disabled: true } }],
    ['with indeterminate', { props: { indeterminate: true } }],
    ['with help', { props: { label: 'Label', help: 'Help' } }],
    ['with required', { props: { label: 'Label', required: true } }],
    ['with custom color', { props: { label: 'Label', color: 'red' } }],
    ['with custom input class', { props: { inputClass: 'w-full h-full' } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Checkbox.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UCheckbox)
    expect(html).toMatchSnapshot()
  })
})
