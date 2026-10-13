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

  it('hides the icon when icon is false', async () => {
    const withIcon = await mountSuspended(ChatPromptSubmit)
    expect(withIcon.find('[data-slot="leadingIcon"]').exists()).toBe(true)

    const withoutIcon = await mountSuspended(ChatPromptSubmit, { props: { icon: false } })
    expect(withoutIcon.find('[data-slot="leadingIcon"]').exists()).toBe(false)
  })

  it.each([
    ['ready', 'Send prompt'],
    ['submitted', 'Stop generating'],
    ['streaming', 'Stop generating'],
    ['error', 'Retry']
  ] as const)('sets aria-label when status is %s', async (status, label) => {
    const wrapper = await mountSuspended(ChatPromptSubmit, { props: { status } })

    expect(wrapper.find('button').attributes('aria-label')).toBe(label)
  })

  it('allows overriding aria-label through attrs', async () => {
    const wrapper = await mountSuspended(ChatPromptSubmit, {
      props: { status: 'streaming' },
      attrs: { 'aria-label': 'Cancel' }
    })

    expect(wrapper.find('button').attributes('aria-label')).toBe('Cancel')
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
