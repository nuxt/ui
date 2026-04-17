import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import ChatMessage from '../../src/runtime/components/ChatMessage.vue'
import theme from '#build/ui/chat-message'

describe('ChatMessage', () => {
  const variants = Object.keys(theme.variants.variant) as any
  const props = {
    id: '6045235a-a435-46b8-989d-2df38ca2eb47',
    role: 'user' as const,
    parts: [{ type: 'text' as const, text: 'Hello, how are you?' }]
  }

  renderEach(ChatMessage, [
    // Props
    ['with parts', { props }],
    ['with content', { props: { ...props, content: 'Hello, how are you?' } }],
    ['with icon', { props: { ...props, icon: 'i-lucide-user' } }],
    ['with avatar', { props: { ...props, avatar: { src: 'https://github.com/benjamincanac.png' } } }],
    ['with role assistant', { props: { ...props, role: 'assistant' } }],
    ['with side right', { props: { ...props, side: 'right' } }],
    ['with compact', { props: { ...props, compact: true } }],
    ...variants.map((variant: string) => [`with variant ${variant}`, { props: { ...props, variant } }]),
    ['with as', { props: { ...props, as: 'section' } }],
    ['with class', { props: { ...props, class: '' } }],
    ['with ui', { props: { ...props, ui: {} } }],
    // Slots
    ['with leading slot', { props, slots: { leading: () => 'Leading slot' } }],
    ['with files slot', { props: { ...props, parts: [...props.parts, { type: 'file' as const, mediaType: 'text/plain', url: 'https://example.com/test.txt', filename: 'test.txt' }] }, slots: { files: () => 'Files slot' } }],
    ['with content slot', { props, slots: { content: () => 'Content slot' } }],
    ['with actions slot', { props, slots: { actions: () => 'Actions slot' } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(ChatMessage, {
      props
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
