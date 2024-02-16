import { describe, it, expect } from 'vitest'
import { URadioGroup } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('RadioGroup', () => {
  it.each([
    ['basic case', {}],
    ['with legend', { props: { legend: 'Radio Group Legend' } }],
    ['with slot legend', { slots: { legend: 'Radio Group Slot Legend' } }],
    ['with options and legend', { props: { options: [{ label: 'Option 1', value: 'option1' }, { label: 'Option 2', value: 'option2' }] } }],
    ['with disabled', { props: { disabled: true, options: [{ label: 'Option 1', value: 'option1' }, { label: 'Option 2', value: 'option2' }] } }],
    ['with custom color', { props: { color: 'red', options: [{ label: 'Option 1', value: 'option1' }, { label: 'Option 2', value: 'option2' }] } }],
    ['with label', { props: { label: 'label' } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof RadioGroup.props>) => {
    const html = await ComponentRender(nameOrHtml, options, URadioGroup)
    expect(html).toMatchSnapshot()
  })
})
