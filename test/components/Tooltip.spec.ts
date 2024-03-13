import { describe, it, expect } from 'vitest'
import Tooltip, { type TooltipProps } from '../../src/runtime/components/Tooltip.vue'
import ComponentRender from '../component-render'

describe.skip('Tooltip', () => {
  it.each([
    ['with text', { props: { text: 'Tooltip', open: true }, slots: { default: () => 'Hover me' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: TooltipProps, slots?: any }) => {
    const html = await ComponentRender(nameOrHtml, options, Tooltip)
    expect(html).toMatchSnapshot()
  })
})
