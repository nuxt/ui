import { describe, it, expect, vi } from 'vitest'
import { defineComponent, h, nextTick, ref, shallowRef, triggerRef } from 'vue'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import ChatMessages, { type ChatMessagesSlots } from '../../src/runtime/components/ChatMessages.vue'

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
    ['with footer slot', { props, slots: { footer: () => 'Footer slot' } }],
    ['with content slot', { props, slots: { content: () => 'Content slot' } }],
    ['with files slot', { props, slots: { files: () => 'Files slot' } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(ChatMessages, {
      props
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  it('sets aria-label on the auto scroll button', async () => {
    const Parent = defineComponent({
      setup() {
        return () => h('div', { style: 'overflow-y: auto' }, [h(ChatMessages, { ...props, shouldScrollToBottom: false })])
      }
    })

    const wrapper = await mountSuspended(Parent, { attachTo: document.body })
    Object.defineProperties(wrapper.element, {
      scrollHeight: { value: 1000 },
      clientHeight: { value: 100 }
    })
    wrapper.element.dispatchEvent(new Event('scroll'))
    await nextTick()

    const button = wrapper.find('[data-slot="autoScroll"]')
    expect(button.attributes('aria-label')).toBe('Scroll to bottom')
    expect(await axe(wrapper.element)).toHaveNoViolations()

    wrapper.unmount()
  })

  it.each([
    ['without', undefined, 'absolute'],
    ['with', () => 'Prompt', 'sticky']
  ])('positions the auto scroll button %s a footer', async (_, footer, position) => {
    const Parent = defineComponent({
      setup() {
        return () => h('div', { style: 'overflow-y: auto' }, [h(ChatMessages, { ...props, shouldScrollToBottom: false }, footer ? { footer } : {})])
      }
    })

    const wrapper = await mountSuspended(Parent, { attachTo: document.body })
    Object.defineProperties(wrapper.element, {
      scrollHeight: { value: 1000 },
      clientHeight: { value: 100 }
    })
    wrapper.element.dispatchEvent(new Event('scroll'))
    await nextTick()

    const viewport = wrapper.find('[data-slot="viewport"]').classes()
    expect(viewport).toContain(position)
    expect(viewport.includes('top-[86%]')).toBe(position === 'absolute')

    wrapper.unmount()
  })

  it('scrolls the scroll parent in `scrollToMessage`', async () => {
    const chatRef = ref<{ scrollToMessage: (id: string, smooth?: boolean) => void } | null>(null)
    const Parent = defineComponent({
      setup() {
        return () => h('div', { style: 'overflow-y: auto; scroll-padding-top: 8px' }, [h(ChatMessages, { ref: chatRef, ...props, shouldScrollToBottom: false })])
      }
    })

    const wrapper = await mountSuspended(Parent, { attachTo: document.body })
    vi.spyOn(wrapper.element, 'getBoundingClientRect').mockReturnValue({ top: 100 } as DOMRect)
    for (const article of wrapper.findAll('article')) {
      (article.element as HTMLElement).style.scrollMarginTop = '4px'
      vi.spyOn(article.element, 'getBoundingClientRect').mockReturnValue({ top: 150 } as DOMRect)
    }
    const scrollTo = vi.fn()
    wrapper.element.scrollTo = scrollTo
    const scrollIntoView = vi.spyOn(Element.prototype, 'scrollIntoView')

    chatRef.value!.scrollToMessage(props.messages[0]!.id, false)

    expect(scrollTo).toHaveBeenCalledWith({ top: 38, behavior: 'instant' })
    expect(scrollIntoView).not.toHaveBeenCalled()

    scrollIntoView.mockRestore()
    wrapper.unmount()
  })

  it('measures the room and scrolls on the frame after a submit', async () => {
    const messages = shallowRef([props.messages[1]!, { ...props.messages[0]!, id: 'm-user' }])
    const status = ref<'ready' | 'submitted'>('ready')
    const Parent = defineComponent({
      setup() {
        return () => h('div', { style: 'overflow-y: auto' }, [h(ChatMessages, { messages: messages.value, status: status.value, shouldScrollToBottom: false }, { footer: () => 'Prompt' })])
      }
    })

    const wrapper = await mountSuspended(Parent, { attachTo: document.body })
    vi.spyOn(wrapper.element, 'getBoundingClientRect').mockReturnValue({ top: 0, height: 500 } as DOMRect)
    const scrollTo = vi.fn()
    wrapper.element.scrollTo = scrollTo
    const footer = wrapper.find('[data-slot="footer"]').element
    const footerHeight = vi.spyOn(footer as HTMLElement, 'offsetHeight', 'get').mockReturnValue(200)
    for (const article of wrapper.findAll('article')) {
      vi.spyOn(article.element as HTMLElement, 'offsetHeight', 'get').mockReturnValue(50)
    }

    status.value = 'submitted'
    await nextTick()
    await nextTick()
    expect(scrollTo).not.toHaveBeenCalled()

    // The prompt shrinks once cleared, after the submit
    footerHeight.mockReturnValue(100)
    await new Promise(resolve => requestAnimationFrame(resolve))
    await nextTick()

    expect((wrapper.find('[role="log"]').element as HTMLElement).style.getPropertyValue('--last-message-height')).toBe('350px')
    expect(scrollTo).toHaveBeenCalledOnce()

    wrapper.unmount()
  })

  it('sets aria-busy while submitted or streaming', async () => {
    const wrapper = await mountSuspended(ChatMessages, { props: { ...props, status: 'ready' } })
    expect(wrapper.attributes('aria-busy')).toBeUndefined()

    await wrapper.setProps({ status: 'submitted' })
    expect(wrapper.attributes('aria-busy')).toBe('true')

    await wrapper.setProps({ status: 'streaming' })
    expect(wrapper.attributes('aria-busy')).toBe('true')

    await wrapper.setProps({ status: 'ready' })
    expect(wrapper.attributes('aria-busy')).toBeUndefined()
  })

  it('forwards content slot props together with `message`', async () => {
    const messages = [
      { id: 'm-1', role: 'user' as const, parts: [{ type: 'text' as const, text: 'a' }], metadata: { foo: 'bar' } },
      { id: 'm-2', role: 'assistant' as const, parts: [{ type: 'text' as const, text: 'b' }] }
    ]
    const captured: Parameters<Exclude<ChatMessagesSlots['content'], undefined>>[0][] = []
    await mountSuspended(ChatMessages, {
      props: { messages },
      slots: {
        content: (slotProps) => {
          captured.push(slotProps)
          return 'x'
        }
      }
    })

    expect(captured).toHaveLength(2)
    expect(captured[0]).toMatchObject({
      id: 'm-1',
      role: 'user',
      parts: messages[0]!.parts,
      metadata: { foo: 'bar' },
      message: messages[0]
    })
    expect(captured[1]).toMatchObject({
      id: 'm-2',
      role: 'assistant',
      parts: messages[1]!.parts,
      message: messages[1]
    })
  })

  it('passes `streaming` to forwarded slots for the last message only', async () => {
    const messages = [
      { id: 'm-1', role: 'user' as const, parts: [{ type: 'text' as const, text: 'a' }] },
      { id: 'm-2', role: 'assistant' as const, parts: [{ type: 'text' as const, text: 'b' }] }
    ]
    const captured: Record<string, boolean>[] = []
    const wrapper = await mountSuspended(ChatMessages, {
      props: { messages, status: 'streaming' },
      slots: {
        content: ({ message, streaming }) => {
          captured.push({ [message.role]: streaming })
          return 'x'
        }
      }
    })

    expect(captured).toEqual([{ user: false }, { assistant: true }])

    captured.length = 0
    await wrapper.setProps({ status: 'ready' })
    expect(captured).toEqual([{ user: false }, { assistant: false }])
  })

  it('hides the streaming indicator once the assistant message produces parts', async () => {
    // Reproduces the `@ai-sdk/vue` reactivity model: messages live in a `shallowRef`
    // and grow via in-place mutation + `triggerRef`, so neither the array nor the
    // message objects ever change identity. When the server assigns the assistant
    // message id, an empty assistant message is flushed before any content, so the
    // indicator must appear then disappear as soon as parts stream in.
    const messages = shallowRef<any[]>([
      { id: 'u1', role: 'user', parts: [{ type: 'text', text: 'hi' }] },
      { id: 'a1', role: 'assistant', parts: [] }
    ])
    // A separate reactive value bound to a prop, used only to force ChatMessages to
    // re-render on each tick, mimicking how streamed content forces re-renders in a
    // real app (dynamic slots / non-static prop references).
    const tick = ref(0)

    const Parent = defineComponent({
      setup() {
        return () => h(ChatMessages, { messages: messages.value, status: 'streaming', spacingOffset: tick.value })
      }
    })

    const wrapper = await mountSuspended(Parent)

    // Empty assistant message -> indicator visible.
    expect(wrapper.find('[data-slot="indicator"]').exists()).toBe(true)

    // Stream the first part in place + triggerRef, and force a re-render.
    messages.value[1]!.parts.push({ type: 'text', text: 'Hello' })
    triggerRef(messages)
    tick.value++
    await nextTick()

    // A cached `computed` would stay stuck on its first `streaming` result here;
    // the indicator must now be gone.
    expect(wrapper.find('[data-slot="indicator"]').exists()).toBe(false)
  })

  it('forwards `message` to the actions slot', async () => {
    const captured: Parameters<Exclude<ChatMessagesSlots['actions'], undefined>>[0][] = []
    await mountSuspended(ChatMessages, {
      props: {
        ...props,
        user: { actions: [{ icon: 'i-lucide-copy', label: 'Copy' }] },
        assistant: { actions: [{ icon: 'i-lucide-copy', label: 'Copy' }] }
      },
      slots: {
        actions: (slotProps) => {
          captured.push(slotProps)
          return 'x'
        }
      }
    })

    expect(captured.length).toBeGreaterThan(0)
    for (const p of captured) {
      expect(p).toHaveProperty('message')
      expect(p).toHaveProperty('actions')
    }
  })
})
