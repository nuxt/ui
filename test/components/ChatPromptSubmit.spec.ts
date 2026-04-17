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

  it('disables the button when status is ready and disabled is true', async () => {
    const wrapper = await mountSuspended(ChatPromptSubmit, {
      props: {
        status: 'ready',
        disabled: true
      }
    })

    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('does not disable the button when status is streaming even if disabled is true', async () => {
    const wrapper = await mountSuspended(ChatPromptSubmit, {
      props: {
        status: 'streaming',
        disabled: true
      }
    })

    expect(wrapper.find('button').attributes('disabled')).toBeUndefined()
  })

  it('does not disable the button when status is submitted even if disabled is true', async () => {
    const wrapper = await mountSuspended(ChatPromptSubmit, {
      props: {
        status: 'submitted',
        disabled: true
      }
    })

    expect(wrapper.find('button').attributes('disabled')).toBeUndefined()
  })

  it('does not disable the button when status is error even if disabled is true', async () => {
    const wrapper = await mountSuspended(ChatPromptSubmit, {
      props: {
        status: 'error',
        disabled: true
      }
    })

    expect(wrapper.find('button').attributes('disabled')).toBeUndefined()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(ChatPromptSubmit, {
      props: {
        status: 'ready'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
