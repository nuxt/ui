import { describe, it, expect } from 'vitest'
import { UCard } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'
import uiCard from '../../../src/runtime/ui.config/layout/card'

describe('Card', () => {
  it.each([
    ['basic case', { props: { ui: { body: { base: '' } } } }],
    ['with as', { props: { as: 'li', ui: { body: { base: '' } } } }],
    ['with default slot', { slots: { default: 'default slot' }, props: { ui: uiCard } }],
    ['with header slot', { slots: { header: 'Header slot' }, props: { ui: uiCard } }],
    ['with footer slot', { slots: { footer: 'Footer slot' }, props: { ui: uiCard } }]
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Card.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UCard)
    expect(html).toMatchSnapshot()
  })
})
