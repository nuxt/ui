import { describe, it, expect } from 'vitest'
import { UTooltip } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'

describe('Tooltip', () => {
  it.each([
    ['basic case', {}],
    ['with text', { props: { text: 'tooltip text' } }],
    ['with slot text', { slots: { text: 'tooltip slot text' } }],
    ['with shortcuts', { props: { shortcuts: ['Cmd+k', 'Cmd+S'] } }],
    ['with default slot', { slots: { default: 'default slot' } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Tooltip.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UTooltip)
    expect(html).toMatchSnapshot()
  })
})
