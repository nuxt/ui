import { describe, it, expect } from 'vitest'
import { URadioGroup } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('RadioGroup', () => {
  it.each([
    ['basic case', {}],
    ['with name and legend', { props: { name: 'radioGroupName', legend: 'Radio Group Legend' } }],
    ['with options and legend', { props: { options: [{ label: 'Option 1', value: 'option1' }, { label: 'Option 2', value: 'option2' }], legend: 'Radio Group Legend' } }],
    ['with optionAttribute and legend', { props: { optionAttribute: 'name', legend: 'Radio Group Legend' } }],
    ['with valueAttribute and legend', { props: { valueAttribute: 'id', legend: 'Radio Group Legend' } }],
    ['with disabled and legend', { props: { disabled: true, legend: 'Radio Group Legend' } }],
    ['with custom color and legend', { props: { color: 'blue', legend: 'Radio Group Legend' } }],
    ['with custom class and legend', { props: { class: 'custom-class', legend: 'Radio Group Legend' } }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof RadioGroup.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, URadioGroup)
    expect(html).toMatchSnapshot()
  })
})
