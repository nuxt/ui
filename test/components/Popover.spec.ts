import { describe, it, expect } from 'vitest'
import Popover, { type PopoverProps } from '../../src/runtime/components/Popover.vue'
import ComponentRender from '../component-render'

describe('Popover', () => {
  it.each([
    ['basic case', { props: { open: true, portal: false, arrow: true }, slots: { default: () => 'Click me', content: () => 'Popover content' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: PopoverProps, slots?: any }) => {
    const html = await ComponentRender(nameOrHtml, options, Popover)
    expect(html).toMatchSnapshot()
  })
})
