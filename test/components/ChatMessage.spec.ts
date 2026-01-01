import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ChatMessage from '../../src/runtime/components/ChatMessage.vue'
import type { ChatMessageProps, ChatMessageSlots } from '../../src/runtime/components/ChatMessage.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/chat-message'

describe('ChatMessage', () => {
  const variants = Object.keys(theme.variants.variant) as any
  const props = {
    id: '6045235a-a435-46b8-989d-2df38ca2eb47',
    role: 'user' as const,
    parts: [{ type: 'text' as const, text: 'Hello, how are you?' }]
  }

  it.each([
    // Props
    ['with parts', { props }],
    ['with content', { props: { ...props, content: 'Hello, how are you?' } }],
    ['with icon', { props: { ...props, icon: 'i-lucide-user' } }],
    ['with avatar', { props: { ...props, avatar: { src: 'https://github.com/benjamincanac.png' } } }],
    ['with role assistant', { props: { ...props, role: 'assistant' as const } }],
    ['with side right', { props: { ...props, side: 'right' } }],
    ['with compact', { props: { ...props, compact: true } }],
    ...variants.map((variant: string) => [`with variant ${variant}`, { props: { ...props, variant } }]),
    ['with as', { props: { ...props, as: 'section' } }],
    ['with class', { props: { ...props, class: '' } }],
    ['with ui', { props: { ...props, ui: {} } }],
    // Slots
    ['with content slot', { props, slots: { content: () => 'Content slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: ChatMessageProps, slots?: Partial<ChatMessageSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, ChatMessage)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(ChatMessage, {
      props
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
