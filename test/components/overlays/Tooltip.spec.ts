import { describe, it, expect } from 'vitest'
import { UTooltip } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Tooltip', () => {
  it.each([
    ['basic case', {}],
    ['with text', { props: { text: 'tooltip text' } }],
    ['with shortcuts', { props: { shortcuts: ['G', 'I'] } }],
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with text slot', { slots: { text: () => 'Text slot' } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof UTooltip.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UTooltip)
    expect(html).toMatchSnapshot()
  })
})
