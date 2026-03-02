import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import ChatPromptSubmit from '../../src/runtime/components/ChatPromptSubmit.vue'

describe('ChatPromptSubmit', () => {
  const statuses = ['ready', 'submitted', 'streaming', 'error'] as any

  renderEach(ChatPromptSubmit, [
    // Props
    ['with icon', { props: { icon: 'i-lucide-send' } }],
    ...statuses.map((status: string) => [`with status ${status}`, { props: { status } }]),
    ['with class', { props: { class: '' } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(ChatPromptSubmit, {
      props: {
        status: 'ready'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
