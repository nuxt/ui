import { describe, it, expect } from 'vitest'
import Toolbar, { type ToolbarProps, type ToolbarSlots } from '../../src/runtime/components/Toolbar.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/toolbar'

describe('Toolbar', () => {
  const variants = Object.keys(theme.variants.variant) as any
  const sizes = Object.keys(theme.variants.size) as any

  it.each([
    // Props
    ['with as', { props: { as: 'section' } }],
    ...variants.map((variant: string) => [`with variant ${variant}`, { props: { variant } }]),
    ...sizes.map((size: string) => [`with variant ${size}`, { props: { size } }]),
    ['with class', { props: { class: 'border-0 border-b' } }],
    ['with ui', { props: { ui: { root: 'border-x-0' } } }],
    // Slots
    ['with left slot', { slots: { left: () => 'Left slot' } }],
    ['with title slot', { slots: { title: () => 'Title slot' } }],
    ['with right slot', { slots: { right: () => 'Right slot' } }],
    ['with center slot', { slots: { center: () => 'Center slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: ToolbarProps, slots?: Partial<ToolbarSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, Toolbar)
    expect(html).toMatchSnapshot()
  })
})
