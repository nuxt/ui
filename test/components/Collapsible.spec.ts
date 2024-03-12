import { describe, it, expect } from 'vitest'
import Collapsible, { type CollapsibleProps } from '../../src/runtime/components/Collapsible.vue'
import ComponentRender from '../component-render'

describe('Collapsible', () => {
  it.each([
    ['basic case', { props: { open: true }, slots: { default: () => 'Click me', content: () => 'Collapsible content' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: CollapsibleProps, slots?: any }) => {
    const html = await ComponentRender(nameOrHtml, options, Collapsible)
    expect(html).toMatchSnapshot()
  })
})