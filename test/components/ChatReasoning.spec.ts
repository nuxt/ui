import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ChatReasoning from '../../src/runtime/components/ChatReasoning.vue'
import { renderEach } from '../component-render'

describe('ChatReasoning', () => {
  const props = {
    text: 'The user is asking about Vue components...'
  }

  renderEach(ChatReasoning, [
    // Props
    ['with text', { props }],
    ['with streaming', { props: { streaming: true } }],
    ['with duration', { props: { ...props, duration: 5 } }],
    ['with icon', { props: { ...props, icon: 'i-lucide-brain' } }],
    ['with defaultOpen', { props: { ...props, defaultOpen: true } }],
    ['with chevron leading', { props: { ...props, chevron: 'leading' } }],
    ['with chevronIcon', { props: { ...props, chevronIcon: 'i-lucide-arrow-down' } }],
    ['with class', { props: { ...props, class: 'my-5' } }],
    ['with ui', { props: { ...props, ui: { body: 'text-muted' } } }],
    // Slots
    ['with default slot', { props, slots: { default: () => 'Custom reasoning content' } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(ChatReasoning, {
      props
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
