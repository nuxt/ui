import { describe, it, expect } from 'vitest'
import Main from '../../src/runtime/components/Main.vue'
import type { MainProps, MainSlots } from '../../src/runtime/components/Main.vue'
import ComponentRender from '../component-render'

describe('Main', () => {
  it.each([
    // Props
    ['with as', { props: { as: 'div' } }],
    ['with class', { props: { class: 'min-h-full' } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: MainProps, slots?: Partial<MainSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, Main)
    expect(html).toMatchSnapshot()
  })
})
