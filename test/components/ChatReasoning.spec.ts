import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ChatReasoning from '../../src/runtime/components/ChatReasoning.vue'
import type { ChatReasoningProps, ChatReasoningSlots } from '../../src/runtime/components/ChatReasoning.vue'
import ComponentRender from '../component-render'

describe('ChatReasoning', () => {
  const props = { text: 'This is the reasoning content.' }

  it.each([
    // Props
    ['with text', { props }],
    ['with open', { props: { ...props, open: true } }],
    ['with defaultOpen', { props: { ...props, defaultOpen: true } }],
    ['with isStreaming', { props: { ...props, isStreaming: true } }],
    ['with duration', { props: { ...props, duration: 5 } }],
    ['with disabled', { props: { ...props, disabled: true } }],
    ['with icon', { props: { ...props, icon: 'i-lucide-brain' } }],
    ['with trailingIcon', { props: { ...props, trailingIcon: 'i-lucide-chevron-right' } }],
    ['with thinkingText', { props: { ...props, isStreaming: true, thinkingText: 'Processing...' } }],
    ['with thoughtText', { props: { ...props, thoughtText: 'Done thinking' } }],
    ['with thoughtDurationText', { props: { ...props, duration: 10, thoughtDurationText: 'Thought for {duration}s' } }],
    ['with class', { props: { ...props, class: 'my-4' } }],
    ['with ui', { props: { ...props, ui: { root: 'bg-muted' } } }],
    // Slots
    ['with default slot', { props: { open: true }, slots: { default: () => 'Default slot content' } }],
    ['with body slot', { props: { open: true }, slots: { body: () => 'Body slot content' } }],
    ['with trigger slot', { props, slots: { trigger: () => 'Custom trigger' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: ChatReasoningProps, slots?: Partial<ChatReasoningSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, ChatReasoning)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(ChatReasoning, {
      props: {
        text: 'Reasoning content for accessibility test',
        open: true
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
