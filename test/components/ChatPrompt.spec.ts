import { describe, it, expect, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { UIMessage } from 'ai'
import { renderEach } from '../component-render'
import ChatPrompt from '../../src/runtime/components/ChatPrompt.vue'
import ChatPromptSubmit from '../../src/runtime/components/ChatPromptSubmit.vue'
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
    ['with footer slot', { slots: { footer: () => 'Footer slot' } }],
    ['with body slot', { slots: { body: () => 'Body slot' } }],
    ['with files', { props: { files: [new File(['a'], 'notes.txt', { type: 'text/plain' })] } }],
    ['with queue', { props: { queue: [{ text: 'Next question' }, { text: '', files: [new File(['a'], 'notes.txt')] }] } }],
    ['with queue slot', { props: { queue: [{ text: 'Next question' }] }, slots: { queue: () => 'Queue slot' } }],
    ['with attachment', { props: { files: [new File(['a'], 'notes.txt', { type: 'text/plain' })], attachment: { variant: 'thumbnail', size: 'xl' } } }],
    ['with files slot', { props: { files: [new File(['a'], 'notes.txt', { type: 'text/plain' })] }, slots: { files: () => 'Files slot' } }]
  ])

  function paste(files: File[], text = '') {
    const event = new Event('paste', { bubbles: true, cancelable: true }) as ClipboardEvent
    Object.defineProperty(event, 'clipboardData', { value: { files, getData: (type: string) => type === 'text/plain' ? text : '' } })
    return event
  }

  function drag(type: string, dataTransfer: DataTransfer) {
    const event = new Event(type, { bubbles: true, cancelable: true }) as DragEvent
    Object.defineProperty(event, 'dataTransfer', { value: dataTransfer })
    return event
  }

  it('queues a submit while streaming with `v-model:queue`', async () => {
    const files = [new File(['a'], 'notes.txt')]
    const wrapper = await mountSuspended(ChatPrompt, {
      props: { 'modelValue': 'Next question', files, 'queue': [], 'status': 'streaming', 'onUpdate:queue': () => {} }
    })

    await wrapper.find('textarea').trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.emitted('update:queue')?.[0]).toEqual([[{ text: 'Next question', files }]])
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    expect(wrapper.emitted('update:files')?.[0]).toEqual([[]])
  })

  it('queues from `UChatPromptSubmit` while streaming when the prompt has text', async () => {
    const onStop = vi.fn()
    const wrapper = await mountSuspended(ChatPrompt, {
      props: { 'modelValue': '', 'queue': [], 'status': 'streaming', 'onUpdate:queue': () => {} },
      slots: { default: () => h(ChatPromptSubmit, { status: 'streaming', onStop }) },
      attachTo: document.body
    })
    const button = () => wrapper.findAll('button').at(-1)!

    expect(button().attributes('aria-label')).toBe('Stop generating')

    await wrapper.setProps({ modelValue: 'Next question' })
    expect(button().attributes('aria-label')).toBe('Send prompt')
    expect(button().attributes('type')).toBe('submit')

    await button().trigger('click')
    expect(onStop).not.toHaveBeenCalled()
    expect(wrapper.emitted('update:queue')?.[0]).toEqual([[{ text: 'Next question' }]])

    await wrapper.setProps({ modelValue: '' })
    expect(button().attributes('aria-label')).toBe('Stop generating')
    wrapper.unmount()
  })

  it('sends from `UChatPromptSubmit` while submitted when the prompt only has files', async () => {
    const wrapper = await mountSuspended(ChatPrompt, {
      props: { modelValue: '', files: [new File(['a'], 'notes.txt')], queue: [], status: 'submitted' },
      slots: { default: () => h(ChatPromptSubmit, { status: 'submitted' }) }
    })

    expect(wrapper.find('button[aria-label="Send prompt"]').exists()).toBe(true)
  })

  it('keeps `UChatPromptSubmit` on stop while streaming without `v-model:queue`', async () => {
    const wrapper = await mountSuspended(ChatPrompt, {
      props: { modelValue: 'Next question', status: 'streaming' },
      slots: { default: () => h(ChatPromptSubmit, { status: 'streaming' }) }
    })

    expect(wrapper.find('button[aria-label]').attributes('aria-label')).toBe('Stop generating')
  })

  describe('queued messages', () => {
    const queue = [{ text: 'First' }, { text: 'Second' }]

    async function mountQueue() {
      const wrapper = await mountSuspended(ChatPrompt, { props: { 'modelValue': 'Draft', queue, 'onUpdate:queue': () => {} } })
      return { wrapper, item: wrapper.findAll('[data-slot="queueItem"]')[1]! }
    }

    it('moves the message to the front and emits send', async () => {
      const { wrapper, item } = await mountQueue()
      await item.findAll('button').at(-3)!.trigger('click')

      expect(wrapper.emitted('send')?.[0]).toEqual([queue[1]])
      expect(wrapper.emitted('update:queue')?.at(-1)).toEqual([[queue[1], queue[0]]])
    })

    it('puts the message back in the prompt on edit', async () => {
      const { wrapper, item } = await mountQueue()
      await item.findAll('button').at(-2)!.trigger('click')

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Second\nDraft'])
      expect(wrapper.emitted('update:queue')?.[0]).toEqual([[queue[0]]])
    })

    it('puts a message without text back in the prompt without a blank line', async () => {
      const files = [new File(['a'], 'a.txt')]
      const wrapper = await mountSuspended(ChatPrompt, { props: { modelValue: 'Draft', files: [], queue: [{ text: '', files }] } })
      await wrapper.findAll('[data-slot="queueItem"] button').at(-2)!.trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      expect(wrapper.emitted('update:files')?.[0]).toEqual([files])
    })

    it('moves the message to the front with a bound `v-model:queue`', async () => {
      const model = ref([...queue])
      const Parent = defineComponent({
        setup: () => () => h(ChatPrompt, { 'queue': model.value, 'onUpdate:queue': (value?: any[]) => (model.value = value ?? []) })
      })

      const wrapper = await mountSuspended(Parent)
      await wrapper.findAll('[data-slot="queueItem"]')[1]!.findAll('button').at(-3)!.trigger('click')

      expect(model.value).toEqual([queue[1], queue[0]])
    })

    it('keeps the message while the chat errored', async () => {
      const wrapper = await mountSuspended(ChatPrompt, { props: { queue, 'error': new Error('Error'), 'onUpdate:queue': () => {} } })
      const item = wrapper.findAll('[data-slot="queueItem"]')[1]!

      await item.findAll('button').at(-3)!.trigger('click')
      await item.findAll('button').at(-2)!.trigger('click')

      expect(wrapper.emitted('send')).toBeUndefined()
      expect(wrapper.emitted('update:queue')).toBeUndefined()
    })

    it('does not edit a message with files without `v-model:files`', async () => {
      const wrapper = await mountSuspended(ChatPrompt, { props: { queue: [{ text: 'With a file', files: [new File(['a'], 'a.txt')] }] } })

      await wrapper.findAll('[data-slot="queueItem"] button').at(-2)!.trigger('click')

      expect(wrapper.emitted('update:queue')).toBeUndefined()
    })

    it('does not edit a message with files past the `multiple` limit', async () => {
      const wrapper = await mountSuspended(ChatPrompt, {
        props: { files: [new File(['a'], 'a.txt')], multiple: false, queue: [{ text: 'With a file', files: [new File(['b'], 'b.txt')] }] }
      })

      await wrapper.findAll('[data-slot="queueItem"] button').at(-2)!.trigger('click')

      expect(wrapper.emitted('update:queue')).toBeUndefined()
    })

    it('removes the message', async () => {
      const { wrapper, item } = await mountQueue()
      await item.findAll('button').at(-1)!.trigger('click')

      expect(wrapper.emitted('send')).toBeUndefined()
      expect(wrapper.emitted('update:queue')?.[0]).toEqual([[queue[0]]])
    })
  })

  describe('with a queue the app keeps', () => {
    const queue: UIMessage[] = [
      { id: '1', role: 'user', parts: [{ type: 'text', text: 'First' }] },
      { id: '2', role: 'user', parts: [{ type: 'text', text: 'Second' }] }
    ]

    async function mountQueue(props: Record<string, any> = {}) {
      const wrapper = await mountSuspended(ChatPrompt, { props: { modelValue: 'Draft', queue: [...queue], ...props } })
      return { wrapper, item: wrapper.findAll('[data-slot="queueItem"]')[1]! }
    }

    it('lists the text of the messages', async () => {
      const { wrapper } = await mountQueue()

      expect(wrapper.findAll('[data-slot="queueItemLabel"]').map(label => label.text())).toEqual(['First', 'Second'])
    })

    it('emits a submit while streaming for the app to queue', async () => {
      const { wrapper } = await mountQueue({ modelValue: 'Next question', status: 'streaming' })
      await wrapper.find('textarea').trigger('keydown', { key: 'Enter' })

      expect(wrapper.emitted('submit')).toHaveLength(1)
      expect(wrapper.emitted('update:queue')).toBeUndefined()
    })

    it('emits send without moving the message', async () => {
      const { wrapper, item } = await mountQueue()
      await item.findAll('button').at(-3)!.trigger('click')

      expect(wrapper.emitted('send')?.[0]).toEqual([queue[1]])
      expect(wrapper.emitted('update:queue')).toBeUndefined()
    })

    it('emits remove', async () => {
      const { wrapper, item } = await mountQueue()
      await item.findAll('button').at(-1)!.trigger('click')

      expect(wrapper.emitted('remove')?.[0]).toEqual([queue[1]])
      expect(wrapper.emitted('update:queue')).toBeUndefined()
    })

    it('puts the message back in the prompt and emits remove on edit', async () => {
      const { wrapper, item } = await mountQueue()
      await item.findAll('button').at(-2)!.trigger('click')

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Second\nDraft'])
      expect(wrapper.emitted('remove')?.[0]).toEqual([queue[1]])
    })

    it('emits send while the chat errored to resume the queue', async () => {
      const { wrapper, item } = await mountQueue({ error: new Error('Error') })
      await item.findAll('button').at(-3)!.trigger('click')

      expect(wrapper.emitted('send')?.[0]).toEqual([queue[1]])
    })

    it('does not edit a message with file parts', async () => {
      const wrapper = await mountSuspended(ChatPrompt, {
        props: { files: [], queue: [{ id: '1', role: 'user', parts: [{ type: 'file', mediaType: 'image/png', filename: 'a.png', url: 'data:image/png;base64,' }] }] }
      })

      expect(wrapper.find('[data-slot="queueItemLabel"]').text()).toBe('a.png')

      await wrapper.findAll('[data-slot="queueItem"] button').at(-2)!.trigger('click')
      expect(wrapper.emitted('remove')).toBeUndefined()
    })
  })

  it('emits submit with files and no text', async () => {
    const wrapper = await mountSuspended(ChatPrompt, {
      props: { files: [new File(['a'], 'notes.txt', { type: 'text/plain' })] }
    })

    await wrapper.find('textarea').trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('submit')).toHaveLength(1)
  })

  it('adds the accepted files on paste', async () => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:image')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})

    const wrapper = await mountSuspended(ChatPrompt, {
      props: { files: [], accept: 'image/*' }
    })

    const image = new File(['a'], 'image.png', { type: 'image/png' })
    const event = paste([image, new File(['b'], 'notes.txt', { type: 'text/plain' })])
    wrapper.find('textarea').element.dispatchEvent(event)

    expect(event.defaultPrevented).toBe(true)
    expect(wrapper.emitted('update:files')?.[0]).toEqual([[image]])
  })

  it('keeps the text of a paste that also holds files', async () => {
    const wrapper = await mountSuspended(ChatPrompt, {
      props: { files: [] }
    })

    const file = new File(['a'], 'notes.txt', { type: 'text/plain' })
    const event = paste([file], 'Some text')
    wrapper.find('textarea').element.dispatchEvent(event)

    expect(event.defaultPrevented).toBe(false)
    expect(wrapper.emitted('update:files')?.[0]).toEqual([[file]])
  })

  it('adds the files pasted in a custom body', async () => {
    const wrapper = await mountSuspended(ChatPrompt, {
      props: { files: [] },
      slots: { body: () => h('div', { contenteditable: true }) }
    })

    const file = new File(['a'], 'notes.txt', { type: 'text/plain' })
    wrapper.find('[contenteditable]').element.dispatchEvent(paste([file]))

    expect(wrapper.emitted('update:files')?.[0]).toEqual([[file]])
  })

  it('ignores pasted files without `v-model:files`', async () => {
    const wrapper = await mountSuspended(ChatPrompt)

    const event = paste([new File(['a'], 'image.png', { type: 'image/png' })])
    wrapper.find('textarea').element.dispatchEvent(event)

    expect(event.defaultPrevented).toBe(false)
    expect(wrapper.emitted('update:files')).toBeUndefined()
  })

  it('keeps one file when multiple is false', async () => {
    const wrapper = await mountSuspended(ChatPrompt, {
      props: { files: [new File(['a'], 'a.txt')], multiple: false }
    })

    const file = new File(['b'], 'b.txt')
    wrapper.find('textarea').element.dispatchEvent(paste([file]))

    expect(wrapper.emitted('update:files')?.[0]).toEqual([[file]])
  })

  it('adds the files of a drop', async () => {
    const wrapper = await mountSuspended(ChatPrompt, {
      props: { files: [] }
    })

    const file = new File(['a'], 'notes.txt', { type: 'text/plain' })
    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(file)
    const textarea = wrapper.find('textarea').element

    const enter = drag('dragenter', dataTransfer)
    textarea.dispatchEvent(enter)
    await nextTick()

    expect(enter.defaultPrevented).toBe(true)
    expect(wrapper.attributes('data-dragging')).toBe('true')

    const drop = drag('drop', dataTransfer)
    textarea.dispatchEvent(drop)
    await nextTick()

    expect(drop.defaultPrevented).toBe(true)
    expect(wrapper.attributes('data-dragging')).toBe('false')
    expect(wrapper.emitted('update:files')?.[0]).toEqual([[file]])
  })

  it('leaves a text drag to the browser', async () => {
    const wrapper = await mountSuspended(ChatPrompt, {
      props: { files: [] }
    })

    const dataTransfer = new DataTransfer()
    dataTransfer.setData('text/plain', 'Some text')
    const textarea = wrapper.find('textarea').element

    const enter = drag('dragenter', dataTransfer)
    textarea.dispatchEvent(enter)
    await nextTick()

    expect(wrapper.attributes('data-dragging')).toBe('false')

    const over = drag('dragover', dataTransfer)
    const drop = drag('drop', dataTransfer)
    textarea.dispatchEvent(over)
    textarea.dispatchEvent(drop)

    expect([enter, over, drop].map(event => event.defaultPrevented)).toEqual([false, false, false])
    expect(wrapper.emitted('update:files')).toBeUndefined()
  })

  it('removes a file from its attachment', async () => {
    const files = [new File(['a'], 'a.txt'), new File(['b'], 'b.txt')]
    const wrapper = await mountSuspended(ChatPrompt, {
      props: { files }
    })

    await wrapper.findAll('[data-slot="remove"]')[0]!.trigger('click')

    expect(wrapper.emitted('update:files')?.[0]).toEqual([[files[1]]])
  })

  it('emits submit on Enter', async () => {
    const wrapper = await mountSuspended(ChatPrompt, {
      props: { modelValue: 'Hello' }
    })

    const textarea = wrapper.find('textarea')
    await textarea.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('submit')).toHaveLength(1)
  })

  it.each(['submitted', 'streaming'] as const)('does not emit submit on Enter while %s', async (status) => {
    const wrapper = await mountSuspended(ChatPrompt, {
      props: { modelValue: 'Hello', status }
    })

    await wrapper.find('textarea').trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('submit')).toBeUndefined()
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
    const wrapper = await mountSuspended(ChatPrompt, {
      props: { modelValue: 'Hello' }
    })

    vi.useFakeTimers()
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

  it('replaces the textarea with the body slot', async () => {
    const wrapper = await mountSuspended(ChatPrompt, {
      slots: { body: () => h('div', { 'data-test': 'editor' }, 'Custom body') }
    })

    expect(wrapper.find('textarea').exists()).toBe(false)
    expect(wrapper.find('[data-test="editor"]').text()).toBe('Custom body')
  })

  it('exposes submit and close to the body slot', async () => {
    const slotProps: { submit?: () => void, close?: () => void } = {}
    const wrapper = await mountSuspended(ChatPrompt, {
      props: { modelValue: 'Hello' },
      slots: {
        body: (props: any) => {
          slotProps.submit = props.submit
          slotProps.close = props.close
          return h('div', 'body')
        }
      }
    })

    slotProps.submit?.()
    expect(wrapper.emitted('submit')).toHaveLength(1)

    slotProps.close?.()
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('does not emit submit from the body slot when the value is empty', async () => {
    const slotProps: { submit?: () => void } = {}
    const wrapper = await mountSuspended(ChatPrompt, {
      props: { modelValue: '  ' },
      slots: {
        body: (props: any) => {
          slotProps.submit = props.submit
          return h('div', 'body')
        }
      }
    })

    slotProps.submit?.()

    expect(wrapper.emitted('submit')).toBeUndefined()
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
