import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import ChatMessages from '../../src/runtime/components/ChatMessages.vue'

describe('ChatMessages', () => {
  const statuses = ['ready', 'submitted', 'streaming', 'error'] as any

  const props = {
    messages: [{
      id: '6045235a-a435-46b8-989d-2df38ca2eb47',
      role: 'user' as const,
      parts: [{ type: 'text' as const, text: 'Hello, how are you?' }]
    }, {
      id: '6045235a-a435-46b8-989d-2df38ca2eb47',
      role: 'assistant' as const,
      parts: [{ type: 'text' as const, text: 'I am fine, thank you!' }]
    }]
  }

  renderEach(ChatMessages, [
    // Props
    ['with messages', { props }],
    ['with user', { props: { ...props, user: { avatar: { src: 'https://github.com/benjamincanac.png' }, variant: 'soft', side: 'right' } } }],
    ['with assistant', { props: { ...props, assistant: { avatar: { icon: 'i-lucide-bot' } } } }],
    ...statuses.map((status: string) => [`with status ${status}`, { props: { ...props, status } }]),
    ['with compact', { props: { ...props, compact: true } }],
    ['with class', { props: { ...props, class: 'max-w-3xl' } }],
    ['with ui', { props: { ...props, ui: { autoScroll: 'bottom-0' } } }],
    // Slots
    ['with default slot', { props, slots: { default: () => 'Default slot' } }],
    ['with indicator slot', { props: { ...props, status: 'submitted' }, slots: { indicator: () => 'Indicator slot' } }],
    ['with viewport slot', { props, slots: { viewport: () => 'Viewport slot' } }],
    ['with content slot', { props, slots: { content: () => 'Content slot' } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(ChatMessages, {
      props
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
