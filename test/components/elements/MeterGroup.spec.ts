import { describe, it, expect } from 'vitest'
import { UMeterGroup } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('MeterGroup', () => {
  it.each([
    // TODO: try to fix TypeError: The "path" argument must be of type string. Received undefined
    ['basic case', {}]
    // ['with custom min and max values', { props: { min: 10, max: 200 } }],
    // ['with custom size', { props: { size: 'sm' } }],
    // ['with indicator', { props: { indicator: true } }],
    // ['with custom icon', { props: { icon: 'custom-icon' } }],
    // ['with custom class', { props: { class: 'custom-class' } }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UMeterGroup.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UMeterGroup)
    expect(html).toMatchSnapshot()
  })
})
