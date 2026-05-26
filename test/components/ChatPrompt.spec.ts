import { describe, it, expect, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import ChatPrompt from '../../src/runtime/components/ChatPrompt.vue'
import theme from '#build/ui/chat-prompt'

describe('ChatPrompt', () => {
  const variants = Object.keys(theme.variants.variant) as any

  renderEach(ChatPrompt, [
    // Props
    ['with placeholder', { props: { placeholder: 'Placeholder' } }],
    ['with error', { props: { error: new Error('Error') } }],
    ...variants.map((variant: string) => [`with variant ${variant}`, { props: { variant } }]),
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'p-5' } }],
    ['with ui', { props: { ui: { footer: 'justify-end' } } }],
    // Slots
    ['with header slot', { slots: { header: () => 'Header slot' } }],
    ['with footer slot', { slots: { footer: () => 'Footer slot' } }]
  ])

  it('emits submit on Enter', async () => {
    const wrapper = await mountSuspended(ChatPrompt, {
      props: { modelValue: 'Hello' }
    })

    const textarea = wrapper.find('textarea')
    await textarea.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('submit')).toHaveLength(1)
  })

  it('does not emit submit on Enter during composition', async () => {
    const wrapper = await mountSuspended(ChatPrompt, {
      props: { modelValue: 'Hello' }
    })

    const textarea = wrapper.find('textarea')
    await textarea.trigger('keydown', { key: 'Enter', isComposing: true })

    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('does not emit submit on Enter immediately after compositionend', async () => {
    const wrapper = await mountSuspended(ChatPrompt, {
      props: { modelValue: 'Hello' }
    })

    const textarea = wrapper.find('textarea')
    await textarea.trigger('compositionend')
    await textarea.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('re-enables submit after compositionend cooldown', async () => {
    vi.useFakeTimers()

    const wrapper = await mountSuspended(ChatPrompt, {
      props: { modelValue: 'Hello' }
    })

    const textarea = wrapper.find('textarea')
    await textarea.trigger('compositionend')
    vi.advanceTimersByTime(50)
    await textarea.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('submit')).toHaveLength(1)

    vi.useRealTimers()
  })

  it('does not emit submit on Enter when submitOnEnter is false', async () => {
    const wrapper = await mountSuspended(ChatPrompt, {
      props: { modelValue: 'Hello', submitOnEnter: false }
    })

    const textarea = wrapper.find('textarea')
    await textarea.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('emits submit on Ctrl+Enter when submitOnEnter is false', async () => {
    const wrapper = await mountSuspended(ChatPrompt, {
      props: { modelValue: 'Hello', submitOnEnter: false }
    })

    const textarea = wrapper.find('textarea')
    await textarea.trigger('keydown', { key: 'Enter', ctrlKey: true })

    expect(wrapper.emitted('submit')).toHaveLength(1)
  })

  it('emits submit on Meta+Enter when submitOnEnter is false', async () => {
    const wrapper = await mountSuspended(ChatPrompt, {
      props: { modelValue: 'Hello', submitOnEnter: false }
    })

    const textarea = wrapper.find('textarea')
    await textarea.trigger('keydown', { key: 'Enter', metaKey: true })

    expect(wrapper.emitted('submit')).toHaveLength(1)
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(ChatPrompt, {
      props: {
        placeholder: 'Placeholder'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
