import { describe, it, expect } from 'vitest'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'
import { URadioGroup } from '#components'

describe('RadioGroup', () => {
  it.each([
    ['basic case', { props: { options: [{ value: 'value', label: 'label' }] } }],
    ['help text', { props: { options: [{ value: 'value', label: 'label', help: 'i need somebody' }] } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof URadioGroup.props>) => {
    const html = await ComponentRender(nameOrHtml, options, URadioGroup)
    expect(html).toMatchSnapshot()
  })
})
