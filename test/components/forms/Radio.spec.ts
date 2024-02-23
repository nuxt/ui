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
    ['with label', { props: { label: 'Radio Label' } }],
    ['with help', { props: { label: 'Radio Label', help: 'Help text' } }],
    ['with required', { props: { label: 'Radio Label', required: true } }],
    ['with custom color', { props: { color: 'blue' } }],
    ['with inputClass', { props: { class: 'w-full' } }],
    ['with label slot', { slots: { label: () => 'Label slot' } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof URadio.props>) => {
    const html = await ComponentRender(nameOrHtml, options, URadio)
    expect(html).toMatchSnapshot()
  })
})
