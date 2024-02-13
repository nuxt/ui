import { describe, it, expect } from 'vitest'
import { UMeterGroup } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('MeterGroup', () => {
  it.each([
    ['basic case', {}],
    ['with custom min and max values', { props: { min: 10, max: 200 } }],
    ['with custom size', { props: { size: 'sm' } }],
    ['with indicator', { props: { indicator: true } }],
    ['with custom icon', { props: { icon: 'custom-icon' } }],
    ['with custom class', { props: { class: 'custom-class' } }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof MeterGroup.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, UMeterGroup)
    expect(html).toMatchSnapshot()
  })
})
