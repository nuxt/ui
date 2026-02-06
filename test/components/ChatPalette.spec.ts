import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ChatPalette from '../../src/runtime/components/ChatPalette.vue'
import type { ChatPaletteProps, ChatPaletteSlots } from '../../src/runtime/components/ChatPalette.vue'
import ComponentRender from '../component-render'

describe('ChatPalette', () => {
  it.each([
    // Props
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'absolute' } }],
    ['with ui', { props: { ui: { prompt: 'py-5' } } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with prompt slot', { slots: { prompt: () => 'Prompt slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: ChatPaletteProps, slots?: Partial<ChatPaletteSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, ChatPalette)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(ChatPalette)

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
